import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseFormat, ResponseMessage, StatusCode } from '../common/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts', description: 'Retrieves a list of all blog posts.' })
  @ApiResponse({ status: StatusCode.SUCCESS, description: ResponseMessage.POST_LIST })
  async findAll() {
    const data = await this.postsService.findAll();
    return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_LIST, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID', description: 'Retrieves the details of a specific blog post by ID.' })
  @ApiResponse({ status: StatusCode.SUCCESS, description: ResponseMessage.POST_DETAILS })
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.postsService.findOne(id);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_DETAILS, data);
    } catch (error) {
      return ResponseFormat(StatusCode.NOT_FOUND, error.message);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a post', description: 'Creates a new blog post. Requires admin privileges.' })
  @ApiResponse({ status: StatusCode.CREATED, description: ResponseMessage.POST_CREATED })
  async create(@Body() createPostDto: CreatePostDto,  userId: string, @Req() req: any) {
    try {
      if (!req.user.isAdmin) {
        return ResponseFormat(StatusCode.FORBIDDEN, ResponseMessage.FORBIDDEN);
      }
      const data = await this.postsService.create(createPostDto, userId);
      return ResponseFormat(StatusCode.CREATED, ResponseMessage.POST_CREATED, data);
    } catch (error) {
      return ResponseFormat(StatusCode.BAD_REQUEST, error.message);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a post', description: 'Updates an existing blog post by ID. Requires admin privileges.' })
  @ApiResponse({ status: StatusCode.SUCCESS, description: ResponseMessage.POST_UPDATED })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, userId: string,@Req() req: any) {
    try {
      if (!req.user.isAdmin) {
        return ResponseFormat(StatusCode.FORBIDDEN, ResponseMessage.FORBIDDEN);
      }
      const data = await this.postsService.update(id, updatePostDto, userId);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_UPDATED, data);
    } catch (error) {
      return ResponseFormat(StatusCode.NOT_FOUND, error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a post', description: 'Deletes a blog post by ID. Requires admin privileges.' })
  @ApiResponse({ status: StatusCode.SUCCESS, description: ResponseMessage.POST_DELETED })
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      if (!req.user.isAdmin) {
        return ResponseFormat(StatusCode.FORBIDDEN, ResponseMessage.FORBIDDEN);
      }
      await this.postsService.remove(id);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_DELETED);
    } catch (error) {
      return ResponseFormat(StatusCode.NOT_FOUND, error.message);
    }
  }
}

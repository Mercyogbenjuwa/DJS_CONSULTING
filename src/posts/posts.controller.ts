import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.postsService.findAll();
    return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_LIST, data);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID', description: 'Retrieves the details of a specific blog post by ID.' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.postsService.findOne(id);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_DETAILS, data);
    } catch (error) {
      throw new HttpException(
        ResponseFormat(StatusCode.NOT_FOUND, error.message),
        HttpStatus.NOT_FOUND,
      );
    }
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a post', description: 'Creates a new blog post. Requires admin privileges.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    try {
      if (!req.user.isAdmin) {
        throw new HttpException(
          ResponseFormat(StatusCode.FORBIDDEN, ResponseMessage.FORBIDDEN),
          HttpStatus.FORBIDDEN,
        );
      }
      const data = await this.postsService.create(createPostDto, req.user.id);
      return ResponseFormat(StatusCode.CREATED, ResponseMessage.POST_CREATED, data);
    } catch (error) {
      throw new HttpException(
        ResponseFormat(StatusCode.BAD_REQUEST, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a post', description: 'Updates an existing blog post by ID. Requires admin privileges.' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: any) {
    try {
      if (!req.user.isAdmin) {
        throw new HttpException(
          ResponseFormat(StatusCode.FORBIDDEN, ResponseMessage.FORBIDDEN),
          HttpStatus.FORBIDDEN,
        );
      }
      const data = await this.postsService.update(id, updatePostDto, req.user.id);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_UPDATED, data);
    } catch (error) {
      throw new HttpException(
        ResponseFormat(StatusCode.NOT_FOUND, error.message),
        HttpStatus.NOT_FOUND,
      );
    }
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a post', description: 'Deletes a blog post by ID. Requires admin privileges.' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      if (!req.user.isAdmin) {
        throw new HttpException(
          ResponseFormat(StatusCode.FORBIDDEN, ResponseMessage.FORBIDDEN),
          HttpStatus.FORBIDDEN,
        );
      }
      await this.postsService.remove(id);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.POST_DELETED);
    } catch (error) {
      throw new HttpException(
        ResponseFormat(StatusCode.NOT_FOUND, error.message),
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

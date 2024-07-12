import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPostsService } from './interfaces/posts.service.interface/posts.service.interface.interface';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { Post } from './entities/post/post';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { logger } from 'src/common/logger';
import { User } from 'src/auth/entities/user/user';


@Injectable()
export class PostsService implements IPostsService {
  private logPrefix: string = '[POST_SERVICE_LOGS]';
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ 
      where: { id },
      relations: ['user'], 
    });
    logger.info(
      `${this.logPrefix} Post fetched successfully: ${JSON.stringify(
        post,
      )}`,
    );
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }


  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const post = this.postsRepository.create({
      ...createPostDto,
      user
    });
  logger.info(
      `${this.logPrefix} Post created successfully: ${JSON.stringify(post)}`,
    );
    return this.postsRepository.save(post); 
  }


  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const post = await this.postsRepository.preload({
      id,
      ...updatePostDto,
      user
    });
    logger.info(
      `${this.logPrefix} Post updated successfully: ${JSON.stringify(
        post,
      )}`,
    );
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }

}

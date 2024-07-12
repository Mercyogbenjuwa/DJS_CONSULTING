import { CreatePostDto } from "src/posts/dto/create-post.dto/create-post.dto";
import { UpdatePostDto } from "src/posts/dto/update-post.dto/update-post.dto";
import { Post } from "src/posts/entities/post/post";


export interface IPostsService {
  findAll(): Promise<Post[]>;
  findOne(id: string): Promise<Post>;
  create(createPostDto: CreatePostDto, userId: string): Promise<Post>;
  update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post>;
  remove(id: string): Promise<void>;
}

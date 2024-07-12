import { Post } from 'src/posts/entities/post/post';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  profileUrl: string;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

}

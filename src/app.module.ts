import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Post } from './posts/entities/post/post';
import { User } from './auth/entities/user/user';
import { JwtStrategy } from './auth/jwt.strategy/jwt.strategy';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Post, User],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false, 
      },
    }),
    TypeOrmModule.forFeature([Post, User]),
    AuthModule,
    PostsModule,
    PassportModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}

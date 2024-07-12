import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user/user'; // Adjust path as per your project structure
import { JwtStrategy } from './jwt.strategy/jwt.strategy'; // Assuming you have a JwtStrategy

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Import TypeOrmModule with User entity
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Ensure JwtStrategy is provided
  exports: [JwtModule], // Export JwtModule if needed in other modules
})
export class AuthModule {}

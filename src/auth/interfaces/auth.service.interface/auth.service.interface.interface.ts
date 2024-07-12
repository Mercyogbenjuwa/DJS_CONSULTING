import { LoginDto } from "src/auth/dto/login.dto/login.dto";
import { User } from "src/auth/entities/user/user";


export interface IAuthService {
  validateUser(email: string, password: string): Promise<User | null>;
  login(data: LoginDto): Promise<{ accessToken: string }>;
  register(email: string, password: string, profileUrl: string): Promise<User>;
}

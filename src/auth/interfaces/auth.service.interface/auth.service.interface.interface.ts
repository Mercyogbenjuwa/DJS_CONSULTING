import { User } from "src/auth/entities/user/user";


export interface IAuthService {
  validateUser(email: string, password: string): Promise<User | null>;
  login(email: string, password: string): Promise<{ accessToken: string }>;
  register(email: string, password: string): Promise<User>;
}

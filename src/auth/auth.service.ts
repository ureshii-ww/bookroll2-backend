import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SessionsService } from '../sessions/sessions.service';
import { User } from '../user/schemas/user.schema';
import { LoginServiceInterface } from './interface/loginService.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private SessionService: SessionsService){}

  async register(registerDto: RegisterDto): Promise<User> {
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(registerDto.password, 8);
    const userData = await this.userService.generateNewUserData();

    return await this.userService.createUser({
      ...registerDto,
      password: hashPassword,
      ...userData
    })
  }

  async login(loginDto: LoginDto): Promise<LoginServiceInterface> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({message: 'Wrong email or password', status: HttpStatus.UNAUTHORIZED});
    }

    const passwordEquals = await bcrypt.compare(loginDto.password, user.password)

    if (passwordEquals) {
      const tokens = await this.SessionService.createSession(user._id);
      return {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
        userData: {
          username: user.username,
          url: user.url,
          color: user.color,
          emoji: user.emoji,
          roles: user.roles
        }
      }
    }
    throw new UnauthorizedException({message: 'Wrong email or password', status: HttpStatus.UNAUTHORIZED});
  }
}

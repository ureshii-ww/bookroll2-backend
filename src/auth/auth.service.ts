import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable, UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SessionsService } from '../sessions/sessions.service';
import { AuthUserDataWithTokens } from './types/authUserDataWithTokens';
import { RefreshSessionDto } from './dto/refreshSession.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private SessionService: SessionsService) {
  }

  async register(registerDto: RegisterDto) {
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword: string = await bcrypt.hash(registerDto.password, 8);
    const generatedUserData = await this.userService.generateNewUserData();

    return await this.userService.createUser({
      ...registerDto,
      password: hashPassword,
      ...generatedUserData
    })  
  }

  async login(loginDto: LoginDto): Promise<AuthUserDataWithTokens> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new ForbiddenException({ message: 'Неверный email или пароль' });
    }

    const passwordEquals: boolean = await bcrypt.compare(loginDto.password, user.password)

    if (passwordEquals) {
      const tokens = await this.SessionService.createSession(user._id, user.url, user.roles);

      return {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
        userData: {
          username: user.username,
          url: user.url,
          color: user.color,
          emoji: user.emoji,
          roles: user.roles,
          isEmailConfirmed: user.isEmailConfirmed,
          club: user.club?.url || null
        }
      }
    }

    throw new ForbiddenException({ message: 'Неверный email или пароль', status: HttpStatus.UNAUTHORIZED });
  }

  async logout(refreshToken: string) {
    return this.SessionService.deleteSession(refreshToken);
  }

  async refreshSession({userUrl}: RefreshSessionDto, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUserByUrl(userUrl);
    if (!user) {
      throw new UnauthorizedException();
    }

    const session = await this.SessionService.getSession(refreshToken);
    if (!session || session.userId.url !== userUrl) {
      throw new UnauthorizedException();
    }

    await this.SessionService.deleteSession(refreshToken);
    return this.SessionService.createSession(user._id, user.url, user.roles);
  }
}

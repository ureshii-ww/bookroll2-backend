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
import { UserDocument } from '../user/schemas/user.schema';
import { SessionTokens } from '../sessions/interfaces/sessionTokens.interface';
import { AuthData } from './interfaces/authData.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private SessionService: SessionsService){}

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword: string = await bcrypt.hash(registerDto.password, 8);
    const userData = await this.userService.generateNewUserData();

    return await this.userService.createUser({
      ...registerDto,
      password: hashPassword,
      ...userData
    })
  }

  async login(loginDto: LoginDto): Promise<AuthData & SessionTokens> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({message: 'Wrong email or password', status: HttpStatus.UNAUTHORIZED});
    }

    const passwordEquals: boolean = await bcrypt.compare(loginDto.password, user.password)

    if (passwordEquals) {
      //mongoose + TS bug workaround
      const rolesArray: string[] = user.roles.map(role => role.toString());

      const tokens = await this.SessionService.createSession({
        userId: user._id,
        url: user.url,
        roles: rolesArray
      });
      return {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
        userData: {
          username: user.username,
          url: user.url,
          color: user.color,
          emoji: user.emoji,
          roles: user.roles,
          isEmailConfirmed: user.isEmailConfirmed
        }
      }
    }
    throw new UnauthorizedException({message: 'Wrong email or password', status: HttpStatus.UNAUTHORIZED});
  }
}

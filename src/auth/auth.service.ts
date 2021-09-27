import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService){}

  async register(registerDto: RegisterDto) {
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

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    const passwordEquals = await bcrypt.compare(loginDto.password, user.password);

    if (user && passwordEquals) {

      return user;
    }
    throw new UnauthorizedException({message: 'Wrong email or password'});
  }
}

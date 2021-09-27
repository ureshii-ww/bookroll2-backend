import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/schemas/user.schema';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {
  }

  @ApiOperation({summary: 'Registration'})
  @ApiBody({type: RegisterDto})
  @ApiResponse({status: 201, description: 'User registered successfully'})
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<string> {
    const newUser = await this.AuthService.register(registerDto);
    return 'User registered successfully';
  }

  @ApiOperation({summary: 'Login'})
  @ApiBody({type: LoginDto})
  @ApiResponse({status: 200, type: User})
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto): Promise<User> {
    return this.AuthService.login(loginDto);
  }
}

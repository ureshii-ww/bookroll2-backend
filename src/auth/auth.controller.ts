import { Body, Controller, Get, HttpCode, Post, Response } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/schemas/user.schema';
import * as ms from 'ms';
import { REFRESH_TOKEN_EXPIRES } from '../constants/refresh-token-expires';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {
  }

  @ApiOperation({summary: 'Registration'})
  @ApiBody({type: RegisterDto})
  @ApiResponse({status: 201, description: 'User registered successfully'})
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const newUser = await this.AuthService.register(registerDto);
    return 'User registered successfully';
  }

  @ApiOperation({summary: 'Login'})
  @ApiBody({type: LoginDto})
  @ApiResponse({status: 200, type: User})
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Response() res) {
    const authData = await this.AuthService.login(loginDto);

    return res
      .cookie('refreshToken', authData.refreshToken, {
        maxAge: ms(REFRESH_TOKEN_EXPIRES),
        httpOnly: true,
        //secure: true
      })
      .set({ 'x-access-token': authData.accessToken })
      .json(authData.userData);
  }

}

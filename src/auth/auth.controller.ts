import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/schemas/user.schema';
import * as ms from 'ms';
import { REFRESH_TOKEN_EXPIRES } from '../constants/refresh-token-expires';
import { Request, Response } from 'express';

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
  async login(@Body() loginDto: LoginDto, @Res() res) {
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

  @Get('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    const {refreshToken} = req.cookies;
    await this.AuthService.logout(refreshToken);
    res.clearCookie('refreshToken');
  }
}

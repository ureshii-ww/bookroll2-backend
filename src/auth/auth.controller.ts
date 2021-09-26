import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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
}

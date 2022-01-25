import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from './types/userInfo';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @ApiOperation({summary: 'Get user info'})
  @ApiResponse({status: 200, type: UserInfo})
  @ApiParam({name: 'userUrl', required: true, description: 'User\'s url', example: '8YoCsYP5QGx_'})
  @Get(':userUrl/info')
  getInfo(@Param('userUrl') userUrl: string) {
    return this.userService.getUserInfo(userUrl);
  }

}

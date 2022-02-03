import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from './types/userInfo';
import { TokensGuard } from '../tokens/tokens.guard';
import { Response } from 'express';

@ApiTags('User')
@ApiHeader({ name: 'Authorization', description: 'Bearer token' })
@Controller('user')
@UseGuards(TokensGuard)
export class UserController {
  constructor(private userService: UserService) {
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({ status: 200, type: UserInfo })
  @ApiParam({ name: 'userUrl', required: true, description: 'User\'s url', example: '8YoCsYP5QGx_' })
  @Get(':userUrl/info')
  getInfo(@Param('userUrl') userUrl: string) {
    return this.userService.getUserInfo(userUrl);
  }

  @Get(':userUrl/books')
  async getBooks(@Param('userUrl') userUrl: string,
                 @Query('page') page: number,
                 @Query('size') size: number,
                 @Res() res: Response) {
    const serviceData = await this.userService.getUserBooks(userUrl, page, size);
    if (serviceData && serviceData.length > 0) {
      res.set({ 'x-data-length': serviceData.length }).json(serviceData.list);
    } else {
      res.set({ 'x-data-length': 0 }).send([]);
    }
  }
}

import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from './types/userInfo';
import { TokensGuard } from '../tokens/tokens.guard';
import { Response } from 'express';
import { Book } from '../book/schemas/book.schema';
import { DeleteBookDto } from './dto/deleteBookDto';
import { ReqWithTokensData } from '../tokens/types/reqWithTokensData.interface';
import { UpdateInfoDto } from './dto/update-info-dto';
import { UpdatePasswordDto } from './dto/update-password-dto';

@ApiTags('User')
@ApiHeader({ name: 'Authorization', description: 'Bearer token' })
@Controller('user')
@UseGuards(TokensGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({ status: 200, type: UserInfo })
  @ApiParam({ name: 'userUrl', required: true, description: "User's url", example: '8YoCsYP5QGx_' })
  @Get(':userUrl/info')
  getInfo(@Param('userUrl') userUrl: string) {
    return this.userService.getUserInfo(userUrl);
  }

  @ApiOperation({ summary: 'Get user books' })
  @ApiParam({ name: 'userUrl', required: true, description: "User's url", example: '8YoCsYP5QGx_' })
  @ApiResponse({ type: [Book] })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'size', example: 10 })
  @Get(':userUrl/books')
  async getBooks(
    @Param('userUrl') userUrl: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response
  ) {
    const serviceData = await this.userService.getPaginatedUserBooks(userUrl, page, size);
    if (serviceData && serviceData.length > 0) {
      res.set({ 'x-data-length': serviceData.length }).json(serviceData.list);
    } else {
      res.set({ 'x-data-length': 0 }).send([]);
    }
  }

  @HttpCode(200)
  @Post(':userUrl/deleteBook')
  async deleteBook(
    @Param('userUrl') userUrl: string,
    @Body() deleteBookDto: DeleteBookDto,
    @Req() req: ReqWithTokensData
  ) {
    return this.userService.deleteBook(deleteBookDto, userUrl, req.user.url);
  }

  @Post(':userUrl/updateInfo')
  updateInfo(@Param('userUrl') userUrl: string, @Body() updateInfoDto: UpdateInfoDto, @Req() req: ReqWithTokensData) {
    return this.userService.updateInfo(userUrl, updateInfoDto, req.user.url);
  }

  @Get(':userUrl/accountInfo')
  getAccountInfo(@Param('userUrl') userUrl: string, @Req() req: ReqWithTokensData) {
    return this.userService.getAccountInfo(userUrl, req.user.url);
  }

  @Post(':userUrl/updatePassword')
  updatePassword(
    @Param('userUrl') userUrl: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: ReqWithTokensData
  ) {
    return this.userService.updatePassword(userUrl, updatePasswordDto, req.user.url);
  }
}

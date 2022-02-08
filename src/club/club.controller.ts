import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ClubInfo } from './types/club-info';
import { TokensGuard } from '../tokens/tokens.guard';
import { ReqWithTokensData } from '../tokens/types/reqWithTokensData.interface';
import { AuthUserData } from '../auth/types/authUserData';
import { Response } from 'express';

@ApiTags('Club')
@ApiHeader({ name: 'Authorization', description: 'Bearer token' })
@Controller('club')
@UseGuards(TokensGuard)
export class ClubController {
  constructor(private ClubService: ClubService) {
  }

  @ApiOperation({ summary: 'Create a new club' })
  @ApiBody({ type: CreateClubDto })
  @ApiResponse({ status: 201, type: AuthUserData })
  @Post('create')
  async createClub(@Body() createClubDto: CreateClubDto, @Req() req: ReqWithTokensData) {
    return await this.ClubService.createClub(createClubDto, req.user.url);
  }

  @ApiOperation({ summary: 'Get club info' })
  @ApiResponse({ status: 200, type: ClubInfo })
  @ApiParam({ name: 'clubUrl', required: true, description: 'Club\'s url', example: '8YoCsYP5QGx_' })
  @Get(':clubUrl/info')
  getInfo(@Param('clubUrl') clubUrl: string, @Req() req: ReqWithTokensData) {
    return this.ClubService.getClubInfo(clubUrl, req.user.url);
  }

  @ApiOperation({ summary: 'Join the club' })
  @ApiParam({ name: 'clubUrl', required: true, description: 'Club\'s url', example: '8YoCsYP5QGx_' })
  @ApiResponse({ status: 200, type: AuthUserData })
  @HttpCode(200)
  @Post(':clubUrl/join')
  async joinClub(@Param('clubUrl') clubUrl: string,
                 @Req() req: ReqWithTokensData) {
    return this.ClubService.joinClub(req.user.url, clubUrl);
  }

  @ApiOperation({ summary: 'Leave the club' })
  @ApiParam({ name: 'clubUrl', required: true, description: 'Club\'s url', example: '8YoCsYP5QGx_' })
  @ApiResponse({ status: 200, type: AuthUserData })
  @HttpCode(200)
  @Post(':clubUrl/leave')
  async leaveClub(@Param('clubUrl') clubUrl: string,
                  @Req() req: ReqWithTokensData) {
    return this.ClubService.leaveClub(clubUrl, req.user.url);
  }

  @Get(':clubUrl/books')
  async getClubBooks(@Param('clubUrl') clubUrl: string,
                     @Query('page') page: number,
                     @Query('size') size: number) {
    return this.ClubService.getClubBooks(clubUrl, page, size);
  }
}

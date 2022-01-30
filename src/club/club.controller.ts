import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ClubInfo } from './types/club-info';
import { TokensGuard } from '../tokens/tokens.guard';
import { ReqWithTokensData } from '../tokens/types/reqWithTokensData.interface';

@ApiTags('Club')
@ApiHeader({name: 'Authorization', description: 'Bearer token'})
@Controller('club')
@UseGuards(TokensGuard)
export class ClubController {
  constructor(private ClubService: ClubService) {
  }

  @ApiOperation({ summary: 'Create a new club' })
  @ApiBody({ type: CreateClubDto })
  @ApiResponse({ status: 201, description: 'Club created successfully' })
  @Post('create')
  async createClub(@Body() createClubDto: CreateClubDto, @Req() req: ReqWithTokensData) {
    const newClub = await this.ClubService.createClub(createClubDto, req.user.url);
    return 'Club created successfully'
  }

  @ApiOperation({ summary: 'Get club info' })
  @ApiResponse({ status: 200, type: ClubInfo })
  @ApiParam({ name: 'clubUrl', required: true, description: 'Club\'s url', example: '8YoCsYP5QGx_' })
  @Get(':clubUrl/info')
  getInfo(@Param('clubUrl') clubUrl: string) {
    return this.ClubService.getClubInfo(clubUrl);
  }

  @ApiOperation({ summary: 'Join the club' })
  @ApiParam({ name: 'clubUrl', required: true, description: 'Club\'s url', example: '8YoCsYP5QGx_' })
  @ApiResponse({ status: 200 })
  @Post(':clubUrl/join')
  async joinClub(@Param('clubUrl') clubUrl: string,
                 @Req() req: ReqWithTokensData) {
    const club = await this.ClubService.joinClub(req.user.url, clubUrl);
    return { clubUrl: club.url };
  }
}

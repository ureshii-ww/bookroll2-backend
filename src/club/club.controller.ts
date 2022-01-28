import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UserInfo } from '../user/types/userInfo';
import { ClubInfo } from './types/club-info';

@ApiTags('Club')
@Controller('club')
export class ClubController {
  constructor(private ClubService: ClubService) {
  }

  @ApiOperation({summary: 'Create a new club'})
  @ApiBody({type: CreateClubDto})
  @ApiResponse({status: 201, description: 'Club created successfully'})
  @Post('create')
  async createClub(@Body() {clubname, userUrl}: CreateClubDto) {
    const newClub = await this.ClubService.createClub(clubname, userUrl);
    return 'Club created successfully'
  }

  @ApiOperation({summary: 'Get club info'})
  @ApiResponse({status: 200, type: ClubInfo})
  @ApiParam({name: 'clubUrl', required: true, description: 'Club\'s url', example: '8YoCsYP5QGx_'})
  @Get(':clubUrl/info')
  getInfo(@Param('clubUrl') clubUrl: string) {
    return this.ClubService.getClubInfo(clubUrl);
  }
}

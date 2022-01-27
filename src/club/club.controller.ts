import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @Get(':clubUrl/info')
  getInfo(@Param('clubUrl') clubUrl: string) {
    return this.ClubService.getClubInfo(clubUrl);
  }
}

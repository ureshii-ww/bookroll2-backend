import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClubDto {

  @ApiProperty({example: 'Cool_club', required: true, description: 'The name of the new club'})
  readonly clubname: string;

  @ApiProperty({example: 'vRjcMmKkrbsc', required: true, description: 'The url of the club creator'})
  readonly userUrl: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClubDto {
  @ApiProperty({example: 'Cool_club', required: true, description: 'The name of the new club'})
  @IsString()
  readonly clubname: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateClubDto {
  @ApiProperty({example: 'Cool_club', required: true, description: 'The name of the new club'})
  @IsString()
  @Length(3, 32)
  readonly clubname: string;
}
import { ApiProperty } from '@nestjs/swagger';

export class JoinClubDto {

  @ApiProperty({example: 'vRjcMmKkrbsc', required: true, description: 'The url of the user'})
  readonly userUrl: string;

  @ApiProperty({example: 'vRjcMmKkrbsc', required: true, description: 'The url of the club'})
  readonly clubUrl: string;
}
import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {

  @ApiProperty({example: 'username', description: 'Username'})
  readonly username: string;

  @ApiProperty({example: '#FFFFFF', description: 'User\'s color'})
  readonly color: string;

  @ApiProperty({example: '😎', description: 'User\'s emoji'})
  readonly emoji: string;

  @ApiProperty({example: 'clubname', description: 'The name of user\'s club'})
  readonly clubname: string | null;

  @ApiProperty({example: 'aeg8aFege', description: 'The URL of user\s club'})
  readonly clubUrl : string | null;
}
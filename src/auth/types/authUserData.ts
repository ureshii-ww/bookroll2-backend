import { Role } from '../../roles/schemas/role.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserData {

  @ApiProperty({example: 'username', description: 'Username' })
  username: string;

  @ApiProperty({example: 'dQw4w9WgXcQ', description: 'User\'s url' })
  url: string;

  @ApiProperty({example: '#FFFFFF', description: 'Main user\'s color' })
  color: string;

  @ApiProperty({example: '😂', description: 'User\s emoji' })
  emoji: string;

  @ApiProperty({
    type: [String],
    example: '[606896ba6afd6e0458163ffc, 606896ba6afd6e0458163ffd]',
    description: 'Array of user\'s roles in ObjectId',
    isArray: true})
  roles: Role[];

  @ApiProperty({example: false, description: 'Is user\' email confirmed'})
  isEmailConfirmed: boolean;
}
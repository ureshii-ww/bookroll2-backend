import { Role } from '../../roles/schemas/role.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserData {

  @ApiProperty({example: 'username', description: 'Username' })
  readonly username: string;

  @ApiProperty({example: 'dQw4w9WgXcQ', description: 'User\'s url' })
  readonly url: string;

  @ApiProperty({example: '#FFFFFF', description: 'Main user\'s color' })
  readonly color: string;

  @ApiProperty({example: '😂', description: 'User\s emoji' })
  readonly emoji: string;

  @ApiProperty({
    type: [String],
    example: '[606896ba6afd6e0458163ffc, 606896ba6afd6e0458163ffd]',
    description: 'Array of user\'s roles in ObjectId',
    isArray: true})
  readonly roles: Role[];

  @ApiProperty({example: false, description: 'Is user\' email confirmed'})
  readonly isEmailConfirmed: boolean;

  @ApiProperty({example: "xjagGElge4-g", type: String || null, description: 'User\'s club URL or null'})
  readonly club: string | null;
}
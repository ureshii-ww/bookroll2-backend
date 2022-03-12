import { ApiProperty } from '@nestjs/swagger';

export class RefreshSessionDto {
  @ApiProperty({example: 'JGVNl991gHY0', required: true, description: "User's url"})
  readonly userUrl: string;
}
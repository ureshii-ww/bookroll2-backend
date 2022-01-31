import { ApiProperty } from '@nestjs/swagger';

export class ClubInfo {

  @ApiProperty({example: 'clubname', description: 'Clubname'})
  readonly clubname: string;

  @ApiProperty({example: { username: 'username', url: '8YoCsYP5QGx_'}, description: 'Data of club\'s master'})
  readonly master: {
    username: string,
    url: string
  }

  @ApiProperty({example: { title: 'Book', authors: ['Author']}, description: 'Data of club\s chosen book'})
  readonly bookToRead: {
    title: string,
    authors: string[]
  } | null;

  @ApiProperty({example: true, description: 'Check if the user in club'})
  readonly isInClub: boolean;

  @ApiProperty({example: false, description: 'Check if the user is club\'s master'})
  readonly isMaster: boolean;
}
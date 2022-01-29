import { ApiProperty } from '@nestjs/swagger';

export class BookData {

  @ApiProperty({example: 'title'})
  title: string;

  @ApiProperty({example: ['author1', 'author2']})
  authors: string[];

  @ApiProperty({example: '1990'})
  year: string;

  @ApiProperty({example: 'https://link.com'})
  cover: string;

  @ApiProperty({example: 'description text'})
  description: string;

  @ApiProperty({example: ['genre1', 'genre2']})
  genres: string[];
}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, IsUrl } from 'class-validator';

export class BookData {

  @ApiProperty({example: 'title'})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({example: ['author1', 'author2']})
  authors: string[];

  @ApiProperty({example: '1990'})
  year: string;

  @ApiProperty({example: 'https://link.com'})
  @IsUrl()
  cover: string;

  @ApiProperty({example: 'description text'})
  description: string;

  @ApiProperty({example: ['genre1', 'genre2']})
  genres: string[];
}
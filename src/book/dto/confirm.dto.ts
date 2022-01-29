import { ApiProperty } from '@nestjs/swagger';
import { BookData } from '../types/book-data';

export class ConfirmDto {

  @ApiProperty({example: 'vRjcMmKkrbsc', required: true, description: 'The url of the user'})
  readonly userUrl: string;

  @ApiProperty({required: true, description: 'Book data'})
  readonly book: BookData;
}
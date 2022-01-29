import { ApiProperty } from '@nestjs/swagger';
import { BookData } from '../types/book-data';

export class ConfirmDto {
  @ApiProperty({required: true, description: 'Book data'})
  readonly book: BookData;
}
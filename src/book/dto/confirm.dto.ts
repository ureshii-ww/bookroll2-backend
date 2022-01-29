import { ApiProperty } from '@nestjs/swagger';
import { BookData } from '../types/book-data';
import { Type } from 'class-transformer'

export class ConfirmDto {
  @ApiProperty({ required: true, description: 'Book data' })
  @Type(() => BookData)
  readonly book: BookData;
}
import { Book } from '../schemas/book.schema';

export class ConfirmDto {
  readonly userUrl: string;
  readonly book: Book;
}
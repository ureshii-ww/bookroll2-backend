import { Book } from '../../book/schemas/book.schema';

export class UserBooksData {
  readonly length: number;
  readonly list: Book[];
}
import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private BookService: BookService) {
  }

  @Get('random')
  getRandomBook() {
    return this.BookService.getRandomBook();
  }
}

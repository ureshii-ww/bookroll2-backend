import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { ConfirmDto } from './dto/confirm.dto';

@Controller('book')
export class BookController {
  constructor(private BookService: BookService) {
  }

  @Get('random')
  getRandomBook() {
    return this.BookService.getRandomBook();
  }

  @Post('confirm')
  confirmBook(@Body() confirmDto: ConfirmDto) {
    return this.BookService.confirmBook(confirmDto);
  }
}

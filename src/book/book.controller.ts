import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { ConfirmDto } from './dto/confirm.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './schemas/book.schema';
import { BookData } from './types/book-data';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private BookService: BookService) {
  }

  @ApiOperation({summary: 'Get a random book'})
  @ApiResponse({type: BookData, status: 200})
  @Get('random')
  getRandomBook() {
    return this.BookService.getRandomBook();
  }

  @ApiOperation({summary: 'Add a book to club\'s list'})
  @ApiResponse({status: 200})
  @Post('confirm')
  async confirmBook(@Body() confirmDto: ConfirmDto) {
    await this.BookService.confirmBook(confirmDto);
    return 'Book added successfully'
  }
}

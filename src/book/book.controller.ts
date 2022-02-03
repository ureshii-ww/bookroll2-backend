import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { ConfirmDto } from './dto/confirm.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './schemas/book.schema';
import { BookData } from './types/book-data';
import { TokensGuard } from '../tokens/tokens.guard';
import { ReqWithTokensData } from '../tokens/types/reqWithTokensData.interface';

@ApiTags('Book')
@ApiHeader({name: 'Authorization', description: 'Bearer token'})
@Controller('book')
@UseGuards(TokensGuard)
export class BookController {
  constructor(private BookService: BookService) {
  }

  @ApiOperation({ summary: 'Get a random book' })
  @ApiResponse({ type: BookData, status: 200 })
  @Get('random')
  getRandomBook() {
    return this.BookService.getRandomBook();
  }

  @ApiOperation({ summary: 'Add a book to club\'s list' })
  @ApiResponse({ status: 200 })
  @Post('confirm')
  async confirmBook(@Body() confirmDto: ConfirmDto, @Req() req: ReqWithTokensData) {
    await this.BookService.confirmBook(confirmDto, req.user.url);
    return 'Book added successfully';
  }
}

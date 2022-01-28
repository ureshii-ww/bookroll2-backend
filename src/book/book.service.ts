import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { readlyParser } from '../utils/readlyParser';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';


@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>,
              private httpService: HttpService) {
  }

  async getRandomBook() {
    const readly = await lastValueFrom(this.httpService.get('https://readly.ru/books/i_am_lucky/?show=1'));
    return readlyParser(readly.data);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { readlyParser } from '../utils/readlyParser';
import { lastValueFrom } from 'rxjs';
import { ListOfBooksService } from '../list-of-books/list-of-books.service';
import { User, UserDocument } from '../user/schemas/user.schema';
import { ListOfBooks, ListOfBooksDocument } from '../list-of-books/schemas/list-of-books.shema';
import { ConfirmDto } from './dto/confirm.dto';
import { BookData } from './types/book-data';


@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>,
              @InjectModel(User.name) private UserModel: Model<UserDocument>,
              @InjectModel(ListOfBooks.name) private ListOfBooksModel: Model<ListOfBooksDocument>,
              private httpService: HttpService,
              private ListOfBooksService: ListOfBooksService) {
  }

  async getRandomBook(): Promise<Book> {
    const readly = await lastValueFrom(this.httpService.get('https://readly.ru/books/i_am_lucky/?show=1'));
    return readlyParser(readly.data);
  }

  async saveBook(bookData: Book) {
    const bookInDb = await this.BookModel.findOne({ title: bookData.title, authors: bookData.authors }).exec();
    if (!bookInDb) {
      return new this.BookModel(bookData).save();
    }
    return bookInDb;
  }

  async confirmBook({ book }: ConfirmDto, userUrl: string) {
    const savedBook = await this.saveBook(book);
    const user = await this.UserModel.findOne({ url: userUrl }).populate('club').exec();
    if (!user) {
      throw new BadRequestException();
    }
    const club = user.club;
    if (!club) {
      throw new BadRequestException();
    }

    const listOfBooks = await this.ListOfBooksService.getListOfBooks(club._id, club.meetingNumber, user._id);
    //Creates list for the given club and meeting if one doesn't exist
    if (!listOfBooks) {
      return await this.ListOfBooksService.createListOfBooks(club._id, club.meetingNumber, user._id, savedBook._id);
    }

    listOfBooks.books.push(savedBook._id)
    return listOfBooks.save();
  }

  async getBookData(id: string): Promise<BookData> {
    const book = await this.BookModel.findOne({_id: id}).exec();
    if (!book) {
      throw new NotFoundException();
    }
    return {
      title: book.title,
      authors: book.authors,
      year: book.year,
      cover: book.cover,
      description: book.description,
      genres: book.genres
    }
  }
}

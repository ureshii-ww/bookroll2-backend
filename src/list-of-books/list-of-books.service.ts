import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListOfBooks, ListOfBooksDocument } from './schemas/list-of-books.shema';
import { Model } from 'mongoose';
import { Book } from '../book/schemas/book.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class ListOfBooksService {
  constructor(@InjectModel(ListOfBooks.name) private ListOfBooks: Model<ListOfBooksDocument>) {
  }

  createListOfBooks(newList: ListOfBooks) {
    const createdList = new this.ListOfBooks(newList);
    return createdList.save();
  }

  generateNewListOfBooks(club: mongoose.Types.ObjectId, meeting: number, book: mongoose.Types.ObjectId) {
    const list = [book];
    return {
      club,
      meeting,
      list
    }
  }
}

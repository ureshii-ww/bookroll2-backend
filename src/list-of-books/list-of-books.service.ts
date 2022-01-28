import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListOfBooks, ListOfBooksDocument } from './schemas/list-of-books.shema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Club, ClubDocument } from '../club/schemas/club.schema';

@Injectable()
export class ListOfBooksService {
  constructor(@InjectModel(ListOfBooks.name) private ListOfBooksModel: Model<ListOfBooksDocument>,
              @InjectModel(Club.name) private ClubModel: Model<ClubDocument>) {
  }

  createListOfBooks(newList: ListOfBooks) {
    const createdList = new this.ListOfBooksModel(newList);
    return createdList.save();
  }

  async generateNewListOfBooks(clubUrl: string, meeting: number, userUrl: string, book: mongoose.Types.ObjectId) {
    const clubData = await this.ClubModel.findOne({}).populate('members').exec();
    return clubData.members.map(member => {
      return {
        user: member._id,
        books: null
      }
    });
  }
}

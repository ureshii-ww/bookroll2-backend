import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListOfBooks, ListOfBooksDocument } from './schemas/list-of-books.shema';
import { Model, Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Club, ClubDocument } from '../club/schemas/club.schema';

@Injectable()
export class ListOfBooksService {
  constructor(@InjectModel(ListOfBooks.name) private ListOfBooksModel: Model<ListOfBooksDocument>,
              @InjectModel(Club.name) private ClubModel: Model<ClubDocument>) {
  }

  createListOfBooks(club: string, meetingNumber: number, user: string, book: string) {
    const createdList = new this.ListOfBooksModel({
      club,
      meetingNumber,
      list: [{ user, books: [book] }]
    });
    return createdList.save();
  }

  async getListOfBooks(club: string, meetingNumber: number) {
    const query: any = { club: new mongoose.Types.ObjectId(club), meetingNumber }
    return this.ListOfBooksModel.findOne(query).populate('list').exec()
  }

  async getListOfBooksPopulated(club: string, meetingNumber: number) {
    const query: any = { club: new mongoose.Types.ObjectId(club), meetingNumber }
    return this.ListOfBooksModel.findOne(query)
      .populate({
        path: 'list',
        populate: {
          path: 'books',
          model: 'Book'
        }
      })
      .populate({
        path: 'list',
        populate: {
          path: 'user',
          model: 'User'
        }
      })
      .exec()
  }
}

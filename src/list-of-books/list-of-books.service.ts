import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { ListOfBooks, ListOfBooksDocument } from "./schemas/list-of-books.shema";
import { Model, Schema, Types } from "mongoose";
import * as mongoose from "mongoose";
import { Club, ClubDocument } from "../club/schemas/club.schema";

@Injectable()
export class ListOfBooksService {
  constructor(
    @InjectModel(ListOfBooks.name) private ListOfBooksModel: Model<ListOfBooksDocument>,
    @InjectModel(Club.name) private ClubModel: Model<ClubDocument>
  ) {}

  createListOfBooks(club: string, meetingNumber: number, user: string, book: string) {
    const createdList = new this.ListOfBooksModel({
      club,
      meetingNumber,
      user,
      books: [book],
    });
    return createdList.save();
  }

  async getListOfBooks(club: string, meetingNumber: number, user: string) {
    const query: any = {
      club: new mongoose.Types.ObjectId(club),
      meetingNumber,
      user: new mongoose.Types.ObjectId(user),
    };
    return this.ListOfBooksModel.findOne(query).exec();
  }

  async getListOfBooksPopulated(club: string, meetingNumber: number, user: string) {
    const query: any = {
      club: new mongoose.Types.ObjectId(club),
      meetingNumber,
      user: new mongoose.Types.ObjectId(user),
    };
    return this.ListOfBooksModel.findOne(query).populate("books").populate("user").exec();
  }

  async removeBookFromList(list: ListOfBooksDocument, index: number) {
    if (!list) {
      throw new BadRequestException();
    }

    if (index > list.books.length) {
      throw new BadRequestException();
    }

    list.books.splice(index, 1);
    if(list.books.length > 0) {
      return list.save();
    } else {
      return list.delete();
    }
  }
}

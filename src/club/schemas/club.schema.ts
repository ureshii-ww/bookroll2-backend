import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {User} from '../../user/schemas/user.schema';
import {Book} from '../../book/schemas/book.schema';
import {ListOfClubBooks} from './listOfBooks';

export type ClubDocument = Club & mongoose.Document;

@Schema()
export class Club {
  @Prop()
  clubname: string;

  @Prop()
  url: string;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  bookToRead: Book;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  master: User;

  @Prop()
  meetingNumber: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'ListOfClubBooks' })
  currentListOfBooks: ListOfClubBooks;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'ListOfClubBooks' })
  previousListOfBooks: ListOfClubBooks;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  chosenBooksHistory: Book[];

  @Prop()
  clubRules: string;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
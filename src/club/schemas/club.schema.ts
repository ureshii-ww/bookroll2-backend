import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Book } from '../../book/schemas/book.schema';
import { ListOfBooks } from '../../list-of-books/schemas/list-of-books.shema'

export type ClubDocument = Club & mongoose.Document;

@Schema()
export class Club {
  @Prop()
  clubname: string;

  @Prop()
  url: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  bookToRead: Book | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  master: User;

  @Prop()
  meetingNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ListOfClubBooks' })
  currentListOfBooks: ListOfBooks | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ListOfClubBooks' })
  previousListOfBooks: ListOfBooks | null;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  chosenBooksHistory: Book[] | null;

  @Prop()
  clubRules: string | null;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
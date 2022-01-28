import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from '../../user/schemas/user.schema';
import { BookDocument } from '../../book/schemas/book.schema';
import { ListOfBooksDocument } from '../../list-of-books/schemas/list-of-books.shema'

export type ClubDocument = Club & mongoose.Document;

@Schema()
export class Club {
  @Prop()
  clubname: string;

  @Prop()
  url: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: UserDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  bookToRead: BookDocument | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  master: UserDocument;

  @Prop()
  meetingNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ListOfClubBooks' })
  currentListOfBooks: ListOfBooksDocument | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ListOfClubBooks' })
  previousListOfBooks: ListOfBooksDocument | null;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  chosenBooksHistory: BookDocument[] | null;

  @Prop()
  clubRules: string | null;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
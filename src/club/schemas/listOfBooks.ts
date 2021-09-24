import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Club} from './club.schema';
import {Book} from '../../book/schemas/book.schema';

export type ListOfClubBooksDocument = ListOfClubBooks & mongoose.Document;

@Schema()
export class ListOfClubBooks {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  club: Club;

  @Prop()
  meeting: number;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  list: Book[];
}

export const ListOfClubBooksSchema = SchemaFactory.createForClass(ListOfClubBooks);
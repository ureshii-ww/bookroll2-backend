import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Club } from '../../club/schemas/club.schema';
import { Book } from '../../book/schemas/book.schema';

export type ListOfBooksDocument = ListOfBooks & mongoose.Document;

@Schema()
export class ListOfBooks {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop()
  meeting: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  list: Book[] | null;
}

export const ListOfBooksSchema = SchemaFactory.createForClass(ListOfBooks);
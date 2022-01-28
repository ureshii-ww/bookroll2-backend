import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Club } from '../../club/schemas/club.schema';
import { ListItem, ListItemSchema } from './list-item';

export type ListOfBooksDocument = ListOfBooks & mongoose.Document;

@Schema()
export class ListOfBooks {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop()
  meeting: number;

  @Prop({ type: [ListItemSchema] })
  list: ListItem[] | null;
}

export const ListOfBooksSchema = SchemaFactory.createForClass(ListOfBooks);
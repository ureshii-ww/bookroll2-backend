import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BookDocument } from '../../book/schemas/book.schema';
import { UserDocument } from '../../user/schemas/user.schema';

@Schema({_id: false})
export class ListItem {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: UserDocument;

  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Book'})
  books: BookDocument[] | null;
}

export const ListItemSchema = SchemaFactory.createForClass(ListItem);
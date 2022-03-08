import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { Book, BookDocument } from '../../book/schemas/book.schema';

export type ReviewDocument = Review & mongoose.Document;

@Schema()
export class Review {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  book: BookDocument;

  @Prop()
  text: String;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
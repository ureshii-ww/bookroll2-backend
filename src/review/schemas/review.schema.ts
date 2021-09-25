import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Club } from '../../club/schemas/club.schema';
import { Book } from '../../book/schemas/book.schema';

export type ReviewDocument = Review & mongoose.Document;

@Schema()
export class Review {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  book: Book;

  @Prop()
  text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  authors: string[];

  @Prop()
  year: string;

  @Prop()
  cover: string;

  @Prop()
  description: string;

  @Prop()
  genres: string[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { BookDocument } from "src/book/schemas/book.schema";
import { UserDocument } from "src/user/schemas/user.schema";
import { Club, ClubDocument } from "../../club/schemas/club.schema";

export type ListOfBooksDocument = ListOfBooks & mongoose.Document;

@Schema()
export class ListOfBooks {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Club" })
  club: ClubDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: UserDocument;

  @Prop()
  meetingNumber: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Book" })
  books: BookDocument[] | null;
}

export const ListOfBooksSchema = SchemaFactory.createForClass(ListOfBooks);

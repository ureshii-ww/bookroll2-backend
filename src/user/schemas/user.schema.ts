import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Role} from './role.schema';
import {Club} from '../../club/schemas/club.schema';
import {Review} from '../../review/schemas/review.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  url: string;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  club: Club;

  @Prop()
  color: string;

  @Prop()
  emoji: string;

  @Prop()
  lastToken: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Review' })
  reviewsList: Review[];
}

export const UserSchema = SchemaFactory.createForClass(User);
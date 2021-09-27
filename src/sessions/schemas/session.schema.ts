import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type SessionDocument = Session & mongoose.Document;

@Schema()
export class Session {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  refreshToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
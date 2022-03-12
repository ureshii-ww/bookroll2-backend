import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { REFRESH_TOKEN_EXPIRES } from '../../constants/refresh-token-expires';

export type SessionDocument = Session & mongoose.Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  refreshToken: string;

  @Prop({ type: Date, expires: REFRESH_TOKEN_EXPIRES, default: Date.now })
  createdAt: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session);
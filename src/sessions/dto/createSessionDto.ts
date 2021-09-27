import * as mongoose from 'mongoose';

export class CreateSessionDto {
  readonly userId: mongoose.Types.ObjectId;
  readonly url: string;
  readonly roles: mongoose.Types.ObjectId[];
}
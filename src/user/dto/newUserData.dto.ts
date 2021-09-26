import * as mongoose from 'mongoose';

export class NewUserDataDto {
  readonly url: string;
  readonly club: null;
  readonly color: string;
  readonly emoji: string;
  readonly reviews: mongoose.Types.ObjectId[];
  readonly roles: mongoose.Types.ObjectId[];
}
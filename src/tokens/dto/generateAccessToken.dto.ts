import * as mongoose from 'mongoose';

export class GenerateAccessTokenDto {
  readonly url: string;
  readonly roles: mongoose.Types.ObjectId[];
}
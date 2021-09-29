import * as mongoose from 'mongoose';

export class FindAllUserSessionsDto {
  readonly userId: mongoose.Types.ObjectId;
}
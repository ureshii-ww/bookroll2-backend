import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RolesModule } from '../roles/roles.module';
import { Club, ClubSchema } from '../club/schemas/club.schema';
import { TokensModule } from '../tokens/tokens.module';
import { ListOfBooksModule } from '../list-of-books/list-of-books.module';
import { Review, ReviewSchema } from '../review/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Club.name, schema: ClubSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    RolesModule,
    TokensModule,
    ListOfBooksModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

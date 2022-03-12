import { Module } from '@nestjs/common';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './schemas/club.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Book, BookSchema } from '../book/schemas/book.schema';
import { UserModule } from '../user/user.module';
import { TokensModule } from '../tokens/tokens.module';
import { ListOfBooksModule } from '../list-of-books/list-of-books.module';
import { Review, ReviewSchema } from '../review/schemas/review.schema';

@Module({
  controllers: [ClubController],
  providers: [ClubService],
  imports: [
    MongooseModule.forFeature([
      { name: Club.name, schema: ClubSchema },
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    UserModule,
    TokensModule,
    ListOfBooksModule,
  ],
})
export class ClubModule {}

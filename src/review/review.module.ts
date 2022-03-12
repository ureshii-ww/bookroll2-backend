import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Book, BookSchema } from '../book/schemas/book.schema';
import { TokensModule } from '../tokens/tokens.module';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    TokensModule,
  ]
})
export class ReviewModule {}

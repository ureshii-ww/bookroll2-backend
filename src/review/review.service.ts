import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Club, ClubDocument } from '../club/schemas/club.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Book, BookDocument } from '../book/schemas/book.schema';
import { CreateReviewDto } from './dto/create-review-dto';
import { Review, ReviewDocument } from './schemas/review.schema';
import { EditReviewDto } from './dto/edit-review-dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private BookModel: Model<BookDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
  ) {}

  async createReview({ text, bookId }: CreateReviewDto, userUrl: string) {
    const user = await this.userModel.findOne({ url: userUrl }).exec();
    if (!user) {
      throw new BadRequestException();
    }
    const book = await this.BookModel.findOne({ _id: bookId }).exec();
    if (!book) {
      throw new BadRequestException();
    }
    const newReview = new this.reviewModel({
      text,
      book: bookId,
      author: user._id,
    });
    return newReview.save();
  }

  async editReview({ text }: EditReviewDto, reviewId: string, userUrl: string) {
    const review = await this.reviewModel.findOne({ _id: reviewId }).populate('author').exec();
    if (!review) {
      throw new NotFoundException();
    }
    if (review.author.url !== userUrl) {
      throw new ForbiddenException();
    }
    review.text = text;
    return review.save();
  }
}

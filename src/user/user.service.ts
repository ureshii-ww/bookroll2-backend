import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid/async';
import * as randomcolor from 'randomcolor';
import { randomEmoji } from '../utils/randomEmoji';
import { RolesService } from '../roles/roles.service';
import { Club, ClubDocument } from '../club/schemas/club.schema';
import { UserInfo } from './types/userInfo';
import { ListOfBooksService } from '../list-of-books/list-of-books.service';
import paginate from '../utils/paginate';
import { DeleteBookDto } from './dto/deleteBookDto';
import { UserBooksData } from './types/userBooksData';
import { BookDocument } from 'src/book/schemas/book.schema';
import { ListOfBooksDocument } from 'src/list-of-books/schemas/list-of-books.shema';
import { UpdateInfoDto } from './dto/update-info-dto';
import { AuthUserData } from '../auth/types/authUserData';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { UserAccountInfo } from './types/user-account-info';
import maskEmail from '../utils/maskEmail';
import * as bcrypt from 'bcryptjs';
import { Review, ReviewDocument } from '../review/schemas/review.schema';
import { DeleteUserReviewDto } from './dto/delete-user-review.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Club.name) private ClubModel: Model<ClubDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private rolesService: RolesService,
    private listOfBooksService: ListOfBooksService
  ) {}

  async createUser(newUser: User) {
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).populate('club').exec();
  }

  async getUserByUrl(url: string) {
    return this.userModel.findOne({ url }).populate('club').exec();
  }

  async generateNewUserData() {
    const userRole = await this.rolesService.getRoleByName('user');
    const url = await nanoid(12);
    const color: string = await randomcolor({ luminosity: 'light' });
    const emoji: string = randomEmoji();
    const roles = [userRole._id];

    return {
      url,
      color,
      emoji,
      roles,
      club: null,
      reviewsArray: null,
      isEmailConfirmed: false,
    };
  }

  async getUserInfo(url: string): Promise<UserInfo> {
    const userData = await this.userModel.findOne({ url }).populate('club').exec();

    if (!userData) {
      throw new NotFoundException({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return {
      username: userData.username,
      color: userData.color,
      emoji: userData.emoji,
      clubname: userData.club?.clubname || null,
      clubUrl: userData.club?.url || null,
    };
  }

  async getUserListOfBooks(url: string): Promise<ListOfBooksDocument | null> {
    const user = await this.getUserByUrl(url);
    if (!user) {
      throw new BadRequestException();
    }
    if (!user.club) {
      return null;
    }

    const listOfBooks = await this.listOfBooksService.getListOfBooksPopulated(
      user.club._id,
      user.club.meetingNumber,
      user._id
    );
    if (!listOfBooks) {
      return null;
    }

    return listOfBooks;
  }

  async getAllUserBooks(url: string): Promise<BookDocument[] | null> {
    const listOfBooks = await this.getUserListOfBooks(url);
    if (!listOfBooks) {
      return null;
    }

    return listOfBooks.books;
  }

  async getPaginatedUserBooks(url: string, page: number, size: number): Promise<UserBooksData> {
    if (!page || !size) {
      throw new BadRequestException();
    }

    const listOfBooks = await this.getAllUserBooks(url);
    if (!listOfBooks) {
      return null;
    }

    return {
      length: listOfBooks.length,
      list: paginate(listOfBooks, page, size),
    };
  }

  async deleteBook({ index }: DeleteBookDto, url: string, clientUrl: string) {
    if (url !== clientUrl) {
      throw new ForbiddenException();
    }

    const listOfBooks = await this.getUserListOfBooks(url);
    return this.listOfBooksService.removeBookFromList(listOfBooks, index);
  }

  async updateInfo(url: string, { username, color, emoji }: UpdateInfoDto, clientUrl: string): Promise<AuthUserData> {
    if (url !== clientUrl) {
      throw new ForbiddenException();
    }

    const user = await this.getUserByUrl(url);
    user.username = username;
    user.color = color;
    user.emoji = emoji;
    await user.save();
    return {
      username: user.username,
      url: user.url,
      color: user.color,
      emoji: user.emoji,
      roles: user.roles,
      isEmailConfirmed: user.isEmailConfirmed,
      club: user.club.url,
    };
  }

  async getAccountInfo(url: string, clientUrl: string): Promise<UserAccountInfo> {
    if (url !== clientUrl) {
      throw new ForbiddenException();
    }

    const user = await this.getUserByUrl(url);
    return {
      email: maskEmail(user.email),
    };
  }

  async updatePassword(url: string, { oldPassword, newPassword }: UpdatePasswordDto, clientUrl: string) {
    if (url !== clientUrl) {
      throw new ForbiddenException();
    }
    const user = await this.getUserByUrl(url);
    if (!user) {
      throw new BadRequestException();
    }

    const passwordEqual = await bcrypt.compare(oldPassword, user.password);
    if (passwordEqual) {
      user.password = await bcrypt.hash(newPassword, 8);
      await user.save();
      return 'Success';
    }
    throw new ForbiddenException({ message: 'Wrong password' });
  }

  // async getAllUserReviews(userId: string) {
  //   const filter: any = { author: userId };
  //   const reviews = await this.reviewModel.find(filter).paginate('book').exec();
  //   if (reviews) {
  //     return reviews;
  //   } else {
  //     return [];
  //   }
  // }

  // async getPaginatedUserReviews(url: string, page: number, size: number) {
  //   const user = await this.userModel.findOne({ url }).exec();
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   const reviews = await this.getAllUserReviews(user._id);
  //   if (reviews.length > 0) {
  //     return {
  //       length: reviews.length,
  //       list: paginate(reviews, page, size),
  //     };
  //   } else {
  //     return {
  //       length: 0,
  //       list: reviews,
  //     };
  //   }
  // }

  async deleteUserReview({ reviewId }: DeleteUserReviewDto, userUrl: string, clientUrl: string) {
    if (userUrl !== clientUrl) {
      throw new ForbiddenException();
    }
    const user = await this.userModel.findOne({ url: clientUrl }).exec();
    if (!user) {
      throw new BadRequestException();
    }
    const reviews = await this.reviewModel.find({ author: user._id }).exec();
    const reviewIndex = reviews.findIndex(review => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      throw new NotFoundException();
    }
    const success = await reviews[reviewIndex].delete();
    if (success) {
      return reviews.length - 1;
    }
  }
}

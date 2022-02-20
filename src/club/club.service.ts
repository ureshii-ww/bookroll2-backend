import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Club, ClubDocument } from './schemas/club.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { User, UserDocument } from '../user/schemas/user.schema';
import { ClubInfo } from './types/club-info';
import { CreateClubDto } from './dto/create-club.dto';
import { AuthUserData } from '../auth/types/authUserData';
import { ListOfBooksService } from '../list-of-books/list-of-books.service';
import { BasicUserInfo } from '../user/types/basic-user-info';
import { BasicBookInfo } from '../book/types/basic-book-info';
import { ClubBooks } from './types/club-books';
import { ListOfBooksDocument } from 'src/list-of-books/schemas/list-of-books.shema';
import { DeleteBookInClubDto } from './dto/delete-book-in-club.dto';
import { UserService } from 'src/user/user.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ClubSettingsInfo, ClubSettingsInfoMember } from './types/club-settings-info';
import { ConfirmBookDto } from './dto/confirm-book.dto';
import * as mongoose from 'mongoose';
import { Book, BookDocument } from '../book/schemas/book.schema';

@Injectable()
export class ClubService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private BookModel: Model<BookDocument>,
    private listOfBooksService: ListOfBooksService,
    private userService: UserService
  ) {}

  async createClub({ clubname }: CreateClubDto, userUrl: string): Promise<AuthUserData> {
    const user = await this.userModel.findOne({ url: userUrl }).populate('club').exec();
    if (user.club) {
      throw new ConflictException({ message: 'User already has a club' });
    }

    const newClub = await this.createClubDocument(await this.generateNewClubData(clubname, userUrl));
    user.club = newClub._id;
    const userData = await user.save();
    return {
      username: userData.username,
      url: userData.url,
      color: userData.color,
      emoji: userData.emoji,
      roles: userData.roles,
      isEmailConfirmed: userData.isEmailConfirmed,
      club: newClub.url,
    };
  }

  createClubDocument(newClub: Club) {
    const createdClub = new this.clubModel(newClub);
    return createdClub.save();
  }

  async generateNewClubData(clubname: string, userUrl: string): Promise<Club> {
    const url = await nanoid(12);
    const master = await this.userModel.findOne({ url: userUrl }).populate('master').exec();
    const members = [master._id];

    return {
      clubname,
      url,
      members,
      bookToRead: null,
      master: master._id,
      meetingNumber: 1,
      chosenBooksHistory: null,
      clubRules: null,
      description: '',
    };
  }

  async getClubInfo(clubUrl: string, userUrl: string): Promise<ClubInfo> {
    const clubData = await this.clubModel
      .findOne({ url: clubUrl })
      .populate('master')
      .populate('bookToRead')
      .populate('members')
      .exec();

    if (!clubData) {
      throw new NotFoundException({ message: 'Club not found' });
    }

    const isInClub: boolean = clubData.members.some(member => member.url === userUrl);

    const { clubname, master, bookToRead, meetingNumber } = clubData;
    return {
      clubname,
      master: master
        ? {
            url: master.url,
            username: master.username,
          }
        : null,
      bookToRead: bookToRead
        ? {
            title: bookToRead.title,
            authors: bookToRead.authors,
          }
        : null,
      meetingNumber,
      isMaster: master ? userUrl === master.url : false,
      isInClub: isInClub,
    };
  }

  async joinClub(userUrl: string, clubUrl: string): Promise<AuthUserData> {
    const club = await this.clubModel.findOne({ url: clubUrl }).populate('members').exec();
    if (!club) {
      throw new BadRequestException({ message: 'Club not found' });
    }

    if (club.members.some(member => member.url === userUrl)) {
      throw new ConflictException({ message: 'User already in the club' });
    }

    const user = await this.userModel.findOne({ url: userUrl }).exec();
    if (!user) {
      throw new BadRequestException({ message: "User doesn't exist" });
    }

    if (user.club) {
      throw new ConflictException();
    }

    club.members.push(user._id);
    if (!club.master) {
      club.master = user._id;
    }
    await club.save();

    user.club = club._id;
    const userData = await user.save();
    return {
      username: userData.username,
      url: userData.url,
      color: userData.color,
      emoji: userData.emoji,
      club: clubUrl,
      roles: userData.roles,
      isEmailConfirmed: userData.isEmailConfirmed,
    };
  }

  async leaveClub(clubUrl: string, userUrl: string): Promise<AuthUserData> {
    const club = await this.clubModel.findOne({ url: clubUrl }).populate('master').exec();
    if (!club) {
      throw new BadRequestException();
    }

    const user = await this.userModel.findOne({ url: userUrl }).exec();
    if (!user) {
      throw new BadRequestException();
    }

    if (!user.club) {
      throw new ConflictException();
    }

    const userIndex = club.members.indexOf(user._id);
    if (userIndex === -1) {
      throw new ConflictException();
    }

    club.members.splice(userIndex, 1);

    if (club.master.url === userUrl) {
      if (club.members.length > 0) {
        club.master = club.members[0];
      } else club.master = null;
    }

    await club.save();
    user.club = null;
    const userData = await user.save();

    return {
      username: userData.username,
      url: userData.url,
      color: userData.color,
      emoji: userData.emoji,
      club: null,
      roles: userData.roles,
      isEmailConfirmed: userData.isEmailConfirmed,
    };
  }

  async getClubBooks(url: string): Promise<ClubBooks[]> {
    const club = await this.clubModel.findOne({ url }).populate('members').exec();
    if (!club) {
      throw new BadRequestException();
    }

    let listOfBooksArray: ListOfBooksDocument[] = [];

    for (let i = 0; i < club.members.length; i++) {
      const listOfBooks = await this.listOfBooksService.getListOfBooksPopulated(
        club._id,
        club.meetingNumber,
        club.members[i]._id
      );

      if (listOfBooks) {
        listOfBooksArray.push(listOfBooks);
      }
    }

    return listOfBooksArray.map(entry => {
      const basicUserInfo: BasicUserInfo = {
        username: entry.user.username,
        url: entry.user.url,
        color: entry.user.color,
        emoji: entry.user.emoji,
      };

      const cleanedBooks = entry.books.map((book): BasicBookInfo => {
        return {
          id: book._id,
          title: book.title,
          authors: [...book.authors],
          year: book.year,
        };
      });

      return {
        user: basicUserInfo,
        books: cleanedBooks,
      };
    });
  }

  async deleteBook(clientUrl: string, clubUrl: string, { userUrl, index }: DeleteBookInClubDto) {
    const club = await this.clubModel.findOne({ url: clubUrl }).populate('members').populate('master').exec();
    if (!club) {
      throw new BadRequestException();
    }
    if (clientUrl !== club.master.url) {
      throw new ForbiddenException();
    }

    const user = await this.userModel.findOne({ url: userUrl }).populate('club').exec();
    if (!user) {
      throw new BadRequestException();
    }

    if (user.club._id.toString() !== club._id.toString()) {
      throw new ForbiddenException();
    }

    const listOfBooks = await this.userService.getUserListOfBooks(userUrl);
    const isDeleted = await this.listOfBooksService.removeBookFromList(listOfBooks, index);

    if (isDeleted) {
      return 'Success';
    }
    throw new InternalServerErrorException();
  }

  async getSettingsInfo(clubUrl: string, clientUrl: string): Promise<ClubSettingsInfo> {
    const club = await this.clubModel.findOne({ url: clubUrl }).populate('master').populate('members').exec();
    if (!club) {
      throw new BadRequestException();
    }
    if (clientUrl !== club.master.url) {
      throw new ForbiddenException();
    }

    const membersArray: ClubSettingsInfoMember[] = [{ url: club.master.url, username: club.master.username }];
    for (let i = 0; i < club.members.length; i++) {
      const currentMember = club.members[i];
      if (currentMember.url !== club.master.url) {
        membersArray.push({ url: currentMember.url, username: currentMember.username });
      }
    }

    return {
      clubname: club.clubname,
      description: club.description,
      members: membersArray,
    };
  }

  async updateSettings(clubUrl: string, clientUrl: string, { clubname, masterUrl, description }: UpdateSettingsDto) {
    const club = await this.clubModel.findOne({ url: clubUrl }).populate('master').populate('members').exec();
    if (!club) {
      throw new BadRequestException();
    }
    if (clientUrl !== club.master.url) {
      throw new ForbiddenException();
    }
    const newMaster = await this.userService.getUserByUrl(masterUrl);
    if (!newMaster) {
      throw new BadRequestException();
    }
    const isMasterInClub = club.members.some(member => member.url === masterUrl);
    if (!isMasterInClub) {
      throw new BadRequestException();
    }
    club.master = newMaster._id;
    club.clubname = clubname;
    club.description = description;
    await club.save();
    return 'Success';
  }

  async confirmBook(clubUrl: string, { book }: ConfirmBookDto, clientUrl: string) {
    const club = await this.clubModel.findOne({url: clubUrl}).populate('master').exec();
    if (!club) {
      throw new BadRequestException();
    }
    if (clientUrl !== club.master.url) {
      throw new ForbiddenException();
    }
    const bookData = await this.BookModel.findOne({_id: book}).exec();

    club.bookToRead = bookData._id;
    club.meetingNumber += 1;
    await club.save()
    return 'Success';
  }
}

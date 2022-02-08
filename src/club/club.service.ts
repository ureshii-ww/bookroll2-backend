import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
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
import paginate from '../utils/paginate';
import { BasicUserInfo } from '../user/types/basic-user-info';
import { BasicBookInfo } from '../book/types/basic-book-info';
import { ClubBooks } from './types/club-books';

@Injectable()
export class ClubService {
  constructor(@InjectModel(Club.name) private clubModel: Model<ClubDocument>,
              @InjectModel(User.name) private userModel: Model<UserDocument>,
              private listOfBooksService: ListOfBooksService) {
  }

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
      club: newClub.url
    }
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
      clubRules: null
    }
  }

  async getClubInfo(clubUrl: string, userUrl: string): Promise<ClubInfo> {
    const clubData = await this.clubModel.findOne({ url: clubUrl })
      .populate('master').populate('bookToRead').populate('members').exec();

    if (!clubData) {
      throw new NotFoundException({ message: 'Club not found' })
    }

    const isInClub: boolean = clubData.members.some(member => member.url === userUrl);

    const { clubname, master, bookToRead } = clubData;
    return {
      clubname,
      master: master ? {
        url: master.url,
        username: master.username
      } : null,
      bookToRead: bookToRead ? {
        title: bookToRead.title,
        authors: bookToRead.authors
      } : null,
      isMaster: master ? userUrl === master.url : false,
      isInClub: isInClub
    }
  }

  async joinClub(userUrl: string, clubUrl: string): Promise<AuthUserData> {
    const club = await this.clubModel.findOne({ url: clubUrl }).populate('members').exec();
    if (!club) {
      throw new BadRequestException({ message: 'Club not found' })
    }

    if (club.members.some(member => member.url === userUrl)) {
      throw new ConflictException({ message: 'User already in the club' })
    }

    const user = await this.userModel.findOne({ url: userUrl }).exec();
    if (!user) {
      throw new BadRequestException({ message: 'User doesn\'t exist' })
    }

    if (user.club) {
      throw new ConflictException();
    }

    club.members.push(user._id);
    if(!club.master) {
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
      isEmailConfirmed: userData.isEmailConfirmed
    }
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
      isEmailConfirmed: userData.isEmailConfirmed
    }
  }

  async getClubBooks(url: string, page: number, size: number): Promise<ClubBooks[]> {
    const club = await this.clubModel.findOne({ url }).populate('club').exec();
    if (!club) {
      throw new BadRequestException();
    }

    const listOfBooks = await this.listOfBooksService.getListOfBooksPopulated(club._id, club.meetingNumber);
    if (!listOfBooks) {
      return [];
    }

    return listOfBooks.list.map(entry => {
      const basicUserInfo: BasicUserInfo = {
        username: entry.user.username,
        url: entry.user.url,
        color: entry.user.color,
        emoji: entry.user.emoji
      }

      const cleanedBooks = entry.books.map((book): BasicBookInfo => {
        return {
          id: book._id,
          title: book.title,
          authors: [...book.authors],
          year: book.year
        }
      });

      return {
        user: basicUserInfo,
        books: cleanedBooks
      }
    })
  }
}

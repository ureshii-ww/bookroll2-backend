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

@Injectable()
export class ClubService {
  constructor(@InjectModel(Club.name) private ClubModel: Model<ClubDocument>,
              @InjectModel(User.name) private UserModel: Model<UserDocument>) {
  }

  async createClub({ clubname }: CreateClubDto, userUrl: string): Promise<AuthUserData> {
    const user = await this.UserModel.findOne({ url: userUrl }).exec();
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
      club: user.club.url
    }
  }

  createClubDocument(newClub: Club) {
    const createdClub = new this.ClubModel(newClub);
    return createdClub.save();
  }

  async generateNewClubData(clubname: string, userUrl: string): Promise<Club> {
    const url = await nanoid(12);
    const master = await this.UserModel.findOne({ url: userUrl }).populate('master').exec();
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
    const clubData = await this.ClubModel.findOne({ url: clubUrl })
      .populate('master').populate('bookToRead').populate('members').exec();

    if (!clubData) {
      throw new NotFoundException({ message: 'Club not found' })
    }

    const isInClub: boolean = clubData.members.some(member => member.url === userUrl);

    const { clubname, master, bookToRead } = clubData;
    return {
      clubname,
      master: {
        url: master.url,
        username: master.username
      },
      bookToRead: bookToRead ? {
        title: bookToRead.title,
        authors: bookToRead.authors
      } : null,
      isMaster: userUrl === master.url,
      isInClub: isInClub
    }
  }

  async joinClub(userUrl: string, url: string) {
    const club = await this.ClubModel.findOne({ url }).populate('members').exec();
    if (!club) {
      throw new BadRequestException({ message: 'Club not found' })
    }

    if (club.members.some(member => member.url === userUrl)) {
      throw new ConflictException({ message: 'User already in the club' })
    }

    const user = await this.UserModel.findOne({ url: userUrl }).exec();
    if (!user) {
      throw new BadRequestException({ message: 'User doesn\'t exist' })
    }

    user.club = club._id;
    await user.save();
    club.members.push(user._id);
    return club.save();
  }
}

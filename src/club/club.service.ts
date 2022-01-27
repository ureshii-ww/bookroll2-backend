import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Club, ClubDocument } from './schemas/club.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { User, UserDocument } from '../user/schemas/user.schema';
import { ClubInfo } from './types/club-info';

@Injectable()
export class ClubService {
  constructor(@InjectModel(Club.name) private ClubModel: Model<ClubDocument>,
              @InjectModel(User.name) private UserModel: Model<UserDocument>) {
  }

  async createClub(clubname: string, userUrl: string) {
    const newClubData = await this.generateNewClubData(clubname, userUrl);
    return this.createClubDocument(newClubData);
  }

  createClubDocument(newClub: Club) {
    const createdClub = new this.ClubModel(newClub);
    return createdClub.save();
  }

  async generateNewClubData(clubname: string, userUrl: string): Promise<Club> {
    const url = await nanoid(12);
    const master = await this.UserModel.findOne({ url: userUrl }).exec();
    const members = [master._id];

    return {
      clubname,
      url,
      members,
      bookToRead: null,
      master: master._id,
      meetingNumber: 1,
      currentListOfBooks: null,
      previousListOfBooks: null,
      chosenBooksHistory: null,
      clubRules: null
    }
  }

  async getClubInfo(clubUrl: string): Promise<ClubInfo> {
    const clubData = await this.ClubModel.findOne({ url: clubUrl })
      .populate('master').populate('bookToRead').exec();

    if (!clubData) {
      throw new NotFoundException({ message: 'Club not found' })
    }

    const { clubname, url, master, bookToRead } = clubData;
    return {
      clubname,
      url,
      master: {
        url: master.url,
        username: master.username
      },
      bookToRead: bookToRead ? {
        title: bookToRead.title,
        authors: bookToRead.authors
      } : null
    }
  }
}

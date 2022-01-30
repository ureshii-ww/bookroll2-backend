import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid/async';
import * as randomcolor from 'randomcolor';
import { randomEmoji } from '../utils/randomEmoji';
import { RolesService } from '../roles/roles.service';
import { Club, ClubDocument } from '../club/schemas/club.schema';
import { UserInfo } from './types/userInfo';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Club.name) private ClubModel: Model<ClubDocument>,
              private rolesService: RolesService) {
  }

  async createUser(newUser: User) {
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).populate('club').exec();
  }

  async getUserByUrl(url: string) {
    return this.userModel.findOne({url}).populate('club').exec();
  }

  async generateNewUserData() {
    const userRole = await this.rolesService.getRoleByName('user');
    const url = await nanoid(12);
    const color: string = await randomcolor({ luminosity: 'light' });
    const emoji: string = await randomEmoji();
    const roles = [userRole._id];

    return {
      url,
      color,
      emoji,
      roles,
      club: null,
      reviewsArray: null,
      isEmailConfirmed: false
    }
  }

  async getUserInfo(url: string): Promise<UserInfo> {
    const userData = await this.userModel.findOne({ url }).populate('club').exec();

    if (!userData) {
      throw new NotFoundException({ message: 'User not found', status: HttpStatus.NOT_FOUND })
    }

    return {
      username: userData.username,
      color: userData.color,
      emoji: userData.emoji,
      clubname: userData.club?.clubname || null,
      clubUrl: userData.club?.url || null
    }
  }
}
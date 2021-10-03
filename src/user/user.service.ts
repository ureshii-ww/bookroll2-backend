import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid/async';
import * as randomcolor from 'randomcolor';
import { randomEmoji } from '../helpers/randomEmoji';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              private rolesService: RolesService) {
  }

  async createUser(newUser: User) {
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).populate('club').exec();
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
}
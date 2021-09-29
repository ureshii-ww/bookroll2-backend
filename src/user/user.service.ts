import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { nanoid } from 'nanoid/async';
import * as randomcolor from 'randomcolor';
import { randomEmoji } from '../helpers/randomEmoji';
import { RolesService } from '../roles/roles.service';
import { NewUserData } from './interfaces/newUserData.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              private rolesService: RolesService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getUserByEmail(email: string): Promise<UserDocument>  {
    return this.userModel.findOne({email}).exec();
  }

  async generateNewUserData(): Promise<NewUserData> {
    try {
      const userRole = await this.rolesService.getRoleByName('user');
      const url = await nanoid(12);
      const color = await randomcolor({luminosity: 'light'});
      const emoji = await randomEmoji();
      const roles = [userRole.id];

      return {
        url,
        color,
        emoji,
        roles,
        club: null,
        reviews: [],
        isEmailConfirmed: false
      }
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
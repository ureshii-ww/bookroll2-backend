import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getRoleByName(name: string): Promise<RoleDocument> {
    return this.roleModel.findOne({name}).exec();
  }
}

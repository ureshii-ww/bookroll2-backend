import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { TokensService } from '../tokens/tokens.service';
import { Role } from '../roles/schemas/role.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
              private TokensService: TokensService) {
  }

  async createSession(userId: mongoose.Types.ObjectId, url: string, roles: Role[]) {
    const sessions = await this.findAllUserSessions(userId);

    if (sessions.length >= 5) {
      await this.deleteSession(sessions[sessions.length - 1].refreshToken);
    }

    const accessToken = this.TokensService.generateAccessToken(url, roles);
    const refreshToken = this.TokensService.generateRefreshToken();

    const newSession = new this.sessionModel({ userId, refreshToken });

    await newSession.save();
    return { accessToken, refreshToken }
  }

  async findAllUserSessions(userId: mongoose.Types.ObjectId) {
    //mongoose.find() + TS bug workaround
    const filter: any = {userId};

    return this.sessionModel.find(filter);
  }

  async deleteSession(refreshToken: string): Promise<any> {
    return this.sessionModel.deleteOne({ refreshToken }).exec();
  }
}

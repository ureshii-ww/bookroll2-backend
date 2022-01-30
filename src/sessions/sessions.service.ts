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

    const maxSessionsForUser: number = 5;
    if (sessions.length >= maxSessionsForUser) {
      const earliestSession = await this.getEarliestSessionFromSessionsArray(sessions);
      await this.deleteSession(earliestSession.refreshToken);
    }

    const accessToken = this.TokensService.generateAccessToken(url, roles);
    const refreshToken = this.TokensService.generateRefreshToken();

    const newSession = new this.sessionModel({ userId, refreshToken });
    await newSession.save();

    return { accessToken, refreshToken }
  }

  async findAllUserSessions(userId: mongoose.Types.ObjectId) {
    //mongoose.find() + TS bug workaround
    const filter: any = { userId };

    return this.sessionModel.find(filter);
  }

  async deleteSession(refreshToken: string) {
    return this.sessionModel.deleteOne({ refreshToken }).exec();
  }

  async getEarliestSessionFromSessionsArray(sessionsArray: SessionDocument[]) {
    return sessionsArray.reduce((previousValue, currentValue) => {
      return previousValue.createdAt > currentValue.createdAt ? currentValue : previousValue;
    })
  }

  async getSession(refreshToken: string) {
    return this.sessionModel.findOne({refreshToken}).populate('userId').exec();
  }
}

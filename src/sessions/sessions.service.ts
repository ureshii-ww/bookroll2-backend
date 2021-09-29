import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto } from './dto/createSessionDto';
import { TokensService } from '../tokens/tokens.service';
import { SessionTokens } from './interfaces/sessionTokens.interface';
import { DeleteSessionDto } from './dto/deleteSession.dto';
import { FindAllUserSessionsDto } from './dto/findAllUserSessions.dto';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
              private TokensService: TokensService) {
  }

  async createSession(createSessionDto: CreateSessionDto): Promise<SessionTokens> {
    const sessions = await this.findAllUserSessions({userId: createSessionDto.userId});

    if (sessions.length >= 5) {
      await this.deleteSession({refreshToken: sessions[sessions.length - 1].refreshToken});
    }

    const accessToken = this.TokensService.generateAccessToken({
      url: createSessionDto.url,
      roles: createSessionDto.roles
    });
    const refreshToken = this.TokensService.generateRefreshToken();

    const newSession = new this.sessionModel({
      userId: createSessionDto.userId,
      refreshToken
    });

    await newSession.save();
    return {
      accessToken,
      refreshToken
    }
  }

  async findAllUserSessions(findAllUserSessionsDto: FindAllUserSessionsDto): Promise<SessionDocument[]> {
    //mongoose.find() + TS bug workaround
    const filter: any = {userId: findAllUserSessionsDto.userId};

    return this.sessionModel.find(filter);
  }

  async deleteSession(deleteSessionDto: DeleteSessionDto): Promise<any> {
    return this.sessionModel.deleteOne({ refreshToken: deleteSessionDto.refreshToken }).exec();
  }
}

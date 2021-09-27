import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto } from './dto/createSessionDto';
import { TokensService } from '../tokens/tokens.service';
import { NewSessionTokensInterface } from './interfaces/newSessionTokens.interface';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
              private TokensService: TokensService){}

  async createSession(createSessionDto: CreateSessionDto): Promise<NewSessionTokensInterface>{
    const accessToken = this.TokensService.generateAccessToken({
      url: createSessionDto.url,
      roles: createSessionDto.roles
    });
    const refreshToken = this.TokensService.generateRefreshToken();

    const newSession = new this.sessionModel({
      userId: createSessionDto.userId,
      refreshToken
    });

    try {
      await newSession.save();
      return {
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

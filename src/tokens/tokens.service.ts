import { Injectable } from '@nestjs/common';
import { GenerateAccessTokenDto } from './dto/generateAccessToken.dto';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';

@Injectable()
export class TokensService {
  constructor(private JwtService: JwtService) {
  }

  generateAccessToken(generateAccessTokenDto: GenerateAccessTokenDto): string {
    return this.JwtService.sign(generateAccessTokenDto);
  }

  generateRefreshToken(): string {
    return nanoid();
  }
}

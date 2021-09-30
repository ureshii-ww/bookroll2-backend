import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { Role } from '../roles/schemas/role.schema';

@Injectable()
export class TokensService {
  constructor(private JwtService: JwtService) {
  }

  generateAccessToken(url: string, roles: Role[]) {
    return this.JwtService.sign({url, roles});
  }

  generateRefreshToken() {
    return nanoid();
  }
}

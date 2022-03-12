import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '15m'
    }
  })],
  providers: [TokensService],
  exports: [TokensService, JwtModule]
})
export class TokensModule {}

import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import { TokensModule } from '../tokens/tokens.module';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Session.name, schema: SessionSchema
  }]), TokensModule],
  providers: [SessionsService],
  exports: [SessionsService],
  controllers: [SessionsController]
})
export class SessionsModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ClubModule } from './club/club.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { TokensModule } from './tokens/tokens.module';
import { SessionsModule } from './sessions/sessions.module';
import { ListOfBooksModule } from './list-of-books/list-of-books.module';
import { BookModule } from './book/book.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    UserModule,
    ClubModule,
    AuthModule,
    RolesModule,
    TokensModule,
    SessionsModule,
    ListOfBooksModule,
    BookModule,
    ReviewModule,
  ],
})
export class AppModule {}
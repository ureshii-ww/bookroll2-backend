import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { ListOfBooksModule } from '../list-of-books/list-of-books.module';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { ListOfBooks, ListOfBooksSchema } from '../list-of-books/schemas/list-of-books.shema';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {name: Book.name, schema: BookSchema},
      {name: User.name, schema: UserSchema},
      {name: ListOfBooks.name, schema: ListOfBooksSchema}
    ]),
    ListOfBooksModule,
    UserModule
  ]
})
export class BookModule {}

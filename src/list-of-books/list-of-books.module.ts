import { Module } from '@nestjs/common';
import { ListOfBooksService } from './list-of-books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ListOfBooks, ListOfBooksSchema } from './schemas/list-of-books.shema';
import { Club, ClubSchema } from '../club/schemas/club.schema';

@Module({
  providers: [ListOfBooksService],
  imports: [
    MongooseModule.forFeature([
      {name: ListOfBooks.name, schema: ListOfBooksSchema},
      {name: Club.name, schema: ClubSchema}
    ])
  ],
  exports: [ListOfBooksService]
})
export class ListOfBooksModule {}

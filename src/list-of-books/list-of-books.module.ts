import { Module } from '@nestjs/common';
import { ListOfBooksService } from './list-of-books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ListOfBooks, ListOfBooksSchema } from './schemas/list-of-books.shema';

@Module({
  providers: [ListOfBooksService],
  imports: [
    MongooseModule.forFeature([
      {name: ListOfBooks.name, schema: ListOfBooksSchema}
    ])
  ]
})
export class ListOfBooksModule {}

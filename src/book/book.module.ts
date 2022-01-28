import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [HttpModule,
    MongooseModule.forFeature([
      {name: Book.name, schema: BookSchema}
    ])
  ]
})
export class BookModule {}

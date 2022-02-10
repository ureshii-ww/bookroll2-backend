import { IsNumber } from 'class-validator';

export class DeleteBookDto {
  @IsNumber({}, {message: 'No index'})
  readonly index: number;
}
import { BasicUserInfo } from '../../user/types/basic-user-info';
import { BasicBookInfo } from '../../book/types/basic-book-info';

export class ClubBooks {
  readonly user: BasicUserInfo;
  readonly books: BasicBookInfo[];
}
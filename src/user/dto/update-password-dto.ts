import { IsString, Length, MinLength } from 'class-validator';
import authDataLength from '../../constants/auth-data-length';

const { PASSWORD_MIN_LENGTH } = authDataLength;

export class UpdatePasswordDto {
  @IsString({ message: 'Should be a string' })
  @MinLength(PASSWORD_MIN_LENGTH, { message: 'Password should be longer than 6 symbols' })
  readonly oldPassword: string;

  @IsString({ message: 'Should be a string' })
  @MinLength(PASSWORD_MIN_LENGTH, { message: 'Password should be longer than 6 symbols' })
  readonly newPassword: string;
}
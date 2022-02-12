import { IsEmail, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({message: 'Should be a string'})
  @Length(6, 128, {message: 'Password must be longer than 6 and shorter than 128 symbols'})
  readonly oldPassword: string;

  @IsString({message: 'Should be a string'})
  @Length(6, 128, {message: 'Password must be longer than 6 and shorter than 128 symbols'})
  readonly newPassword: string;
}
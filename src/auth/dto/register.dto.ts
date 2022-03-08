import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength, MinLength } from 'class-validator';
import authDataLength from '../../constants/auth-data-length';

const { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, EMAIL_MAX_LENGTH, PASSWORD_MIN_LENGTH } = authDataLength;

export class RegisterDto {
  @ApiProperty({ example: 'usern4m3', required: true, description: 'Username' })
  @IsString({ message: 'Should be a string' })
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: `Username must be longer than ${USERNAME_MIN_LENGTH} and shorter than ${USERNAME_MAX_LENGTH} symbols`,
  })
  readonly username: string;

  @ApiProperty({ example: 'usermail@gmail.com', required: true, description: 'Email' })
  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Should be an email' })
  @MaxLength(EMAIL_MAX_LENGTH, {
    message: `Email should be shorter than ${EMAIL_MAX_LENGTH}`,
  })
  readonly email: string;

  @ApiProperty({ example: 'pass1234', required: true, description: 'Password' })
  @IsString({ message: 'Should be a string' })
  @MinLength(PASSWORD_MIN_LENGTH, { message: 'Password should be longer than 6 symbols' })
  readonly password: string;
}

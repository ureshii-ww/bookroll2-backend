import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {

  @ApiProperty({example: 'usern4m3', required: true, description: 'Username'})
  @IsString({message: 'Should be a string'})
  @Length(3, 32, {message: 'Username must be longer than 3 and shorter than 32 symbols'})
  readonly username: string;

  @ApiProperty({example: 'usermail@gmail.com', required: true, description: 'Username'})
  @IsString({message: 'Should be a string'})
  @IsEmail({}, {message: 'Should be an email'})
  readonly email: string;

  @ApiProperty({example: 'pass1234', required: true, description: 'Password'})
  @IsString({message: 'Should be a string'})
  @Length(6, 128, {message: 'Password must be longer than 6 and shorter than 128 symbols'})
  readonly password: string;
}
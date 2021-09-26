import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({example: 'username', required: true, description: 'Username'})
  @IsString({message: 'Should be a string'})
  @IsEmail({}, {message: 'Should be an email'})
  readonly username: string;

  @ApiProperty({example: 'pass1234', required: true, description: 'Password'})
  @IsString({message: 'Should be a string'})
  @Length(6, 128, {message: 'Password must be longer than 6 and shorter than 128 symbols'})
  readonly password: string;
}
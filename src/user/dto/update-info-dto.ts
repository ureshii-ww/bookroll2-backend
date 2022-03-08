import { IsHexColor, IsString, Length } from 'class-validator';
import authDataLength from '../../constants/auth-data-length';

const { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } = authDataLength;

export class UpdateInfoDto {
  @IsString()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: `Username must be longer than ${USERNAME_MIN_LENGTH} and shorter than ${USERNAME_MAX_LENGTH} symbols`,
  })
  readonly username: string;

  @IsHexColor()
  readonly color: string;

  @IsString()
  readonly emoji: string;
}
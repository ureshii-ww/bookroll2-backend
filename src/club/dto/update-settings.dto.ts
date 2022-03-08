import { IsString, Length } from 'class-validator';
import authDataLength from '../../constants/auth-data-length';

const { CLUBNAME_MIN_LENGTH, CLUBNAME_MAX_LENGTH } = authDataLength;

export class UpdateSettingsDto {
  @IsString()
  @Length(CLUBNAME_MIN_LENGTH, CLUBNAME_MAX_LENGTH, {
    message: `Club's name must be longer than ${CLUBNAME_MIN_LENGTH} and shorter than ${CLUBNAME_MAX_LENGTH} symbols`,
  })
  readonly clubname: string;

  @IsString()
  readonly masterUrl: string;

  @IsString()
  readonly rules: string;
}
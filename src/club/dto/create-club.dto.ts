import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import authDataLength from '../../constants/auth-data-length';

const { CLUBNAME_MAX_LENGTH, CLUBNAME_MIN_LENGTH } = authDataLength;

export class CreateClubDto {
  @ApiProperty({ example: 'Cool_club', required: true, description: 'The name of the new club' })
  @IsString()
  @Length(CLUBNAME_MIN_LENGTH, CLUBNAME_MAX_LENGTH, {
    message: `Club's name must be longer than ${CLUBNAME_MIN_LENGTH} and shorter than ${CLUBNAME_MAX_LENGTH} symbols`,
  })
  readonly clubname: string;
}

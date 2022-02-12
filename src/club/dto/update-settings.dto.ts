import { IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  readonly clubname: string;

  @IsString()
  readonly masterUrl: string;

  @IsString()
  readonly description: string;
}
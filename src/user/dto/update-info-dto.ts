import { IsHexColor, IsString } from "class-validator";

export class UpdateInfoDto {
  @IsString()
  readonly username: string;

  @IsHexColor()
  readonly color: string;

  @IsString()
  readonly emoji: string;
}
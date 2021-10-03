import { AuthUserData } from './authUserData';

export interface AuthUserDataWithTokens {
  readonly refreshToken: string;
  readonly accessToken: string;
  readonly userData: AuthUserData;
}
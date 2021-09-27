import mongoose from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';

export interface LoginServiceInterface {
  readonly refreshToken: string;
  readonly accessToken: string;
  readonly userData: {
    readonly username:string;
    readonly url:string;
    readonly emoji:string;
    readonly color:string;
    readonly roles:Role[];
  }
}
import { Role } from '../../roles/schemas/role.schema';

export interface AuthData {
  readonly userData: {
    readonly username: string;
    readonly url: string;
    readonly emoji: string;
    readonly color: string;
    readonly roles: Role[];
    readonly isEmailConfirmed: boolean;
  }
}
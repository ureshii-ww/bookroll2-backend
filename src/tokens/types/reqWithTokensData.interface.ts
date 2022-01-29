import {Request} from 'express'

export interface ReqWithTokensData extends Request{
  user: {
    readonly url: string;
    readonly roles: string[];
    readonly iat: number;
    readonly exp: number;
  }
}
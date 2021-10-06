import { QueryResult } from '../types/request';

export type TokenInfo = {
  accessToken: string;
  scope?: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
};

export type JwtQueryResult = QueryResult<{ jwt: string }>;

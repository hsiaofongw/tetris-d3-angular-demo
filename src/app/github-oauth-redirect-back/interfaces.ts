export type TokenInfo = {
  accessToken: string;
  scope?: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
};


export type ErrorInfo = {
  statusCode?: number;
  message?: string;
  errorCode?: string;
  errorUri?: string;
};


export type JwtQueryResult = {
  error?: ErrorInfo;
  result: {
    jwt: string;
  };
};


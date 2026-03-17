export type TokenType = "access" | "refresh";

export type JwtPayload = {
  sub: number;
  username: string;
};

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

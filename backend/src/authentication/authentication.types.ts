export type TokenType = "access" | "refresh";

export type TokenOptionsPayload = {
  email: string;
  id: number;
};

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

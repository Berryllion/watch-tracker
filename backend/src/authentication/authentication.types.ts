export type TokenType = "access" | "refresh";

export type TokenPayload = {
  email: string;
  id: number;
};

export type LoginDto = {
  email: string;
  password: string;
};

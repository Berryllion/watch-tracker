import { IsEmail, IsString, MinLength } from "class-validator";

export type TokenType = "access" | "refresh";

export type JwtPayload = {
  sub: number;
  username: string;
};

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
}

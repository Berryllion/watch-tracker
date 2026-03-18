import { IsEmail, IsString, MinLength } from "class-validator";
import { Request } from "express";
import { UserDto } from "src/users/users.types";

export type TokenType = "access" | "refresh";

export type JwtPayload = {
  sub: number;
  username: string;
  email: string;
};

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
}

export type AuthenticatedRequest = Request & { user: UserDto };

import { User } from "generated/prisma/client";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) username: string;
  @IsString() @MinLength(8) password: string;
}

export class UpdateUserDto {
  @IsOptional() @IsEmail() email: string;
  @IsOptional() @IsString() @MinLength(3) username: string;
}

export type UserDto = Pick<User, "id" | "username" | "email">;

export type UserDtoWithSensitiveData = UserDto & {
  password: string;
  refreshToken: string | null;
};

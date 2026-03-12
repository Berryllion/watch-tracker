import { Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { type LoginDto } from "./authentication.types";
import { type CreateUserDto } from "src/users/users.types";

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("login")
  login(loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Post("register")
  register(createUserDto: CreateUserDto) {
    return this.authenticationService.register(createUserDto);
  }
}

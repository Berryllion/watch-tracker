import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { type LoginDto } from "./authentication.types";
import { Public } from "src/public";
import { CreateUserDto } from "src/users/users.types";

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Public()
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authenticationService.register(createUserDto);
  }

  @Public()
  @Post("refresh")
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.authenticationService.refresh(refreshToken);
  }

  @Public()
  @Post("logout")
  @HttpCode(204)
  logout(@Body("refreshToken") refreshToken: string) {
    return this.authenticationService.logout(refreshToken);
  }
}

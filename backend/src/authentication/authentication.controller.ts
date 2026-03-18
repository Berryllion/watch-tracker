import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { Public } from "src/public";
import { CreateUserDto } from "src/users/users.types";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { type AuthenticatedRequest } from "./authentication.types";

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authenticationService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Req() req: AuthenticatedRequest) {
    const user = req.user; // set by Passport from validate()

    return this.authenticationService.issueTokens(
      user.id,
      user.username,
      user.email,
    );
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

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Public } from "src/public";
import { CreateUserDto } from "src/users/users.types";
import { AuthenticationService } from "./authentication.service";
import { type AuthenticatedRequest } from "./authentication.types";
import { LocalAuthGuard } from "./local-auth.guard";

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
  @Post("refresh-access-token")
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.authenticationService.refreshAccessToken(refreshToken);
  }

  @Public()
  @Post("logout")
  @HttpCode(204)
  logout(@Body("refreshToken") refreshToken: string) {
    return this.authenticationService.logout(refreshToken);
  }
}

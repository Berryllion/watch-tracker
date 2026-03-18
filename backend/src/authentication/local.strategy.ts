import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { UserDto } from "src/users/users.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    return this.authService.checkCredentials({ email, password });
  }
}

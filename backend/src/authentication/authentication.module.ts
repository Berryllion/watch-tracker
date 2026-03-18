import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationController } from "./authentication.controller";
import { UsersModule } from "src/users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationGuard } from "./authentication.guard";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UsersModule,
    PassportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AuthenticationService,
    LocalStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}

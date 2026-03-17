import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationController } from "./authentication.controller";
import { UsersModule } from "src/users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationGuard } from "./authentication.guard";

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UsersModule,
  ],
  providers: [
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}

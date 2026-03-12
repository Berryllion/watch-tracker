import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationController } from "./authentication.controller";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [JwtModule, UsersModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}

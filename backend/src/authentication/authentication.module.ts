import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}

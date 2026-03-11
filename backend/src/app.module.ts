import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EntriesController } from "./entries/entries.controller";
// import { PrismaService } from "./prisma/prisma.service";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [],
  controllers: [AppController, EntriesController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}

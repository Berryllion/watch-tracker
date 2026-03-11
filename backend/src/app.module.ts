import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { EntriesModule } from "./watch-entries/watch-entries.module";

@Module({
  imports: [PrismaModule, UsersModule, EntriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

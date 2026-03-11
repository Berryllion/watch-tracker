import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { WatchEntriesController } from "./watch-entries.controller";
import { WatchEntriesService } from "./watch-entries.service";

@Module({
  imports: [PrismaModule],
  controllers: [WatchEntriesController],
  providers: [WatchEntriesService],
})
export class EntriesModule {}

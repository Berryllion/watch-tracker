import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { WatchEntriesService } from "./watch-entries.service";
import { Prisma, WatchStatus } from "generated/prisma/client";

@Controller("watch-entries")
export class WatchEntriesController {
  constructor(private readonly watchEntriesService: WatchEntriesService) {}

  @Post()
  createWatchEntry(@Body() createWatchEntryDto: Prisma.WatchEntryCreateInput) {
    return this.watchEntriesService.create(createWatchEntryDto);
  }

  @Get()
  findAll() {
    return this.watchEntriesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.watchEntriesService.findOne(id);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: number,
    @Body() data: Prisma.WatchEntryUpdateInput,
  ) {
    return this.watchEntriesService.update(id, data);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() status: WatchStatus) {
    return this.watchEntriesService.update(id, { status });
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.watchEntriesService.delete(id);
  }
}

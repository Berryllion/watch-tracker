import { Injectable } from "@nestjs/common";
import { Prisma, WatchEntry } from "generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WatchEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createEntryDto: Prisma.WatchEntryCreateInput,
  ): Promise<WatchEntry> {
    return this.prisma.watchEntry.create({ data: createEntryDto });
  }

  async findAll(): Promise<WatchEntry[]> {
    return this.prisma.watchEntry.findMany();
  }

  async findOne(id: number): Promise<WatchEntry | null> {
    return this.prisma.watchEntry.findUnique({ where: { id } });
  }

  async findManyWhere(
    where: Prisma.WatchEntryWhereInput,
  ): Promise<WatchEntry[]> {
    return this.prisma.watchEntry.findMany({ where });
  }

  async update(
    id: number,
    data: Prisma.WatchEntryUpdateInput,
  ): Promise<WatchEntry> {
    return this.prisma.watchEntry.update({ where: { id }, data });
  }

  async delete(id: number): Promise<WatchEntry> {
    return this.prisma.watchEntry.delete({ where: { id } });
  }
}

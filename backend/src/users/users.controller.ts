import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Prisma } from "generated/prisma/client";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOneUser(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Get("")
  findManyWhereUsers(@Body() where: Prisma.UserWhereInput) {
    return this.usersService.findManyWhere(where);
  }

  @Patch(":id")
  updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}

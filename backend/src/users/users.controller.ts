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
import { type CreateUserDto } from "./users.types";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/email-availability/:email")
  checkEmailAvailability(@Param("email") email: string) {
    return this.usersService.checkEmailAvailability(email);
  }

  @Get("/username-availability/:username")
  checkUsernameAvailability(@Param("username") username: string) {
    return this.usersService.checkUsernameAvailability(username);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
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

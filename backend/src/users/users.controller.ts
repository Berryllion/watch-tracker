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
import { Public } from "src/public";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get("/email-availability/:email")
  checkEmailAvailability(@Param("email") email: string) {
    return this.usersService.checkEmailAvailability(email);
  }

  @Public()
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
  findUserById(@Param("id") id: string) {
    return this.usersService.findById(+id);
  }

  @Get("")
  findManyUsersWhere(@Body() where: Prisma.UserWhereInput) {
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
  deleteUser(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}

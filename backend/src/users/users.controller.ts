import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "src/public";
import { UpdateUserDto } from "./users.types";

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

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findUserById(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(":id")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

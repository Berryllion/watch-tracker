import { Controller, Param, Body, Post, Put, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
// import { Prisma, User } from "generated/prisma/client";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // async getAllUsers(): Promise<User[]> {
  //   return this.usersService.getAllUsers();
  // }

  // @Post("/create")
  // async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
  //   return this.usersService.createUser(data);
  // }

  // @Put("/update/:id")
  // async updateUser(
  //   @Param("id") id: number,
  //   @Body() data: Prisma.UserUpdateInput,
  // ): Promise<User> {
  //   return this.usersService.updateUser(id, data);
  // }
}

import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "src/public";
import { UpdateUserDto } from "./users.types";
import { type AuthenticatedRequest } from "src/authentication/authentication.types";

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
  async findUserById(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  @Patch(":id")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException();
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Patch(":id/password")
  updatePassword(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() password: string,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException();
    }

    return this.usersService.updatePassword(id, password);
  }

  @Delete(":id")
  deleteUser(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException();
    }

    return this.usersService.remove(id);
  }
}

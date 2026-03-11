import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma, User } from "generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return !user;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    return !user;
  }

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const salt = this.config.get<number>("BCRYPT_SALT", 10);
    const hashedPassword = await bcrypt
      .hash(createUserDto.password, salt)
      .catch((error) => {
        throw new InternalServerErrorException("Failed to hash password", {
          cause: error,
        });
      });
    const data = { ...createUserDto, password: hashedPassword };

    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findManyWhere(where: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}

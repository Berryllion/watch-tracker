import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { Prisma, User } from "generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./users.types";

@Injectable()
export class UsersService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return !user;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    return !user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const [isEmailAvailable, isUsernameAvailable] = await Promise.all([
      this.checkEmailAvailability(createUserDto.email),
      this.checkUsernameAvailability(createUserDto.username),
    ]);

    if (!isEmailAvailable) {
      throw new ConflictException("Email already in use");
    } else if (!isUsernameAvailable) {
      throw new ConflictException("Username already in use");
    }

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

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findManyWhere(where: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where });
  }

  update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}

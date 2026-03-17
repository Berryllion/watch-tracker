import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserDtoWithSensitiveData,
} from "./users.types";

@Injectable()
export class UsersService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  private readonly userSelect = {
    id: true,
    email: true,
    username: true,
  } as const;

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.prisma.user.count({ where: { email } });

    return user === 0;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await this.prisma.user.count({ where: { username } });

    return user === 0;
  }

  private encryptPassword(password: string): Promise<string> {
    const salt = this.config.get<number>("BCRYPT_SALT", 10);
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const [isEmailAvailable, isUsernameAvailable] = await Promise.all([
      this.checkEmailAvailability(createUserDto.email),
      this.checkUsernameAvailability(createUserDto.username),
    ]);

    if (!isEmailAvailable) {
      throw new ConflictException("Email already in use");
    } else if (!isUsernameAvailable) {
      throw new ConflictException("Username already in use");
    }

    const hashedPassword = await this.encryptPassword(
      createUserDto.password,
    ).catch((error) => {
      throw new InternalServerErrorException("Failed to hash password", {
        cause: error,
      });
    });
    const data = { ...createUserDto, password: hashedPassword };

    return this.prisma.user.create({
      data,
      select: this.userSelect,
    });
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      select: this.userSelect,
    });

    return users;
  }

  async findByIdWithSensitiveData(
    id: number,
  ): Promise<UserDtoWithSensitiveData | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...this.userSelect,
        password: true,
        refreshToken: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...this.userSelect,
      },
    });
  }

  async findByEmailWithSensitiveData(
    email: string,
  ): Promise<UserDtoWithSensitiveData | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        ...this.userSelect,
        password: true,
        refreshToken: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto> {
    return this.prisma.user
      .update({
        where: { id },
        data,
        select: this.userSelect,
      })
      .catch((error) => {
        throw new InternalServerErrorException("Failed to update user", {
          cause: error,
        });
      });
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<UserDto> {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
      select: this.userSelect,
    });
  }

  async updatePassword(id: number, password: string): Promise<UserDto> {
    const hashedPassword = await this.encryptPassword(password).catch(
      (error) => {
        throw new InternalServerErrorException("Failed to hash password", {
          cause: error,
        });
      },
    );

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: this.userSelect,
    });
  }

  async remove(id: number): Promise<UserDto> {
    return this.prisma.user.delete({ where: { id }, select: this.userSelect });
  }
}

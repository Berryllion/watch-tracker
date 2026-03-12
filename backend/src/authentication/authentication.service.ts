import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import ms from "ms";
import {
  type LoginDto,
  type TokenPayload,
  type TokenType,
} from "./authentication.types";
import { UsersService } from "src/users/users.service";
import { User } from "generated/prisma/client";
import { CreateUserDto } from "src/users/users.types";

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private async generateTokenByType(
    tokenType: TokenType,
    payload: TokenPayload,
  ) {
    const secret = this.configService.get<string>(
      `JWT_${tokenType.toUpperCase()}_SECRET`,
    );
    const expiresIn = this.configService.get<ms.StringValue>(
      `JWT_${tokenType.toUpperCase()}_TOKEN_EXPIRY`,
    );

    try {
      return await this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to sign ${tokenType} token: `,
        { cause: error },
      );
    }
  }

  private async generateTokens(
    payload: TokenPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenByType("access", payload),
      this.generateTokenByType("refresh", payload),
    ]);

    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const [isEmailAvailable, isUsernameAvailable] = await Promise.all([
      this.usersService.checkEmailAvailability(createUserDto.email),
      this.usersService.checkUsernameAvailability(createUserDto.username),
    ]);

    if (!isEmailAvailable) {
      throw new ConflictException("Email already in use");
    } else if (!isUsernameAvailable) {
      throw new ConflictException("Username already in use");
    }

    return this.usersService.create(createUserDto);
  }

  private async checkCredentials(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt
      .compare(loginDto.password, user.password)
      .catch((error) => {
        throw new InternalServerErrorException(
          "Failed to compare passwords: ",
          { cause: error },
        );
      });

    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.checkCredentials(loginDto);

    return this.generateTokens({ email: user.email, id: user.id });
  }
}

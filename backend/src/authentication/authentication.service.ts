import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import ms from "ms";
import {
  type LoginDto,
  type TokenOptionsPayload,
  type TokenType,
  type TokensType,
} from "./authentication.types";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "src/users/users.types";

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private async generateTokenByType(
    tokenType: TokenType,
    payload: TokenOptionsPayload,
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

  private async issueTokens(payload: TokenOptionsPayload): Promise<TokensType> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenByType("access", payload),
      this.generateTokenByType("refresh", payload),
    ]);

    await this.usersService
      .update(payload.id, { refreshToken })
      .catch((error) => {
        throw new InternalServerErrorException(
          "Failed to update refresh token",
          { cause: error },
        );
      });

    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto): Promise<TokensType> {
    const user = await this.usersService.create(createUserDto);

    return this.issueTokens({ id: user.id, email: user.email });
  }

  private async checkCredentials(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

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

    return this.issueTokens({ id: user.id, email: user.email });
  }
}

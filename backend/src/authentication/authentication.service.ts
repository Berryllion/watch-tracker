import {
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
  type JwtPayload,
  type TokenType,
  type TokensType,
} from "./authentication.types";
import { UsersService } from "src/users/users.service";
import { CreateUserDto, UserDto } from "src/users/users.types";

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private async generateTokenByType(tokenType: TokenType, payload: JwtPayload) {
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
        `Failed to sign ${tokenType} token`,
        { cause: error },
      );
    }
  }

  private async issueTokens(id: number, username: string): Promise<TokensType> {
    const payload = { sub: id, username };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenByType("access", payload),
      this.generateTokenByType("refresh", payload),
    ]);

    await this.usersService
      .updateRefreshToken(id, refreshToken)
      .catch((error) => {
        throw new InternalServerErrorException(
          "Failed to update refresh token",
          {
            cause: error,
          },
        );
      });

    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto): Promise<TokensType> {
    const user = await this.usersService.create(createUserDto);

    return this.issueTokens(user.id, user.username);
  }

  private async checkCredentials(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithSensitiveData(
      loginDto.email,
    );

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt
      .compare(loginDto.password, user.password)
      .catch((error) => {
        throw new InternalServerErrorException("Failed to compare passwords", {
          cause: error,
        });
      });

    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async login(loginDto: LoginDto): Promise<TokensType> {
    const user = await this.checkCredentials(loginDto);

    return this.issueTokens(user.id, user.username);
  }

  private async verifyRefreshToken(refreshToken: string): Promise<UserDto> {
    const decoded = await this.jwtService
      .verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      })
      .catch((error) => {
        throw new UnauthorizedException("Invalid refresh token", {
          cause: error,
        });
      });

    const user = await this.usersService.findByIdWithSensitiveData(decoded.sub);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async refresh(refreshToken: string): Promise<TokensType> {
    const user = await this.verifyRefreshToken(refreshToken);

    return this.issueTokens(user.id, user.username);
  }

  async logout(refreshToken: string): Promise<void> {
    const user = await this.verifyRefreshToken(refreshToken);

    await this.usersService.updateRefreshToken(user.id, null);
  }
}

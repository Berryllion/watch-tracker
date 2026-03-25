import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import ms from "ms";
import { UsersService } from "src/users/users.service";
import { CreateUserDto, UserDto } from "src/users/users.types";
import {
    TokensType,
    type JwtPayload,
    type LoginDto,
    type TokenType,
} from "./authentication.types";

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

  async issueTokens(
    id: number,
    username: string,
    email: string,
  ): Promise<TokensType> {
    const payload = { sub: id, username, email };

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

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.create(createUserDto);

    return this.issueTokens(user.id, user.username, user.email);
  }

  async checkCredentials(loginDto: LoginDto): Promise<UserDto> {
    const user = await this.usersService.findByEmailWithSensitiveData(
      loginDto.email,
    );

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const passwordMatch = await bcrypt
      .compare(loginDto.password, user.password)
      .catch((error) => {
        throw new InternalServerErrorException("Failed to compare passwords", {
          cause: error,
        });
      });

    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
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

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.verifyRefreshToken(refreshToken);
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const newAccessToken = await this.generateTokenByType("access", payload);

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const user = await this.verifyRefreshToken(refreshToken);

    await this.usersService.updateRefreshToken(user.id, null);
  }
}

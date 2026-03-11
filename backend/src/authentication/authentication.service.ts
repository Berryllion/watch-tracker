import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async checkCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt
      .compare(password, user?.password || "")
      .catch((error) => {
        throw new InternalServerErrorException(
          "Failed to compare passwords: ",
          { cause: error },
        );
      });
    const areCredentialsValid = user && passwordMatch;

    if (!areCredentialsValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }
}

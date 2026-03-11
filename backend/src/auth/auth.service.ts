import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_EXPIRES_IN ?? 900);
const REFRESH_TOKEN_TTL_SECONDS = Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user.id, user.email, user.roles ?? []);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'changeme-refresh',
      });
      return this.issueTokens(payload.sub, payload.email, payload.roles ?? []);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private issueTokens(sub: string, email: string, roles: string[]) {
    const accessToken = this.jwtService.sign(
      { sub, email, roles },
      {
        secret: process.env.JWT_SECRET ?? 'changeme',
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub, email, roles },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'changeme-refresh',
        expiresIn: REFRESH_TOKEN_TTL_SECONDS,
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      refreshExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
    };
  }
}


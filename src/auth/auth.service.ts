import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async signup(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      const tokens = await this.getTokens(newUser.id, newUser.email);
      await this.updateRtHash(newUser.id, tokens.refreshToken);
      return tokens;
    } catch (e) {
      throw new Error(e);
    }
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new Error('User not found');

    const passwordMatch = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatch) throw new Error('Password incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  logout() {
  }

  refreshTokens() {
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: 900,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: 151200,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}

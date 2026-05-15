import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtAdminPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.ADMIN_JWT_SECRET || 'educakids-admin-secret-key',
    });
  }

  async validate(payload: JwtAdminPayload) {
    if (payload.role !== 'admin') {
      throw new UnauthorizedException('Acesso negado');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin não encontrado');
    }

    return admin;
  }
}

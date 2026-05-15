import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginAdminDto: LoginAdminDto) {
    const { email, password } = loginAdminDto;

    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const token = this.generateToken(admin.id, admin.email);

    return {
      message: 'Login de admin realizado com sucesso',
      admin: { id: admin.id, name: admin.name, email: admin.email },
      token,
    };
  }

  // Rota de setup: cria o primeiro admin (bloqueada se já existir algum)
  async setup(name: string, email: string, password: string) {
    const count = await this.prisma.admin.count();
    if (count > 0) {
      throw new ConflictException('Admin já configurado');
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await this.prisma.admin.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true },
    });

    return { message: 'Admin criado com sucesso', admin };
  }

  private generateToken(adminId: number, email: string): string {
    const payload = { sub: adminId, email, role: 'admin' };
    return this.jwtService.sign(payload, {
      secret: process.env.ADMIN_JWT_SECRET || 'educakids-admin-secret-key',
      expiresIn: '7d',
    });
  }
}

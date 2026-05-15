import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService, JwtAdminStrategy, JwtAdminGuard],
  exports: [JwtAdminGuard, JwtAdminStrategy],
})
export class AdminModule {}

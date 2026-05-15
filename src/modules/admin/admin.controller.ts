import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Post('setup')
  setup(@Body() body: { name: string; email: string; password: string }) {
    return this.adminService.setup(body.name, body.email, body.password);
  }

  @UseGuards(JwtAdminGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}

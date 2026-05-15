import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { VideosModule } from './modules/videos/videos.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, AuthModule, VideosModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

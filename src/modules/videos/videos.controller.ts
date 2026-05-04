import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateProgressDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  createVideo(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.createVideo(createVideoDto);
  }

  @Get()
  getAllVideos() {
    return this.videosService.getAllVideos();
  }

  @Get(':id')
  getVideoById(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.getVideoById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress/my')
  getUserProgress(@Request() req) {
    return this.videosService.getUserProgress(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress/:videoId')
  getVideoProgress(
    @Request() req,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return this.videosService.getVideoProgress(req.user.id, videoId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('progress')
  updateProgress(@Request() req, @Body() updateProgressDto: UpdateProgressDto) {
    return this.videosService.updateProgress(req.user.id, updateProgressDto);
  }

  @Delete(':id')
  deleteVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.deleteVideo(id);
  }
}

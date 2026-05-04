import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto, UpdateProgressDto } from './dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async createVideo(createVideoDto: CreateVideoDto) {
    return this.prisma.video.create({
      data: createVideoDto,
    });
  }

  async getAllVideos() {
    return this.prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVideoById(id: number) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }

    return video;
  }

  async getUserProgress(userId: number) {
    return this.prisma.videoProgress.findMany({
      where: { userId },
      include: { video: true },
      orderBy: { lastWatchedAt: 'desc' },
    });
  }

  async getVideoProgress(userId: number, videoId: number) {
    return this.prisma.videoProgress.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
      include: { video: true },
    });
  }

  async updateProgress(userId: number, updateProgressDto: UpdateProgressDto) {
    const { videoId, progress } = updateProgressDto;

    // Verificar se o vídeo existe
    await this.getVideoById(videoId);

    // Buscar progresso atual
    const currentProgress = await this.prisma.videoProgress.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    const oldProgress = currentProgress?.progress || 0;
    const wasCompleted = currentProgress?.completed || false;

    // Se o vídeo já foi completado, não permitir novas recompensas
    if (wasCompleted && currentProgress) {
      return {
        progress: 100,
        stars: currentProgress.stars,
        completed: true,
        rewards: {
          starsEarned: 0,
          trophyEarned: 0,
          pointsEarned: 0,
        },
      };
    }

    // Considerar completo se >= 98% (evita problema de não chegar a 100%)
    let newProgress = progress >= 98 ? 100 : progress;
    newProgress = Math.min(newProgress, 100);

    // PROTEÇÃO ANTI-TRAPAÇA: Não permitir saltos maiores que 15%
    const progressJump = newProgress - oldProgress;
    if (progressJump > 15 && oldProgress > 0) {
      throw new BadRequestException(
        'Progresso inválido detectado. Por favor, assista o vídeo normalmente.',
      );
    }

    // Garantir que o progresso nunca retroceda
    if (newProgress < oldProgress) {
      newProgress = oldProgress;
    }

    // Calcular estrelas ganhas (1 estrela a cada 5%)
    const oldStars = Math.floor(oldProgress / 5);
    const newStars = Math.floor(newProgress / 5);
    const starsEarned = Math.max(0, newStars - oldStars);

    // Verificar se completou o vídeo (troféu)
    const isNowCompleted = newProgress >= 100;
    const trophyEarned = !wasCompleted && isNowCompleted ? 1 : 0;

    // Atualizar ou criar progresso
    const updatedProgress = await this.prisma.videoProgress.upsert({
      where: {
        userId_videoId: { userId, videoId },
      },
      update: {
        progress: newProgress,
        stars: newStars,
        completed: isNowCompleted,
      },
      create: {
        userId,
        videoId,
        progress: newProgress,
        stars: newStars,
        completed: isNowCompleted,
      },
    });

    // Atualizar estrelas e troféus do usuário
    if (starsEarned > 0 || trophyEarned > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          stars: { increment: starsEarned },
          trophies: { increment: trophyEarned },
          points: { increment: starsEarned * 10 + trophyEarned * 100 },
        },
      });
    }

    return {
      progress: updatedProgress,
      rewards: {
        starsEarned,
        trophyEarned,
      },
    };
  }

  async deleteVideo(id: number) {
    await this.getVideoById(id);
    return this.prisma.video.delete({
      where: { id },
    });
  }
}

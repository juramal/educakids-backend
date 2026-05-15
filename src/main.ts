import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { execSync } from 'child_process';

async function bootstrap() {
  try {
    const migrateCmd = `"${process.execPath}" node_modules/prisma/bin.js migrate deploy`;
    execSync(migrateCmd, { stdio: 'inherit', cwd: process.cwd() });
  } catch {
    console.error('Migration falhou — continuando inicialização');
  }

  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:4173'];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Habilitar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Retorna erro se enviar propriedades extras
      transform: true, // Transforma tipos automaticamente
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('EducaKids API')
    .setDescription('Documentação das rotas da API EducaKids')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte a autenticação JWT no Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Aplicação rodando em: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Documentação em: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
void bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*', // Em produção, especifique o domínio do frontend
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

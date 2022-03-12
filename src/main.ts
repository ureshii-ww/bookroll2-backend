import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders: ['x-access-token', 'x-data-length']
  });
  app.use(cookieParser());
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Книжный клуб')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs/', app, swaggerDocument);

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  });
}

start();
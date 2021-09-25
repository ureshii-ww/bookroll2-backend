import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Книжный клуб')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs/', app, swaggerDocument);

  await app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});
}

start();
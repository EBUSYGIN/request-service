import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Service Requests API')
    .setDescription('Модуль учёта заявок на ремонт климатического оборудования')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new RolesGuard(reflector));
  await app.listen(3000);
}
bootstrap();

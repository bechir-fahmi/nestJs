import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: configService.get('client.url'),
      credentials: true,
    });
  }

  app.setGlobalPrefix('api/v1');
  
  const port = configService.get('port') || 5000;
  await app.listen(port);
}
bootstrap();
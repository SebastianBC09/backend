import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3001;
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  const corsOrigin = configService.get<string>('app.corsOrigin') || '*';
  const swaggerEnabled = configService.get<boolean>('app.swagger.enabled');

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'shopping-cart-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    }),
  );

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Shopping Cart API')
      .setDescription('Shopping Cart API Documentation')
      .setVersion('1.0')
      .addTag('items')
      .addTag('cart')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port, '0.0.0.0');

  console.log(`
    🚀 Application is running on: http://localhost:${port}
    📚 API Documentation: http://localhost:${port}/api/docs
    🔗 API Prefix: /${apiPrefix}
  `);
}

bootstrap();

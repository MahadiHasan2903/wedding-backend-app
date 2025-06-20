import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt/jwt-auth.guard';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Get the Reflector instance for guards that use metadata (e.g. @Roles)
  const reflector = app.get(Reflector);

  // Apply global guards
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  const port = process.env.PORT || 8080;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();

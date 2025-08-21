import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('check-health')
  checkHealth() {
    return {
      status: 'ok',
      message: 'Backend is running',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

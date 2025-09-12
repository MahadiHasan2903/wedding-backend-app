import { Request } from 'express';
import { LocationService } from './location.service';
import { Controller, Get, Req } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

interface LocationResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    ip: string;
    country: string;
    region: string;
    city: string;
  };
}

@Controller('v1/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get('country')
  getUserCountry(@Req() req: Request): LocationResponse {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '8.8.8.8';

    const { geo } = this.locationService.getLocationByIp(ip);

    return {
      status: 200,
      success: true,
      message: 'User country fetched successfully',
      data: {
        ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
      },
    };
  }
}

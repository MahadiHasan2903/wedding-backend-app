import * as geoip from 'geoip-lite';
import { Injectable } from '@nestjs/common';

export interface GeoInfo {
  country: string;
  region: string;
  city: string;
}

@Injectable()
export class LocationService {
  getGeoInfo(ip: string): GeoInfo {
    const geoRaw = geoip.lookup(ip);

    if (!geoRaw) {
      return { country: 'Unknown', region: 'N/A', city: 'N/A' };
    }

    return {
      country: geoRaw.country ?? 'Unknown',
      region: geoRaw.region ?? 'N/A',
      city: geoRaw.city ?? 'N/A',
    };
  }

  // Main method to get location by IP
  getLocationByIp(ip: string): { ip: string; geo: GeoInfo } {
    const geo = this.getGeoInfo(ip);
    return { ip, geo };
  }
}

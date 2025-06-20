import { ConfigService } from '@nestjs/config';

export const getRequiredConfig = (
  configService: ConfigService,
  key: string,
): string => {
  const value = configService.get<string>(key);
  if (!value) {
    throw new Error(`Missing env variable ${key}`);
  }
  return value;
};

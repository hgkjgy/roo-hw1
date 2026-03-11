import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV?: NodeEnv;

  @IsNumber()
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsNumber()
  @IsOptional()
  JWT_EXPIRES_IN?: number;

  @IsNumber()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN?: number;

   @IsString()
   @IsNotEmpty()
   DB_HOST!: string;

   @IsNumber()
   @IsNotEmpty()
   DB_PORT!: number;

   @IsString()
   @IsNotEmpty()
   DB_USER!: string;

   @IsString()
   @IsNotEmpty()
   DB_PASSWORD!: string;

   @IsString()
   @IsNotEmpty()
   DB_NAME!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}


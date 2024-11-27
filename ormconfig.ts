import { Logs } from 'src/database/logs.entity';
import { Profile } from 'src/database/profile.entity';
import { Roles } from 'src/database/roles.entity';
import { User } from 'src/database/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigEnum } from 'types/config.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const getEnvConfig = (): Record<string, any> => {
  const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
  const env = dotenv.config({ path: '.env' });
  const envConfig = dotenv.config({ path: envFilePath });
  return { ...env.parsed, ...envConfig.parsed };
};

// 通过环境变量获取不同的配置
const buildConnectionParams = () => {
  const config = getEnvConfig();
  return {
    type: 'mysql',
    host: config[ConfigEnum.DATA_HOST],
    port: config[ConfigEnum.DATA_PORT],
    username: config[ConfigEnum.DATA_USERNAME],
    password: config[ConfigEnum.DATA_PASSWORD],
    database: config[ConfigEnum.DATA_BASE],
    entities: [User, Profile, Roles, Logs],
    synchronize: true,
    logging: ['error'],
  } as TypeOrmModuleOptions;
};

export const connectionParams = buildConnectionParams();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);

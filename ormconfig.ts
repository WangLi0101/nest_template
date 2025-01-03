import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigEnum } from 'types/config.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Profile } from 'src/user/entities/profile.entity';
import { Logs } from 'src/logs/entities/logs.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Blog } from 'src/blog/entities/blog.entity';

const getEnvConfig = (): Record<string, any> => {
  const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
  const env = dotenv.config({ path: '.env' });
  const envConfig = dotenv.config({ path: envFilePath });
  return { ...env.parsed, ...envConfig.parsed };
};

const buildConnectionParams = () => {
  const config = getEnvConfig();
  return {
    type: 'mysql',
    host: config[ConfigEnum.DATA_HOST],
    port: config[ConfigEnum.DATA_PORT],
    username: config[ConfigEnum.DATA_USERNAME],
    password: config[ConfigEnum.DATA_PASSWORD],
    database: config[ConfigEnum.DATA_BASE],
    entities: [User, Profile, Roles, Logs, Menu, Tag, Blog],
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

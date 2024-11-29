import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from './logs.entity';
import { Roles } from './roles.entity';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  @OneToMany(() => Logs, (logs) => logs.user, {
    cascade: true,
  })
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable()
  roles: Roles[];
}

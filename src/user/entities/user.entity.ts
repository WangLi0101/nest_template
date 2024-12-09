import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';
import { Logs } from 'src/logs/entities/logs.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Blog } from 'src/blog/entities/blog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
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

  @OneToMany(() => Blog, (blog) => blog.user, {
    cascade: true,
  })
  blogs: Blog[];
}

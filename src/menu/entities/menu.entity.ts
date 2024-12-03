import { Roles } from 'src/roles/entities/roles.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  path: string;

  @Column()
  title: string;

  @Column({ default: '' })
  icon: string;

  @Column()
  isHidden: boolean;

  @Column({ default: 0 })
  sort: number;

  @ManyToOne(() => Menu, (menu) => menu.children, {
    onDelete: 'CASCADE',
  })
  parent: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent, { cascade: true })
  children: Menu[];

  @ManyToMany(() => Roles, (role) => role.menus)
  roles: Roles[];
}

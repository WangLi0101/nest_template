import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const menuTemp = this.menuRepository.create(createMenuDto);

    if (createMenuDto.parentId) {
      const parentMenu = await this.menuRepository.findOneBy({
        id: createMenuDto.parentId,
      });

      if (!parentMenu) {
        throw new HttpException('父级菜单不存在', HttpStatus.BAD_REQUEST);
      }

      menuTemp.parent = parentMenu;
    }

    return this.menuRepository.save(menuTemp);
  }

  async findAll() {
    const res = await this.menuRepository.find({
      relations: {
        parent: true,
      },
      select: {
        parent: { id: true },
      },
    });
    return res.map((item) => {
      return {
        ...item,
        parentId: item.parent?.id,
      };
    });
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return this.menuRepository.update(id, updateMenuDto);
  }

  async remove(id: number) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) throw new HttpException('菜单不存在', HttpStatus.BAD_REQUEST);
    return this.menuRepository.remove(menu);
  }
}

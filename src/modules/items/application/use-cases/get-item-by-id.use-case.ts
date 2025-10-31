import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { Event } from '../../domain/entities/event.entity';
import type { IItemRepository } from '../../infrastructure/repositories/item.repository.interface';

@Injectable()
export class GetItemByIdUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: string): Promise<Product | Event> {
    const item = await this.itemRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }

    return item;
  }
}

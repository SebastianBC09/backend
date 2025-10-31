import { Injectable } from '@nestjs/common';
import { QueryItemsDto } from '../dtos/query-items.dto';
import { Product } from '../../domain/entities/product.entity';
import { Event } from '../../domain/entities/event.entity';
import type { IItemRepository } from '../../infrastructure/repositories/item.repository.interface';

@Injectable()
export class GetItemsUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(query: QueryItemsDto): Promise<(Product | Event)[]> {
    return this.itemRepository.findAll(query);
  }
}

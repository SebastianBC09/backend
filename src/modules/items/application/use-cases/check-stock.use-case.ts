import { Injectable, BadRequestException } from '@nestjs/common';
import type { IItemRepository } from '../../infrastructure/repositories/item.repository.interface';

@Injectable()
export class CheckStockUseCase {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(itemId: string, quantity: number): Promise<boolean> {
    const item = await this.itemRepository.findById(itemId);

    if (!item) {
      throw new BadRequestException(`Item with ID "${itemId}" not found`);
    }

    return item.hasStock(quantity);
  }
}

import { Injectable } from '@nestjs/common';
import { GetItemsUseCase } from './application/use-cases/get-items.use-case';
import { GetItemByIdUseCase } from './application/use-cases/get-item-by-id.use-case';
import { CheckStockUseCase } from './application/use-cases/check-stock.use-case';
import { QueryItemsDto } from './application/dtos/query-items.dto';
import { Item } from './domain/entities/item.entity';
import { Product } from './domain/entities/product.entity';
import { Event } from './domain/entities/event.entity';

@Injectable()
export class ItemsService {
  constructor(
    private readonly getItemsUseCase: GetItemsUseCase,
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly checkStockUseCase: CheckStockUseCase,
  ) {}

  async findAll(query: QueryItemsDto): Promise<(Product | Event)[]> {
    return this.getItemsUseCase.execute(query);
  }

  async findById(id: string): Promise<Product | Event> {
    return this.getItemByIdUseCase.execute(id);
  }

  async checkStock(itemId: string, quantity: number): Promise<boolean> {
    return this.checkStockUseCase.execute(itemId, quantity);
  }

  async validateItemAvailability(
    itemId: string,
    quantity: number,
  ): Promise<Item> {
    const item = await this.findById(itemId);
    const hasStock = await this.checkStock(itemId, quantity);
    if (!hasStock) {
      throw new Error(
        `Insufficient stock for item "${item.name}". Available: ${item.stock}, Requested: ${quantity}`,
      );
    }

    return item;
  }
}

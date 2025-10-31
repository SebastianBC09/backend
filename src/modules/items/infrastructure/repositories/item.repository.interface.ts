import { Product } from '../../domain/entities/product.entity';
import { Event } from '../../domain/entities/event.entity';
import { QueryItemsDto } from '../../application/dtos/query-items.dto';

export interface IItemRepository {
  findAll(query: QueryItemsDto): Promise<(Product | Event)[]>;
  findById(id: string): Promise<Product | Event | null>;
  findByIds(ids: string[]): Promise<(Product | Event)[]>;
  create(item: Product | Event): Promise<Product | Event>;
  exists(id: string): Promise<boolean>;
  updateStock(id: string, quantity: number): Promise<void>;
}

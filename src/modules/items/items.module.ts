import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './infrastructure/schemas/item.schema';
import { ItemRepository } from './infrastructure/repositories/item.repository';
import { IItemRepository } from './infrastructure/repositories/item.repository.interface';
import { GetItemsUseCase } from './application/use-cases/get-items.use-case';
import { GetItemByIdUseCase } from './application/use-cases/get-item-by-id.use-case';
import { CheckStockUseCase } from './application/use-cases/check-stock.use-case';
import { ItemsService } from './items.service';
import { ItemsController } from './presentation/items.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  controllers: [ItemsController],
  providers: [
    {
      provide: 'IItemRepository',
      useClass: ItemRepository,
    },
    {
      provide: GetItemsUseCase,
      useFactory: (repository: IItemRepository) => {
        return new GetItemsUseCase(repository);
      },
      inject: ['IItemRepository'],
    },
    {
      provide: GetItemByIdUseCase,
      useFactory: (repository: IItemRepository) => {
        return new GetItemByIdUseCase(repository);
      },
      inject: ['IItemRepository'],
    },
    {
      provide: CheckStockUseCase,
      useFactory: (repository: IItemRepository) => {
        return new CheckStockUseCase(repository);
      },
      inject: ['IItemRepository'],
    },
    ItemsService,
  ],
  exports: [
    'IItemRepository',
    ItemsService,
    GetItemByIdUseCase,
    CheckStockUseCase,
  ],
})
export class ItemsModule {}

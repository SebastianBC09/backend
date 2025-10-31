import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './infrastructure/schemas/cart.schema';
import { CartRepository } from './infrastructure/repositories/cart.repository';
import { ICartRepository } from './infrastructure/repositories/cart.repository.interface';
import { AddItemToCartUseCase } from './application/use-cases/add-item-to-cart.use-case';
import { UpdateCartItemQuantityUseCase } from './application/use-cases/update-cart-item-quantity.use-case';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case';
import { ClearCartUseCase } from './application/use-cases/clear-cart.use-case';
import { CartService } from './cart.service';
import { CartController } from './presentation/cart.controller';
import { ItemsModule } from '../items/items.module';
import { IItemRepository } from '../items/infrastructure/repositories/item.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ItemsModule,
  ],
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartRepository',
      useClass: CartRepository,
    },
    {
      provide: AddItemToCartUseCase,
      useFactory: (
        cartRepository: ICartRepository,
        itemRepository: IItemRepository,
      ) => {
        return new AddItemToCartUseCase(cartRepository, itemRepository);
      },
      inject: ['ICartRepository', 'IItemRepository'],
    },
    {
      provide: UpdateCartItemQuantityUseCase,
      useFactory: (
        cartRepository: ICartRepository,
        itemRepository: IItemRepository,
      ) => {
        return new UpdateCartItemQuantityUseCase(
          cartRepository,
          itemRepository,
        );
      },
      inject: ['ICartRepository', 'IItemRepository'],
    },
    {
      provide: RemoveCartItemUseCase,
      useFactory: (cartRepository: ICartRepository) => {
        return new RemoveCartItemUseCase(cartRepository);
      },
      inject: ['ICartRepository'],
    },
    {
      provide: GetCartUseCase,
      useFactory: (cartRepository: ICartRepository) => {
        return new GetCartUseCase(cartRepository);
      },
      inject: ['ICartRepository'],
    },
    {
      provide: ClearCartUseCase,
      useFactory: (cartRepository: ICartRepository) => {
        return new ClearCartUseCase(cartRepository);
      },
      inject: ['ICartRepository'],
    },
    CartService,
  ],
  exports: [CartService],
})
export class CartModule {}

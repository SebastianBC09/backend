import { Injectable } from '@nestjs/common';
import { AddItemToCartUseCase } from './application/use-cases/add-item-to-cart.use-case';
import { UpdateCartItemQuantityUseCase } from './application/use-cases/update-cart-item-quantity.use-case';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case';
import { ClearCartUseCase } from './application/use-cases/clear-cart.use-case';
import { AddToCartDto } from './application/dtos/add-to-cart.dto';
import { UpdateQuantityDto } from './application/dtos/update-quantity.dto';
import { Cart } from './domain/entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  async getCart(sessionId: string): Promise<Cart> {
    return this.getCartUseCase.execute(sessionId);
  }

  async addItem(sessionId: string, dto: AddToCartDto): Promise<Cart> {
    return this.addItemToCartUseCase.execute(sessionId, dto);
  }

  async updateItemQuantity(
    sessionId: string,
    itemId: string,
    dto: UpdateQuantityDto,
  ): Promise<Cart> {
    return this.updateCartItemQuantityUseCase.execute(sessionId, itemId, dto);
  }

  async removeItem(sessionId: string, itemId: string): Promise<Cart> {
    return this.removeCartItemUseCase.execute(sessionId, itemId);
  }

  async clearCart(sessionId: string): Promise<void> {
    return this.clearCartUseCase.execute(sessionId);
  }

  async getCartSummary(sessionId: string) {
    const cart = await this.getCart(sessionId);
    return cart.getSummary();
  }
}

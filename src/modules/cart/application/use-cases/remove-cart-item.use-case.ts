import { Injectable, NotFoundException } from '@nestjs/common';
import type { ICartRepository } from '../../infrastructure/repositories/cart.repository.interface';
import { Cart } from '../../domain/entities/cart.entity';

@Injectable()
export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(sessionId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findBySessionId(sessionId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.removeItem(itemId);

    if (!cart.id) {
      throw new NotFoundException('Cart ID is missing');
    }
    return this.cartRepository.update(cart.id, cart);
  }
}

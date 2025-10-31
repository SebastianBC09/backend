import { Injectable } from '@nestjs/common';
import type { ICartRepository } from '../../infrastructure/repositories/cart.repository.interface';
import { Cart } from '../../domain/entities/cart.entity';

@Injectable()
export class GetCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(sessionId: string): Promise<Cart> {
    let cart = await this.cartRepository.findBySessionId(sessionId);

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    return cart;
  }
}

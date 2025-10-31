import { Injectable, NotFoundException } from '@nestjs/common';
import type { ICartRepository } from '../../infrastructure/repositories/cart.repository.interface';

@Injectable()
export class ClearCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(sessionId: string): Promise<void> {
    const cart = await this.cartRepository.findBySessionId(sessionId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepository.delete(cart.id!);
  }
}

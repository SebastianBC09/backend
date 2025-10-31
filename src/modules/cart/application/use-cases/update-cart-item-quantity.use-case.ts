import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { ICartRepository } from '../../infrastructure/repositories/cart.repository.interface';
import type { IItemRepository } from '../../../items/infrastructure/repositories/item.repository.interface';
import { Cart } from '../../domain/entities/cart.entity';
import { UpdateQuantityDto } from '../dtos/update-quantity.dto';

@Injectable()
export class UpdateCartItemQuantityUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(
    sessionId: string,
    itemId: string,
    dto: UpdateQuantityDto,
  ): Promise<Cart> {
    const cart = await this.cartRepository.findBySessionId(sessionId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.findItemByItemId(itemId);
    if (!cartItem) {
      throw new NotFoundException(`Item with ID "${itemId}" not found in cart`);
    }

    if (dto.quantity > 0) {
      const item = await this.itemRepository.findById(itemId);
      if (!item) {
        throw new BadRequestException(`Item with ID "${itemId}" not found`);
      }

      if (!item.hasStock(dto.quantity)) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${item.stock}, Requested: ${dto.quantity}`,
        );
      }
    }

    cart.updateItemQuantity(itemId, dto.quantity);

    return this.cartRepository.update(cart.id!, cart);
  }
}

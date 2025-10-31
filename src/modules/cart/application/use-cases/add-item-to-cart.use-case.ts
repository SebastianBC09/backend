import { Injectable, BadRequestException } from '@nestjs/common';
import type { ICartRepository } from '../../infrastructure/repositories/cart.repository.interface';
import type { IItemRepository } from '../../../items/infrastructure/repositories/item.repository.interface';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { AddToCartDto } from '../dtos/add-to-cart.dto';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(sessionId: string, dto: AddToCartDto): Promise<Cart> {
    const item = await this.itemRepository.findById(dto.itemId);
    if (!item) {
      throw new BadRequestException(`Item with ID "${dto.itemId}" not found`);
    }
    if (!item.hasStock(dto.quantity)) {
      throw new BadRequestException(
        `Insufficient stock for item "${item.name}". Available: ${item.stock}, Requested: ${dto.quantity}`,
      );
    }
    let cart = await this.cartRepository.findBySessionId(sessionId);
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }
    const existingCartItem = cart.findItemByItemId(dto.itemId);
    const totalQuantityNeeded = existingCartItem
      ? existingCartItem.quantity + dto.quantity
      : dto.quantity;

    if (!item.hasStock(totalQuantityNeeded)) {
      throw new BadRequestException(
        `Cannot add ${dto.quantity} more. Cart already has ${existingCartItem?.quantity || 0}. Available stock: ${item.stock}`,
      );
    }
    const cartItem = new CartItem({
      itemId: item.id!,
      name: item.name,
      type: item.type,
      price: item.price,
      quantity: dto.quantity,
      thumbnail: item.thumbnail,
    });
    cart.addItem(cartItem);
    if (cart.id) {
      return this.cartRepository.update(cart.id, cart);
    } else {
      return this.cartRepository.create(cart);
    }
  }
}

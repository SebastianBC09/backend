import { Cart } from '../entities/cart.entity';

export class CartSummary {
  readonly items: Array<{
    itemId: string;
    name: string;
    type: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    thumbnail?: string;
  }>;
  readonly totalQuantity: number;
  readonly totalPrice: number;

  constructor(
    items: Array<{
      itemId: string;
      name: string;
      type: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      thumbnail?: string;
    }>,
    totalQuantity: number,
    totalPrice: number,
  ) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  static fromCart(cart: Cart): CartSummary {
    const summary = cart.getSummary();
    return new CartSummary(
      summary.items,
      summary.totalQuantity,
      summary.totalPrice,
    );
  }
}

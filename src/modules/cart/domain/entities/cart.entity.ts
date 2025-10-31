import { CartItem } from './cart-item.entity';

export class Cart {
  id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Cart>) {
    Object.assign(this, partial);
    this.items = this.items || [];
  }

  addItem(item: CartItem): void {
    item.validate();

    const existingItem = this.findItemByItemId(item.itemId);

    if (existingItem) {
      existingItem.increaseQuantity(item.quantity);
    } else {
      this.items.push(item);
    }
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const item = this.findItemByItemId(itemId);
    if (!item) {
      throw new Error(`Item with ID "${itemId}" not found in cart`);
    }

    if (quantity === 0) {
      this.removeItem(itemId);
    } else {
      item.setQuantity(quantity);
    }
  }

  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.itemId === itemId);
    if (index === -1) {
      throw new Error(`Item with ID "${itemId}" not found in cart`);
    }
    this.items.splice(index, 1);
  }

  clear(): void {
    this.items = [];
  }

  findItemByItemId(itemId: string): CartItem | undefined {
    return this.items.find((item) => item.itemId === itemId);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getSummary() {
    return {
      items: this.items.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.getSubtotal(),
        thumbnail: item.thumbnail,
      })),
      totalQuantity: this.getTotalItems(),
      totalPrice: this.getTotalPrice(),
    };
  }

  validate(): void {
    if (!this.sessionId && !this.userId) {
      throw new Error('Cart must have either sessionId or userId');
    }
    this.items.forEach((item) => item.validate());
  }
}

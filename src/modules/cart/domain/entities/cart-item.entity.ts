export class CartItem {
  itemId: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  thumbnail?: string;

  constructor(partial: Partial<CartItem>) {
    Object.assign(this, partial);
  }

  getSubtotal(): number {
    return this.price * this.quantity;
  }

  validate(): void {
    if (!this.itemId) {
      throw new Error('Cart item must have an itemId');
    }
    if (this.quantity <= 0) {
      throw new Error('Cart item quantity must be positive');
    }
    if (this.price < 0) {
      throw new Error('Cart item price cannot be negative');
    }
  }

  increaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    this.quantity += amount;
  }

  decreaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (this.quantity - amount < 0) {
      throw new Error('Quantity cannot be negative');
    }
    this.quantity -= amount;
  }

  setQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    this.quantity = quantity;
  }
}

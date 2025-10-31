import { ItemType } from '../enums/item-type.enum';

export abstract class Item {
  id?: string;
  name: string;
  type: ItemType;
  price: number;
  thumbnail?: string;
  description?: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }

  hasStock(quantity: number = 1): boolean {
    return this.stock >= quantity;
  }

  reduceStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error(`Insufficient stock for item: ${this.name}`);
    }
    this.stock -= quantity;
  }

  increaseStock(quantity: number): void {
    this.stock += quantity;
  }

  calculateTotal(quantity: number): number {
    return this.price * quantity;
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Item name is required');
    }
    if (this.price < 0) {
      throw new Error('Item price cannot be negative');
    }
    if (this.stock < 0) {
      throw new Error('Item stock cannot be negative');
    }
  }
}

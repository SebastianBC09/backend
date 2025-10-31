import { Item } from './item.entity';
import { ItemType } from '../enums/item-type.enum';

export class Product extends Item {
  sku?: string;
  brand?: string;
  category?: string;
  weight?: number; // in grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  color?: string;
  size?: string;
  material?: string;

  constructor(partial: Partial<Product>) {
    super({ ...partial, type: ItemType.PRODUCT });
    Object.assign(this, partial);
  }

  validate(): void {
    super.validate();

    if (this.weight && this.weight < 0) {
      throw new Error('Product weight cannot be negative');
    }

    if (this.dimensions) {
      const { length, width, height } = this.dimensions;
      if (length <= 0 || width <= 0 || height <= 0) {
        throw new Error('Product dimensions must be positive');
      }
    }
  }

  getShippingWeight(): number {
    return this.weight ? this.weight + 100 : 0; // Add 100g for packaging
  }

  getDisplayName(): string {
    const details: string[] = [];
    if (this.brand) details.push(this.brand);
    if (this.name) details.push(this.name);
    if (this.color) details.push(this.color);
    if (this.size) details.push(this.size);
    return details.join(' - ');
  }
}

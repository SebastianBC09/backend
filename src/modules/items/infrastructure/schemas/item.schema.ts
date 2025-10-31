import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ItemType } from '../../domain/enums/item-type.enum';

export type ItemDocument = Item & Document;

class Dimensions {
  @Prop({ required: true })
  length: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;
}

@Schema({
  timestamps: true,
  collection: 'items',
})
export class Item {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 200 })
  name: string;

  @Prop({
    required: true,
    enum: ItemType,
    type: String,
  })
  type: ItemType;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ trim: true })
  thumbnail?: string;

  @Prop({ maxlength: 1000 })
  description?: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  // ========== PRODUCT-SPECIFIC FIELDS ==========

  @Prop({ trim: true, sparse: true })
  sku?: string;

  @Prop({ trim: true })
  brand?: string;

  @Prop({ trim: true })
  category?: string;

  @Prop({ min: 0 })
  weight?: number;

  @Prop({ type: Dimensions })
  dimensions?: Dimensions;

  @Prop({ trim: true })
  color?: string;

  @Prop({ trim: true })
  size?: string;

  @Prop({ trim: true })
  material?: string;

  // ========== EVENT-SPECIFIC FIELDS ==========

  @Prop({ type: Date })
  eventDate?: Date;

  @Prop({ trim: true })
  eventTime?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ trim: true })
  venue?: string;

  @Prop({ trim: true })
  artist?: string;

  @Prop({ trim: true })
  genre?: string;

  @Prop({ min: 0 })
  duration?: number;

  @Prop({ min: 0 })
  ageRestriction?: number;

  @Prop({ trim: true })
  seatType?: string;

  @Prop({ trim: true })
  section?: string;

  @Prop({ trim: true })
  row?: string;

  @Prop({ trim: true })
  seatNumber?: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.index({ type: 1 }); // Filter by type
ItemSchema.index({ name: 'text' }); // Text search
ItemSchema.index({ category: 1 }); // Filter products by category
ItemSchema.index({ artist: 1 }); // Filter events by artist
ItemSchema.index({ eventDate: 1 }); // Sort events by date
ItemSchema.index({ stock: 1 }); // Find items with stock

ItemSchema.virtual('id').get(function (
  this: Document & { _id: Types.ObjectId },
): string {
  return this._id.toHexString();
});

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
ItemSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc: any, ret: any) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

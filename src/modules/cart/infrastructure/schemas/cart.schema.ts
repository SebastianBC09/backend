import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document & { _id: Types.ObjectId };

class CartItemSchema {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop()
  thumbnail?: string;
}

@Schema({
  timestamps: true,
  collection: 'carts',
})
export class Cart {
  @Prop({ required: false })
  userId?: string;

  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItemSchema[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ sessionId: 1 });
CartSchema.index({ userId: 1 });

CartSchema.virtual('id').get(function (this: CartDocument) {
  return this._id.toHexString();
});

CartSchema.set('toJSON', {
  virtuals: true,

  transform: function (_doc, ret: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete ret._id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete ret.__v;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ret;
  },
});

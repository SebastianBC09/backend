import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICartRepository } from './cart.repository.interface';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Cart as CartEntity } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {}

  async findBySessionId(sessionId: string): Promise<CartEntity | null> {
    const document = await this.cartModel.findOne({ sessionId }).exec();
    return document ? this.toDomainEntity(document) : null;
  }

  async findByUserId(userId: string): Promise<CartEntity | null> {
    const document = await this.cartModel.findOne({ userId }).exec();
    return document ? this.toDomainEntity(document) : null;
  }

  async create(cart: CartEntity): Promise<CartEntity> {
    const document = new this.cartModel({
      userId: cart.userId,
      sessionId: cart.sessionId,
      items: cart.items,
    });
    const saved = await document.save();
    return this.toDomainEntity(saved);
  }

  async update(id: string, cart: CartEntity): Promise<CartEntity> {
    const document = await this.cartModel
      .findByIdAndUpdate(
        id,
        {
          items: cart.items,
        },
        { new: true },
      )
      .exec();

    if (!document) {
      throw new Error(`Cart with ID "${id}" not found`);
    }

    return this.toDomainEntity(document);
  }

  async delete(id: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(id).exec();
  }

  private toDomainEntity(document: CartDocument): CartEntity {
    const data = document.toObject() as {
      _id?: { toString(): string };
      id?: string;
      userId?: string;
      sessionId: string;
      items: Array<{
        itemId: string;
        name: string;
        type: string;
        price: number;
        quantity: number;
        thumbnail?: string;
      }>;
      createdAt?: Date;
      updatedAt?: Date;
    };

    return new CartEntity({
      id: data._id?.toString() || data.id,
      userId: data.userId,
      sessionId: data.sessionId,
      items: data.items.map(
        (item) =>
          new CartItem({
            itemId: item.itemId,
            name: item.name,
            type: item.type,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
          }),
      ),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

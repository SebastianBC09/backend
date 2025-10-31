import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { IItemRepository } from './item.repository.interface';
import { Item, ItemDocument } from '../schemas/item.schema';
import { Product } from '../../domain/entities/product.entity';
import { Event } from '../../domain/entities/event.entity';
import { ItemType } from '../../domain/enums/item-type.enum';
import { QueryItemsDto } from '../../application/dtos/query-items.dto';

@Injectable()
export class ItemRepository implements IItemRepository {
  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<ItemDocument>,
  ) {}

  async findAll(query: QueryItemsDto): Promise<(Product | Event)[]> {
    const filter: FilterQuery<ItemDocument> = {};

    // Filter by type
    if (query.type) {
      filter.type = query.type;
    }

    // Search by name (case-insensitive)
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    const documents = await this.itemModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    return documents.map((doc) => this.toDomainEntity(doc));
  }

  async findById(id: string): Promise<Product | Event | null> {
    const document = await this.itemModel.findById(id).exec();
    return document ? this.toDomainEntity(document) : null;
  }

  async findByIds(ids: string[]): Promise<(Product | Event)[]> {
    const documents = await this.itemModel.find({ _id: { $in: ids } }).exec();

    return documents.map((doc) => this.toDomainEntity(doc));
  }

  async create(item: Product | Event): Promise<Product | Event> {
    const document = new this.itemModel(item);
    const saved = await document.save();
    return this.toDomainEntity(saved);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.itemModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await this.itemModel
      .findByIdAndUpdate(id, { $inc: { stock: quantity } })
      .exec();
  }

  private toDomainEntity(document: ItemDocument): Product | Event {
    interface ItemData {
      _id?: { toString: () => string };
      id?: string;
      name: string;
      type: ItemType;
      price: number;
      thumbnail?: string;
      description?: string;
      stock: number;
      sku?: string;
      brand?: string;
      category?: string;
      weight?: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
      };
      color?: string;
      size?: string;
      material?: string;
      eventDate?: Date;
      eventTime?: string;
      location?: string;
      venue?: string;
      artist?: string;
      genre?: string;
      duration?: number;
      ageRestriction?: number;
      seatType?: string;
      section?: string;
      row?: string;
      seatNumber?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }

    const data = document.toObject() as ItemData;

    if (data.type === ItemType.PRODUCT) {
      return new Product({
        id: data._id?.toString() || data.id,
        name: data.name,
        type: data.type,
        price: data.price,
        thumbnail: data.thumbnail,
        description: data.description,
        stock: data.stock,
        sku: data.sku,
        brand: data.brand,
        category: data.category,
        weight: data.weight,
        dimensions: data.dimensions,
        color: data.color,
        size: data.size,
        material: data.material,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    } else {
      return new Event({
        id: data._id?.toString() || data.id,
        name: data.name,
        type: data.type,
        price: data.price,
        thumbnail: data.thumbnail,
        description: data.description,
        stock: data.stock,
        eventDate: data.eventDate!,
        eventTime: data.eventTime,
        location: data.location!,
        venue: data.venue,
        artist: data.artist,
        genre: data.genre,
        duration: data.duration,
        ageRestriction: data.ageRestriction,
        seatType: data.seatType,
        section: data.section,
        row: data.row,
        seatNumber: data.seatNumber,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }
  }
}

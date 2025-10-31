import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ItemResponseDto } from '../application/dtos/item-response.dto';
import { QueryItemsDto } from '../application/dtos/query-items.dto';
import { ItemsService } from '../items.service';
import { Product } from '../domain/entities/product.entity';
import { Event } from '../domain/entities/event.entity';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({
    status: 200,
    description: 'List of items',
    type: [ItemResponseDto],
  })
  async findAll(@Query() query: QueryItemsDto): Promise<ItemResponseDto[]> {
    const items = await this.itemsService.findAll(query);
    return items.map((item) => this.toResponseDto(item));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item found',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.itemsService.findById(id);
    return this.toResponseDto(item);
  }

  private toResponseDto(item: Product | Event): ItemResponseDto {
    const response: ItemResponseDto = {
      id: item.id ?? '',
      name: item.name,
      type: item.type,
      price: item.price,
      stock: item.stock,
    };

    // Optional fields
    if (item.thumbnail) response.thumbnail = item.thumbnail;
    if (item.description) response.description = item.description;

    // Product-specific fields
    if (item instanceof Product) {
      if (item.brand) response.brand = item.brand;
      if (item.category) response.category = item.category;
    }

    // Event-specific fields
    if (item instanceof Event) {
      if (item.eventDate) response.eventDate = item.eventDate;
      if (item.location) response.location = item.location;
      if (item.artist) response.artist = item.artist;
      if (item.venue) response.venue = item.venue;
    }

    return response;
  }
}

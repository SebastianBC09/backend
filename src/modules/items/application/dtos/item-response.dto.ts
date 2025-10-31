import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemType } from '../../domain/enums/item-type.enum';

export class ItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ItemType })
  type: ItemType;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  stock: number;

  // Product-specific
  @ApiPropertyOptional()
  brand?: string;

  @ApiPropertyOptional()
  category?: string;

  // Event-specific
  @ApiPropertyOptional()
  eventDate?: Date;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  artist?: string;

  @ApiPropertyOptional()
  venue?: string;
}

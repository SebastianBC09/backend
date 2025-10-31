import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ItemType } from '../../domain/enums/item-type.enum';

/**
 * Simple query DTO - just for filtering by type
 */
export class QueryItemsDto {
  @ApiPropertyOptional({
    enum: ItemType,
    description: 'Filter by item type',
  })
  @IsOptional()
  @IsEnum(ItemType)
  type?: ItemType;

  @ApiPropertyOptional({
    description: 'Search by name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

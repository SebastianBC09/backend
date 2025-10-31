import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID of the item to add',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

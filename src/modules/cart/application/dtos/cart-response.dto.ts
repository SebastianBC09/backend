import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  itemId: string;

  @ApiProperty({ example: 'Sunglasses Carey' })
  name: string;

  @ApiProperty({ example: 'PRODUCT' })
  type: string;

  @ApiProperty({ example: 3 })
  quantity: number;

  @ApiProperty({ example: 39.99 })
  unitPrice: number;

  @ApiProperty({ example: 119.97 })
  subtotal: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  thumbnail?: string;
}

export class CartResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  id: string;

  @ApiProperty({ example: 'session-abc-123', required: false })
  sessionId?: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty({ example: 8 })
  totalQuantity: number;

  @ApiProperty({ example: 419.97 })
  totalPrice: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

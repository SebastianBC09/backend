import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from '../cart.service';
import { AddToCartDto } from '../application/dtos/add-to-cart.dto';
import { UpdateQuantityDto } from '../application/dtos/update-quantity.dto';
import { CartResponseDto } from '../application/dtos/cart-response.dto';
import { Cart } from '../domain/entities/cart.entity';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  async getCart(
    @Session() session: Record<string, any>,
  ): Promise<CartResponseDto> {
    const sessionId = this.getOrCreateSessionId(session);
    const cart = await this.cartService.getCart(sessionId);
    return this.toResponseDto(cart);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get cart summary' })
  @ApiResponse({
    status: 200,
    description: 'Cart summary retrieved successfully',
  })
  async getCartSummary(@Session() session: Record<string, any>) {
    const sessionId = this.getOrCreateSessionId(session);
    return this.cartService.getCartSummary(sessionId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (insufficient stock, invalid item)',
  })
  async addItem(
    @Session() session: Record<string, any>,
    @Body() dto: AddToCartDto,
  ): Promise<CartResponseDto> {
    const sessionId = this.getOrCreateSessionId(session);
    const cart = await this.cartService.addItem(sessionId, dto);
    return this.toResponseDto(cart);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiBody({ type: UpdateQuantityDto })
  @ApiResponse({
    status: 200,
    description: 'Item quantity updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async updateItemQuantity(
    @Session() session: Record<string, any>,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateQuantityDto,
  ): Promise<CartResponseDto> {
    const sessionId = this.getOrCreateSessionId(session);
    const cart = await this.cartService.updateItemQuantity(
      sessionId,
      itemId,
      dto,
    );
    return this.toResponseDto(cart);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async removeItem(
    @Session() session: Record<string, any>,
    @Param('itemId') itemId: string,
  ): Promise<CartResponseDto> {
    const sessionId = this.getOrCreateSessionId(session);
    const cart = await this.cartService.removeItem(sessionId, itemId);
    return this.toResponseDto(cart);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({
    status: 204,
    description: 'Cart cleared successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async clearCart(@Session() session: Record<string, any>): Promise<void> {
    const sessionId = this.getOrCreateSessionId(session);
    await this.cartService.clearCart(sessionId);
  }

  private getOrCreateSessionId(session: Record<string, any>): string {
    if (!session.cartId) {
      session.cartId = uuidv4();
    }
    return session.cartId as string;
  }

  private toResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.id || '',
      sessionId: cart.sessionId || '',
      items: cart.items.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.getSubtotal(),
        thumbnail: item.thumbnail,
      })),
      totalQuantity: cart.getTotalItems(),
      totalPrice: cart.getTotalPrice(),
      createdAt: cart.createdAt || new Date(),
      updatedAt: cart.updatedAt || new Date(),
    };
  }
}

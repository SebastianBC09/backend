import { Cart } from '../../domain/entities/cart.entity';

export interface ICartRepository {
  findBySessionId(sessionId: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  create(cart: Cart): Promise<Cart>;
  update(id: string, cart: Cart): Promise<Cart>;
  delete(id: string): Promise<void>;
}

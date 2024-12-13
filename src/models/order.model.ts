import { Product } from './product.model';

export interface Order {
  id: number;
  createdAt: Date;
  orderedProducts: Array<Product>;
  totalPrice: number;
  userId: number;
}

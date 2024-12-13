import { Review } from './review.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  age: string;
  origin: string;
  size: 'Small' | 'Medium' | 'Large';
  reviews: Array<Review>;
  addedDate: Date;
  quantity: number;
}

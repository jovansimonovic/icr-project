import { Product } from './product.model';

export interface RasaModel {
  recipient_id: string;
  text: string | null;
  image: string | null;
  attachment: Product[] | null;
  custom: {
    actionType: string;
    products: Product[];
  } | null;
}

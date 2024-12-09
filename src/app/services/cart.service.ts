import { Injectable } from '@angular/core';
import { Product } from './product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private static cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');

  private cartItemsSubject = new BehaviorSubject<Product[]>(CartService.cart);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartItemCount = new BehaviorSubject<number>(this.getCartItemCount());
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  private getCartItemCount(): number {
    return CartService.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // adds item to cart
  addToCart(product: Product) {
    const productIndex = CartService.cart.findIndex((item) => item.id === product.id);

    if (productIndex === -1) {
      product.quantity = 1;
      CartService.cart.push(product);
    } else {
      CartService.cart[productIndex].quantity += 1;
    }

    this.updateCart();
    this.snackBar.open('Item added to cart', 'Close', { duration: 5000 });
  }

  // returns all items in cart
  getCartItems(): Product[] {
    return this.cartItemsSubject.getValue();
  }

  // removes item from cart
  removeItem(id: number) {
    CartService.cart = CartService.cart.filter((item) => item.id !== id);
    this.updateCart();
  }

  // updates the cart in localStorage and notifies subscribers
  private updateCart() {
    localStorage.setItem('cart', JSON.stringify(CartService.cart));
    this.cartItemsSubject.next(CartService.cart);
    this.cartItemCount.next(this.getCartItemCount());
  }

  // updates the cart items and quantities
  updateCartItems(items: Product[]) {
    CartService.cart = items;
    this.updateCart();
  }
}

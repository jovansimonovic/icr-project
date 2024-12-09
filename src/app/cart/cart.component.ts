import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];

  displayedColumns = ['name', 'image', 'size', 'price', 'options'];

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  // increases quantity of product
  increaseQuantity(id: number) {
    let itemToIncrement = this.cartItems.find((item) => item.id === id);
    if (itemToIncrement) {
      itemToIncrement.quantity += 1;
      this.cartService.updateCartItems(this.cartItems);
    }
  }

  // decreases quantity of product
  decreaseQuantity(id: number) {
    let itemToDecrement = this.cartItems.find((item) => item.id === id);
    if (itemToDecrement) {
      if (itemToDecrement.quantity > 1) {
        itemToDecrement.quantity -= 1;
        this.cartService.updateCartItems(this.cartItems);
      }
    }
  }

  // removes item from cart
  removeItem(id: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
    this.cartService.updateCartItems(this.cartItems);
    this.snackBar.open('Item removed from cart', 'Close', { duration: 5000 });
  }

  // calculates total price of all products in cart
  calculateTotalPrice() {
    let price = this.cartItems.reduce((price, item) => {
      return price + item.price * item.quantity;
    }, 0);

    return Math.round(price * 100) / 100;
  }

  confirmOrder() {
    if (this.userService.isLoggedIn()) {
      this.orderService.createOrder(this.cartItems);
      localStorage.removeItem('cart');
      this.cartService.updateCartItems([]);
      this.snackBar.open('Order created successfully', 'Close', {
        duration: 5000,
      });
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['login']);
    }
  }
}

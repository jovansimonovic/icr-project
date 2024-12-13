import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private static dummyOrderList: Array<Order> = [];

  maxId: number = 0;

  constructor(private userService: UserService) {}

  // returns all orders
  getAllOrders() {
    return OrderService.dummyOrderList;
  }

  // returns all orders that match provided user id
  getOrdersByUserId(userId: number) {
    userId = this.userService.getUserFromLocalStorage().id;

    let orders: Array<Order> = OrderService.dummyOrderList.filter(
      (order) => order.userId === userId
    );

    return orders;
  }

  // creates an order and pushes it to dummyOrderList array
  createOrder(cartItems: Product[]) {
    let price = cartItems.reduce((price, item) => {
      return price + item.price;
    }, 0);

    let userId = this.userService.getUserFromLocalStorage().id;

    let order = {
      id: ++this.maxId,
      createdAt: new Date(),
      orderedProducts: cartItems,
      totalPrice: price,
      userId: userId,
    };

    OrderService.dummyOrderList.push(order);
  }
}

import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user!: User;
  orders: Order[] = [];

  displayedColumns = ['id', 'createdAt', 'products', 'totalPrice'];

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.userService.userSubject$.subscribe((user) => {
      this.user = user;
    });

    this.orders = this.orderService.getOrdersByUserId(
      this.userService.getUserFromLocalStorage().id
    );
  }

  // opens edit dialog
  openDialog() {
    this.dialog.open(EditComponent, {
      disableClose: false,
      width: '450px',
      height: '80dvh',
    });
  }
}

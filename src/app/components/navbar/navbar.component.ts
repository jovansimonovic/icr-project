import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  cartItemCount: number = 0;

  constructor(
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.userService.isLoggedIn$.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;
    });
    this.cartService.cartItemCount$.subscribe(
      (count) => (this.cartItemCount = count)
    );
  }

  logout() {
    this.userService.logout();
  }
}

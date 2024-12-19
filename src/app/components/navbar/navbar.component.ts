import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { MessageModel } from '../../../models/message.model';
import { ChatbotService } from '../../../services/chatbot.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  cartItemCount: number = 0;
  isChatVisible = false;

  waitingForResponse = false;
  botThinkingPlaceholder = 'Thinking...';

  userMessage: string = '';
  messages: MessageModel[] = [];

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private chatbotService: ChatbotService
  ) {}

  ngOnInit(): void {
    this.userService.isLoggedIn$.subscribe((loginStatus) => {
      this.isLoggedIn = loginStatus;
    });
    this.cartService.cartItemCount$.subscribe(
      (count) => (this.cartItemCount = count)
    );
  }

  ngAfterViewChecked(): void {}

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  pushMessage() {}

  sendMessage() {}

  logout() {
    this.userService.logout();
  }
}

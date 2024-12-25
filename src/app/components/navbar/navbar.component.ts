import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { MessageModel } from '../../../models/message.model';
import { ChatbotService } from '../../../services/chatbot.service';
import { RasaModel } from '../../../models/rasa.model';
import { HttpErrorResponse } from '@angular/common/http';

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

  // grants access the #chatBody element directly
  @ViewChild('chatBody', { static: false }) chatBody: ElementRef | undefined;

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

    if (!localStorage.getItem('messages')) {
      localStorage.setItem(
        'messages',
        JSON.stringify([{ type: 'bot', text: 'Hi! How can I help you?' }])
      );
    }

    this.messages = JSON.parse(localStorage.getItem('messages')!);
  }

  ngAfterViewChecked(): void {
    // scrolls to bottom after the view has been updated
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  pushMessage(message: MessageModel) {
    if (
      message.type === 'bot' &&
      message.text === this.botThinkingPlaceholder
    ) {
      this.waitingForResponse = true;
    }

    if (message.type === 'bot' && message.text != this.botThinkingPlaceholder) {
      // tries to find placeholder thinking message
      for (let msg of this.messages) {
        if (msg.type === 'bot' && msg.text === this.botThinkingPlaceholder) {
          msg.text = message.text;
          this.waitingForResponse = false;
          return;
        }
      }
    }

    this.messages.push(message);

    // saves messages in local storage
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  sendMessage() {
    if (this.waitingForResponse) return;

    if (this.userMessage.trim()) {
      const trimmedInput = this.userMessage;

      this.userMessage = '';

      this.pushMessage({ type: 'user', text: trimmedInput });
      this.pushMessage({ type: 'bot', text: this.botThinkingPlaceholder });

      this.chatbotService.getRasaMessage(trimmedInput).subscribe(
        (response: RasaModel[]) => {
          if (response.length === 0) {
            this.pushMessage({
              type: 'bot',
              text: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
            });
            return;
          }
          response
            .map((message) => {
              if (message.image) {
                return `<img src="${message.image}" width=200 />`;
              }

              if (message.attachment) {
                return 'attachment';
              }

              return message.text;
            })
            .forEach((message) => {
              this.pushMessage({ type: 'bot', text: message! });
            });
        },
        (error: HttpErrorResponse) => {
          this.pushMessage({
            type: 'bot',
            text: 'Sorry, I am not available at the moment.',
          });
        }
      );
    }
  }

  logout() {
    this.userService.logout();
  }
}

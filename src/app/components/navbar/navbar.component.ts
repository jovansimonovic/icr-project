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

    if (
      message.type === 'bot' &&
      message.text !== this.botThinkingPlaceholder
    ) {
      // tries to find placeholder thinking message
      const placeholderIndex = this.messages.findIndex(
        (msg) => msg.type === 'bot' && msg.text === this.botThinkingPlaceholder
      );

      if (placeholderIndex !== -1) {
        this.messages[placeholderIndex].text = message.text;
        this.waitingForResponse = false;
        localStorage.setItem('messages', JSON.stringify(this.messages));
        return;
      }
    }

    // if not replacing the placeholder, just push the message
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

              if (message.custom?.actionType === 'add_to_cart') {
                message.custom?.products.forEach((product) => {
                  this.cartService.addToCart(product);
                });
                return null;
              }

              if (message.attachment) {
                let html = '';

                for (let product of message.attachment) {
                  html += `
                <div class="relative flex flex-col bg-white rounded-lg w-full">
                  <div class="px-2 py-1">
                    <span class="text-slate-800 text-xl font-semibold">
                      ${product.name}
                    </span>
                  </div>
                  <div class="relative overflow-hidden bg-clip-border">
                    <img src="${product.image}" alt="${product.name}" class="w-full object-cover rounded-md" />
                  </div>
                  <div class="p-2">
                    <div class="mb-2 flex flex-col">
                      <span class="text-slate-800 font-semibold">
                        Species: ${product.category}
                      </span>
                      <span class="text-slate-800 font-semibold">
                        Size: ${product.size}
                      </span>
                      <span class="text-slate-800 font-semibold">
                        Origin: ${product.origin}
                      </span>
                    </div>
                    <p class="text-slate-600 text-justify">
                      ${product.description}
                    </p>
                    <div class="flex justify-between items-center">
                      <span class="text-slate-800 text-xl font-semibold">
                        ${product.price}€
                      </span>
                      <a href="/product-list/${product.id}" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md">
                        <i class="fa-solid fa-circle-info"></i> Details
                      </a>
                    </div>
                  </div>
                </div>
                `;
                }
                return html;
              }
              return message.text;
            })
            .filter((message) => message !== null)
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

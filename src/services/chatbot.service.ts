import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RasaModel } from '../models/rasa.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private static instance: ChatbotService;
  private baseUrl: string;
  private client: HttpClient;

  private constructor() {
    this.baseUrl = 'https://flight.pequla.com.api';
    this.client = inject(HttpClient);
  }

  public static getInstance() {
    if (this.instance == undefined) this.instance = new ChatbotService();
    return this.instance;
  }

  private retrieveRasaSession() {
    if (!localStorage.getItem('session'))
      localStorage.setItem('session', uuidv4());

    return localStorage.getItem('session');
  }

  // rasa chat bot response API
  public getRasaMessage(userMessage: string) {
    const url = 'http://localhost:5005/webhooks/rest/webhook';
    return this.client.post<RasaModel[]>(
      url,
      {
        sender: this.retrieveRasaSession(),
        refreshToken: localStorage.getItem('active')
          ? localStorage.getItem('active')
          : '',
        message: userMessage,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );
  }

  public formatDate(date: string | null) {
    if (date === null) return 'On Time';
    return new Date(date).toLocaleString();
  }

  public formatValue(string: string | null) {
    if (string === null) return 'N/A';
    return string;
  }
}

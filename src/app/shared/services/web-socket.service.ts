import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://chewi-check.com', {
      transports: ['websocket', 'polling'], // Поддерживаемые транспорты
      path: '/socket.io/', // Путь для WebSocket
    });
  }

  // Отправка данных на сервер
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Подписка на события от сервера
  on(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Подписка на обновления клиента
  onClientUpdated(): Observable<any> {
    return this.on('clientUpdated');
  }

  // Отключение WebSocket
  disconnect(): void {
    this.socket.disconnect();
  }
}
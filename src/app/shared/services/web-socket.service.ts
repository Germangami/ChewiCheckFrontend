import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://chewi-check.com'); // URLSERVER сервера
    // this.socket = io('http://localhost:5000'); // URLLOCAL сервера
  }

  // Отправка данных
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Подписка на события
  on(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Отключение
  disconnect(): void {
    this.socket.disconnect();
  }

  // Подписка на обновление клиента
  onClientUpdated(): Observable<any> {
    return this.on('clientUpdated');
  }
}
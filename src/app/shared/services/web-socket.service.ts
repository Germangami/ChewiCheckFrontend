import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Store } from '@ngxs/store';
import { WebSocketConnected, WebSocketDisconnected, WebSocketMessageReceived } from '../../state/websocket/websocket.actions';
import { Client } from '../Model/ClientModel/client-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor(private store: Store) {
    this.socket = io('https://chewi-check.com', {
      transports: ['websocket', 'polling'], // Поддерживаемые транспорты
      path: '/socket.io/', // Путь для WebSocket
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      this.store.dispatch(new WebSocketConnected());
    });

    this.socket.on('disconnect', () => {
      this.store.dispatch(new WebSocketDisconnected());
    });

    this.socket.on('clientUpdated', (client: Client) => {
      this.store.dispatch(new WebSocketMessageReceived(client));
    });
  }

  // Отправка данных на сервер
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Отключение WebSocket
  disconnect(): void {
    this.socket.disconnect();
  }

  onClientUpdated(): Observable<Client> {
    return this.on('clientUpdated');
  }

  // Подписка на события от сервера
  on(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => {
        subscriber.next(data);
      });
    });
  }
}
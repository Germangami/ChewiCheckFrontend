import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Client } from '../Model/ClientModel/client-model';
import { Trainer } from '../Model/TrainerModel/trainer-model';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentClient: Client | null = null;
  currentTrainer: Trainer | null = null;
  userRole: string = '';

  constructor(private apiService: ApiService) { }

  checkUserRole(tgId: number) {
    if (!tgId) {
      console.error('No tgId provided to checkUserRole');
      return;
    }

    console.log('Checking role for tgId:', tgId);
    
    // Сначала проверяем, является ли пользователь тренером (меняем порядок проверки)
    this.apiService.getTrainerById(tgId)
      .pipe(
        tap((trainer: Trainer) => {
          console.log('Trainer API response:', trainer);
          if (trainer) {
            console.log('User identified as TRAINER with tgId:', tgId);
            this.currentTrainer = trainer;
            this.userRole = 'trainer';
          } else {
            console.log('User not found as trainer, checking if client...');
            this.checkIfClient(tgId);
          }
        }),
        catchError(error => {
          console.log('Error fetching trainer:', error);
          console.log('Checking if client...');
          this.checkIfClient(tgId);
          return of(null);
        })
      )
      .subscribe();
  }

  // Отдельный метод для проверки, является ли пользователь клиентом
  private checkIfClient(tgId: number) {
    this.apiService.getCurrentClient(tgId)
      .pipe(
        tap((client: Client) => {
          console.log('Client API response:', client);
          if (client) {
            console.log('User identified as CLIENT with tgId:', tgId);
            this.currentClient = client;
            this.userRole = 'client';
          } else {
            console.log('User not identified as either trainer or client');
            this.userRole = '';
          }
        }),
        catchError(error => {
          console.log('Error fetching client:', error);
          this.userRole = '';
          return of(null);
        })
      )
      .subscribe();
  }

  isTrainer(): boolean {
    return this.userRole === 'trainer';
  }

  isClient(): boolean {
    return this.userRole === 'client';
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Client } from '../Model/ClientModel/client-model';
import { Trainer } from '../Model/TrainerModel/trainer-model';
import { catchError, of, map, switchMap } from 'rxjs';
import { Observable } from 'rxjs';

export enum UserRole {
  TRAINER = 'trainer',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentTrainer: Trainer | null = null;
  private currentClient: Client | null = null;
  private userRole: UserRole = UserRole.UNKNOWN;

  constructor(private apiService: ApiService) { }

  checkUserRole(tgId: number): Observable<UserRole> {
    return this.apiService.getTrainerById(tgId).pipe(
      switchMap(trainer => {
        if (trainer) {
          this.currentTrainer = trainer;
          this.userRole = UserRole.TRAINER;
          return of(UserRole.TRAINER);
        }
        return this.apiService.getCurrentClient(tgId).pipe(
          map(client => {
            if (client) {
              this.currentClient = client;
              this.userRole = UserRole.CLIENT;
              return UserRole.CLIENT;
            }
            this.userRole = UserRole.UNKNOWN;
            return UserRole.UNKNOWN;
          })
        );
      }),
      catchError(error => {
        return this.apiService.getCurrentClient(tgId).pipe(
          map(client => {
            if (client) {
              this.currentClient = client;
              this.userRole = UserRole.CLIENT;
              return UserRole.CLIENT;
            }
            this.userRole = UserRole.UNKNOWN;
            return UserRole.UNKNOWN;
          }),
          catchError(() => {
            this.userRole = UserRole.UNKNOWN;
            return of(UserRole.UNKNOWN);
          })
        );
      })
    );
  }

  getCurrentTrainer(): Trainer | null {
    return this.currentTrainer;
  }

  getCurrentClient(): Client | null {
    return this.currentClient;
  }

  getUserRole(): UserRole {
    return this.userRole;
  }
}

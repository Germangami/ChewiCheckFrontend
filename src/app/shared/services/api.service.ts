import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../Model/ClientModel/client-model';
import { AvailableSlot, Trainer, WorkSchedule } from '../Model/TrainerModel/trainer-model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://chewi-check.com';
  private clientEndpoint = `${this.baseUrl}/client`;
  private trainerEndpoint = `${this.baseUrl}/trainer`;

  constructor(private http: HttpClient) { }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.clientEndpoint}/update`, client);
  }

  updateClientAboniment(_id: string, aboniment: number): Observable<Client> {
    const abonimentData = { _id, aboniment };
    return this.http.put<Client>(`${this.clientEndpoint}/updateClientAboniment`, abonimentData)
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.clientEndpoint}/getClients`);
  }

  getCurrentClient(tgId: number | string): Observable<Client> {
    return this.http.get<Client>(`${this.clientEndpoint}/getCurrentClient/${tgId}`);
  }

  updateGroupTraining(_id: string): Observable<Client> {
    return this.http.put<Client>(`${this.clientEndpoint}/updateGroupTraining`, { _id });
  }

  updateIndividualTraining(_id: string, sessionId: string, status: string): Observable<Client> {
    return this.http.put<Client>(
      `${this.clientEndpoint}/updateIndividualTraining`, 
      { _id, sessionId, status }
    );
  }

  scheduleIndividualTraining(_id: string, date: string, time: string): Observable<Client> {
    return this.http.post<Client>(
      `${this.clientEndpoint}/scheduleIndividualTraining`,
      { _id, date, time }
    );
  }

  getTrainerById(tgId: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.trainerEndpoint}/getTrainer/${tgId}`);
  }

  getAllTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.trainerEndpoint}/getTrainers`);
  }

  updateTrainerSchedule(trainerId: number, workSchedule: WorkSchedule): Observable<Trainer> {
    return this.http.put<Trainer>(`${this.trainerEndpoint}/schedule`, { trainerId, workSchedule });
  }

  getAvailableSlots(trainerId: number, date: string): Observable<AvailableSlot[]> {
    const url = `${this.trainerEndpoint}/slots/${trainerId}/${date}`;
    console.log('Requesting slots with URL:', url);
    return this.http.get<AvailableSlot[]>(url);
  }

  bookTimeSlot(
    trainerId: number, 
    client: { 
      tgId: number,
      first_name: string,
      nickname?: string
    }, 
    date: string, 
    time: string
  ): Observable<Trainer> {
    const requestData = {
      trainerId: Number(trainerId),
      client,
      date,
      startTime: time,
      duration: 60
    };

    return this.http.post<Trainer>(`${this.trainerEndpoint}/book`, requestData);
  }

  cancelBooking(trainerId: number, client: { tgId: number, first_name: string, nickname?: string}, date: string, time: string): Observable<Trainer> {
    return this.http.post<Trainer>(`${this.trainerEndpoint}/cancel`, {
      trainerId,
      client,
      date,
      time
    });
  }
}

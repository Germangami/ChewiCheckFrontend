import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../Model/ClientModel/client-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private chewiCheckBackEndServer = 'https://chewi-check.com/client';
  // private chewiCheckBackEndLocal = 'http://localhost:5000/client';

  constructor(private http: HttpClient) { }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.chewiCheckBackEndServer}/update`, client);
  }

  updateClientAboniment(_id: string, aboniment: number): Observable<Client> {
    const abonimentData = { _id, aboniment };
    return this.http.put<Client>(`${this.chewiCheckBackEndServer}/updateClientAboniment`, abonimentData)
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.chewiCheckBackEndServer}/getClients`);
  }

  getCurrentClient(tgId: number | string): Observable<Client> {
    return this.http.get<Client>(`${this.chewiCheckBackEndServer}/getCurrentClient/${tgId}`);
  }

  updateGroupTraining(_id: string): Observable<Client> {
    return this.http.put<Client>(`${this.chewiCheckBackEndServer}/updateGroupTraining`, { _id });
  }

  updateIndividualTraining(_id: string, sessionId: string, status: string): Observable<Client> {
    return this.http.put<Client>(
      `${this.chewiCheckBackEndServer}/updateIndividualTraining`, 
      { _id, sessionId, status }
    );
  }

  scheduleIndividualTraining(_id: string, date: string, time: string): Observable<Client> {
    return this.http.post<Client>(
      `${this.chewiCheckBackEndServer}/scheduleIndividualTraining`,
      { _id, date, time }
    );
  }
}

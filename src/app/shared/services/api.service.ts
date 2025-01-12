import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../Model/ClientModel/client-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private chewiCheckBackEndLocal = 'http://localhost:5000/client';

  constructor(private http: HttpClient) { }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.chewiCheckBackEndLocal}/update`, client);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.chewiCheckBackEndLocal}/getClients`);
  }

  getCurrentClient(tgId: string): Observable<Client> {
    return this.http.get<Client>(`${this.chewiCheckBackEndLocal}/getCurrentClient/${tgId}`);
  }
}

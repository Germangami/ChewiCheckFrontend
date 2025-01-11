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

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.chewiCheckBackEndLocal}/getClients`);
  }
}

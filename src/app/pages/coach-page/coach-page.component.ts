import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Client } from '../../shared/Model/ClientModel/client-model';

@Component({
  selector: 'app-coach-page',
  standalone: true,
  imports: [],
  templateUrl: './coach-page.component.html',
  styleUrl: './coach-page.component.scss'
})
export class CoachPageComponent {

  constructor(private apiService: ApiService) {

  }

  clients: Client[] = [];

  ngOnInit(): void {
    this.apiService.getClients().subscribe(response => {
      console.log(response, 'CHECK CLIENTS!');
      this.clients = response;
    })
  }
}

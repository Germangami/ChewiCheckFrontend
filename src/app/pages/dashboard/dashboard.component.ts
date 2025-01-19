import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Client } from '../../shared/Model/ClientModel/client-model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  tgId: number;
  currentClient: Client;

  constructor(private router: Router, private apiService: ApiService) {

  }

  ngOnInit(): void {
    if (window.Telegram.WebApp) {
      console.log(window.Telegram.WebApp.MainButton, 'CHECK TELEGRAM DASHBOARD!')
      this.tgId = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
    }
    this.getCurrentClient();
  }

  goToClientPage() {
    if(this.tgId) {
      const tgId = this.tgId;
      this.router.navigate(['/client', tgId]);
    }
  }

  getCurrentClient() {
    if (this.tgId) {
      this.apiService.getCurrentClient(this.tgId).subscribe(x => console.log(x, 'CURRENT USER DASHBOAD'))
    }
  }
 
}

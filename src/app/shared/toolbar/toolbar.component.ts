import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Client } from '../Model/ClientModel/client-model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  @Input()
  tgId: number;

  currentClient: Client;
  currentClientTgId: number;

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    console.log(this.tgId, 'CHECK TG ID')
    this.apiService.getCurrentClient(this.tgId).subscribe(client => {
      this.currentClient = client;
      this.currentClientTgId = client.tgId;
    })
  }
}

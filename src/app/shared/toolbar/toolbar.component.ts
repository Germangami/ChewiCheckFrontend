import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Client } from '../Model/ClientModel/client-model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {

  @Input()
  config?: any;

  @Input()
  tgId: number;

  @Input()
  currentClientTgId: number;

  currentClient: Client;
  isCoach: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {
    // Подписываемся на события навигации
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkUserRole();
    });
  }

  ngOnInit() {
    this.checkUserRole();
    if(this.tgId) {
      this.apiService.getCurrentClient(this.tgId).subscribe(client => {
        this.currentClient = client;
        this.currentClientTgId = client.tgId;
      })
    }
  }
  
  // Определяем роль пользователя на основе маршрута
  private checkUserRole() {
    const currentUrl = this.router.url;
    this.isCoach = currentUrl.includes('/coach') || currentUrl === '/';
    
    // Если мы на странице клиента и не передан tgId, используем из URL
    if (!this.currentClientTgId && currentUrl.includes('/client/')) {
      const urlParts = currentUrl.split('/');
      this.currentClientTgId = parseInt(urlParts[urlParts.length - 1], 10);
    }
  }
}

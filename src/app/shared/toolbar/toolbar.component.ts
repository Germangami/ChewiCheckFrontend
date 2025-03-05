import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, interval, Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Client } from '../Model/ClientModel/client-model';
import { AuthService } from '../services/auth.service';

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
export class ToolbarComponent implements OnInit, OnDestroy {

  @Input()
  tgId: number;

  role: string = 'Загрузка...';
  private checkRoleInterval: Subscription;

  constructor(private router: Router, 
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService) {
  }

  ngOnInit() {
    console.log('ToolbarComponent initialized with tgId:', this.tgId);
    
    // Проверяем роль раз в секунду пока не получим результат
    this.checkRoleInterval = interval(1000).subscribe(() => {
      console.log('Checking role, current userRole:', this.authService.userRole);
      // Если роль уже определена
      if (this.authService.userRole) {
        this.updateRole();
        // Прекращаем интервал после получения роли
        if (this.checkRoleInterval) {
          this.checkRoleInterval.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy() {
    // Очищаем подписку при уничтожении компонента
    if (this.checkRoleInterval) {
      this.checkRoleInterval.unsubscribe();
    }
  }

  private updateRole() {
    console.log('Updating role based on:', this.authService.userRole);
    this.role = this.authService.isTrainer() ? 'Тренер' : 'Клиент';
    console.log('Role set to:', this.role);
    this.cdr.detectChanges();
  }
}

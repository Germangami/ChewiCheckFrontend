import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService, UserRole } from '../services/auth.service';
import { Store } from '@ngxs/store';
import { Trainer } from '../Model/TrainerModel/trainer-model';
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
  @Input() tgId: number | null = null;
  isTrainer: boolean = false;
  trainer: Trainer | null = null;
  client: Client | null = null;
  userRole: UserRole = UserRole.UNKNOWN;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    if (this.tgId) {
      this.authService.checkUserRole(this.tgId).subscribe(role => {
        this.userRole = role;
        if (role === UserRole.TRAINER) {
          this.isTrainer = true;
          this.trainer = this.authService.getCurrentTrainer();
        } else if (role === UserRole.CLIENT) {
          this.client = this.authService.getCurrentClient();
        }
        this.cdr.markForCheck();
      });
    }
  }
}

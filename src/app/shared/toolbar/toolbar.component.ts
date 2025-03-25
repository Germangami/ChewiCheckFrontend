import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CheckUserRole } from '../../state/auth/auth.actions';
import { AuthSelectors, AuthStateView } from '../../state/auth/auth.selectors';
import { UserRole } from '../../state/auth/auth.model';
import { Client } from '../Model/ClientModel/client-model';
import { Trainer } from '../Model/TrainerModel/trainer-model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatProgressBarModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  @Input() tgId: number | null = null;
  
  authState$: Observable<AuthStateView>;
  readonly UserRole = UserRole; // для использования в шаблоне

  constructor(
    private router: Router,
    private store: Store
  ) {
    this.authState$ = this.store.select(AuthSelectors.getAuthState);
  }

  ngOnInit() {
    if (this.tgId) {
      this.store.dispatch(new CheckUserRole(this.tgId));
    }
  }
}

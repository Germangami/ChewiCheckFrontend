import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Client } from '../../../shared/Model/ClientModel/client-model';

@Component({
  selector: 'app-coach-stats',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './coach-stats.component.html',
  styleUrl: './coach-stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachStatsComponent {

  @Input()
  clientsLength: number;

  @Input()
  set clients(clients: Client[]) {
    clients.forEach(client => {
      this.abonimentSum = this.abonimentSum + client.aboniment 
    })
  };

  abonimentSum: number = 0;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientInfoComponent } from '../client-info/client-info.component';

@Component({
  selector: 'app-group-clients',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ClientInfoComponent
  ],
  templateUrl: './group-clients.component.html',
  styleUrl: './group-clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupClientsComponent {
  @Input() clients: Client[];

  isExpiringSoon(client: Client): boolean {
    if (!client.groupTraining.endDate) return false;
    
    const currentDate = new Date();
    const endDate = new Date(client.groupTraining.endDate);
    const daysUntilExpiration = Math.floor((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
  }
  
}

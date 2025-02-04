import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientInfoComponent } from '../client-info/client-info.component';

@Component({
  selector: 'app-individual-clients',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ClientInfoComponent
  ],
  templateUrl: './individual-clients.component.html',
  styleUrl: './individual-clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndividualClientsComponent {

  @Input() clients: Client[];
}

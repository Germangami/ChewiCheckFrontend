import { ChangeDetectionStrategy, Component, Input, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Trainer } from '../../../shared/Model/TrainerModel/trainer-model';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-schedule-settings',
  templateUrl: './schedule-settings.component.html',
  styleUrl: './schedule-settings.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSettingsComponent {
  @Input() currentTrainer: Trainer | null = null;

  selected = model<Date | null>(null);
  
  constructor() {

  }

  ngOnInit() {
  }

  formatDate(date: Date): string {
    return moment(date).format('DD MMMM YYYY');
  }

  getDaySchedule() {
    if (!this.selected() || !this.currentTrainer?.bookedSlots) return [];
    
    const selectedDate = moment(this.selected()).format('DD.MM.YYYY');
    return this.currentTrainer.bookedSlots
      .filter(slot => slot.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getClientsWithSessions() {
    if (!this.currentTrainer?.bookedSlots) return [];
    
    // Получаем уникальных клиентов
    const uniqueClients = new Map();
    this.currentTrainer.bookedSlots.forEach(slot => {
      uniqueClients.set(slot.client.tgId, slot.client);
    });
    
    return Array.from(uniqueClients.values());
  }

  getClientSessions(client: any) {
    return this.currentTrainer?.bookedSlots
      .filter(slot => slot.client.tgId === client.tgId)
      .sort((a, b) => moment(a.date, 'DD.MM.YYYY').diff(moment(b.date, 'DD.MM.YYYY')));
  }

  getClientSessionsCount(client: any) {
    return this.currentTrainer?.bookedSlots
      .filter(slot => slot.client.tgId === client.tgId).length;
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'completed': return 'check_circle';
      case 'planned': return 'schedule';
      case 'missed': return 'cancel';
      default: return 'help';
    }
  }
} 
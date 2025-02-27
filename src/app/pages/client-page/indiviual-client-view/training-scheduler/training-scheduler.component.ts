import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ApiService } from '../../../../shared/services/api.service';
import { Store } from '@ngxs/store';
import { BookTimeSlot, GetAvailableSlots } from '../../../../state/trainer/trainer.actions';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';
import { TrainerSelectors } from '../../../../state/trainer/trainer.selectors';
import { Client } from '../../../../shared/Model/ClientModel/client-model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-training-scheduler',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    MatCardModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './training-scheduler.component.html',
  styleUrls: ['./training-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingSchedulerComponent {
  selected = model<Date | null>(null);
  availableSlots$: any;
  freeSlots: any[] = [];
  selectedTime: string = '';
  @Input() currentClient: Client;

  constructor(
    private cdr: ChangeDetectorRef, 
    private store: Store, 
    private apiService: ApiService
  ) {
    // Подписываемся на изменение даты
    this.selected.subscribe(date => {
      if (date) {
        console.log(date, '2222222');
        // Форматируем дату в нужный формат DD.MM.YYYY
        const formattedDate = moment(date).format('DD.MM.YYYY');
        console.log(formattedDate, '3333333');
        // Запрашиваем доступные слоты
        this.store.dispatch(new GetAvailableSlots(469408413, formattedDate));
      }
    });
  }

  ngOnInit() {
    this.availableSlots$ = this.store.select(TrainerSelectors.getAvailableSlots);
    this.availableSlots$.subscribe(slots => {
      console.log(slots, '1111111');
      this.freeSlots = slots;
    });
  }

  getFormattedDate(): string {
    if (!this.selected()) return '';
    return moment(this.selected()).format('DD.MM.YYYY');
  }

  getTrainerSchedule(date: Date) {
    // Здесь будет логика получения расписания тренера на выбранную дату
    console.log('Getting schedule for:', moment(date).format('DD.MM.YYYY'));
  }

  onTimeSelect(time: string) {
    this.selectedTime = time;
    this.cdr.markForCheck();
  }

  bookSlot() {
    if (!this.selected() || !this.selectedTime) return;
    
    const date = moment(this.selected()).format('DD.MM.YYYY');

    const currentClient = {
      tgId: 469408413,
      first_name: 'Hero',
      nickname: 'NickName-Hero'
    }

    // Бронируем у тренера
    this.store.dispatch(new BookTimeSlot(
        469408413,
        currentClient,
        date,
        this.selectedTime
    ));

    // Сохраняем у клиента
    // if (this.currentClient?._id) {
        this.apiService.scheduleIndividualTraining(
            // this.currentClient._id,
            '67a4ebdbe3b120a46831ce3c',
            date,
            this.selectedTime
        ).subscribe(updatedClient => {
            console.log('Training scheduled for client:', updatedClient);
        });
    // }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'completed': return 'check_circle';
      case 'planned': return 'schedule';
      case 'missed': return 'cancel';
      default: return 'help';
    }
  }

  getSelectedDaySessions() {
    if (!this.selected() || !this.currentClient?.individualTraining?.scheduledSessions) return [];
    
    const selectedDate = moment(this.selected()).format('DD.MM.YYYY');
    return this.currentClient.individualTraining.scheduledSessions
      .filter(session => session.date === selectedDate)
      .sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
  }
}
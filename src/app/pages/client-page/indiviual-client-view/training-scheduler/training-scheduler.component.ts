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
        
        // Принудительно вызываем обновление представления
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit() {
    this.availableSlots$ = this.store.select(TrainerSelectors.getAvailableSlots);
    this.availableSlots$.subscribe(slots => {
      console.log(slots, '1111111');
      this.freeSlots = slots;
      this.cdr.markForCheck();
    });
    
    // Debug log to check if currentClient is received
    console.log('Initial currentClient:', this.currentClient);
  }

  ngOnChanges() {
    // Проверяем изменения входных параметров
    console.log('ngOnChanges - currentClient:', this.currentClient);
    this.cdr.markForCheck();
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
    if (!this.selected() || !this.selectedTime || !this.currentClient) {
      console.log('Cannot book slot: missing data', {
        selected: !!this.selected(),
        selectedTime: this.selectedTime,
        currentClient: !!this.currentClient
      });
      return;
    }
    
    const date = moment(this.selected()).format('DD.MM.YYYY');
    
    // Используем данные текущего клиента вместо мокованных
    const clientData = {
      tgId: this.currentClient.tgId,
      first_name: this.currentClient.first_name,
      nickname: this.currentClient.nickname || ''
    };

    console.log('Booking slot for client:', clientData);

    // Бронируем у тренера
    this.store.dispatch(new BookTimeSlot(
        469408413, // TODO: заменить на динамическое получение ID тренера
        clientData,
        date,
        this.selectedTime
    ));

    // Сохраняем у клиента
    if (this.currentClient._id) {
        this.apiService.scheduleIndividualTraining(
            this.currentClient._id,
            date,
            this.selectedTime
        ).subscribe(updatedClient => {
            console.log('Training scheduled for client:', updatedClient);
            
            // Обновляем данные клиента после успешного бронирования
            if (updatedClient) {
                this.currentClient = updatedClient;
                this.selectedTime = '';
                this.cdr.markForCheck();
            }
        });
    } else {
        console.error('Cannot schedule training: client ID is missing');
    }
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
    if (!this.selected() || !this.currentClient?.individualTraining?.scheduledSessions) {
      console.log('No data available:', {
        selected: this.selected(),
        currentClient: !!this.currentClient,
        hasIndividualTraining: !!this.currentClient?.individualTraining,
        hasScheduledSessions: !!this.currentClient?.individualTraining?.scheduledSessions
      });
      return [];
    }
    
    const selectedDate = moment(this.selected()).format('DD.MM.YYYY');
    console.log('Looking for sessions on:', selectedDate);
    console.log('Available sessions:', this.currentClient.individualTraining.scheduledSessions);
    
    const sessions = this.currentClient.individualTraining.scheduledSessions
      .filter(session => session.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
    
    console.log('Found sessions:', sessions);
    this.cdr.markForCheck();
    return sessions;
  }
}
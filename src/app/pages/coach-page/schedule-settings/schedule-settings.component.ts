import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Trainer, WeekDay, WorkSchedule, BookedSlot, BookingStatus } from '../../../shared/Model/TrainerModel/trainer-model';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { TrainerSelectors } from '../../../state/trainer/trainer.selectors';
import { GetTrainer, UpdateTrainerSchedule } from '../../../state/trainer/trainer.actions';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-schedule-settings',
  templateUrl: './schedule-settings.component.html',
  styleUrl: './schedule-settings.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [
    CommonModule,
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
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSettingsComponent implements OnInit {
  @Input() currentTrainer: Trainer | null = null;
  selected = model<Date | null>(null);
  
  weekDays = Object.values(WeekDay);
  workHoursForm: FormGroup;
  breakForm: FormGroup;
  breaks: any[] = [];
  BookingStatus = BookingStatus;

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.workHoursForm = this.fb.group({
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      startTime: ['09:00', Validators.required],
      endTime: ['18:00', Validators.required]
    });

    this.breakForm = this.fb.group({
      weekDay: ['', Validators.required],
      time: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(240)]],
      description: ['']
    });
  }

  ngOnInit() {
    // Load initial trainer data
    this.store.dispatch(new GetTrainer(469408413)); // TODO: replace with dynamic trainer ID

    // Subscribe to trainer updates from store
    this.store.select(TrainerSelectors.getTrainer).subscribe(trainer => {
      console.log('Trainer data updated:', trainer);
      if (trainer) {
        this.currentTrainer = trainer;
        this.loadTrainerSchedule();
        this.cdr.markForCheck();
      }
    });
  }

  private loadTrainerSchedule() {
    if (!this.currentTrainer?.workSchedule) return;

    const schedule = this.currentTrainer.workSchedule;
    
    // Загружаем рабочие дни
    this.weekDays.forEach(day => {
      const control = this.workHoursForm.get(day.toLowerCase());
      if (control) {
        control.setValue(schedule.workDays.includes(day));
      }
    });

    // Загружаем рабочие часы
    if (schedule.workHours) {
      this.workHoursForm.patchValue({
        startTime: schedule.workHours.start,
        endTime: schedule.workHours.end
      });
    }

    // Загружаем перерывы
    if (schedule.breaks) {
      this.breaks = [...schedule.breaks];
    }
  }

  addBreak() {
    if (this.breakForm.valid) {
      const newBreak = this.breakForm.value;
      this.breaks.push(newBreak);
      this.breakForm.reset({
        duration: 60
      });
      this.updateSchedule();
    }
  }

  removeBreak(breakToRemove: any) {
    this.breaks = this.breaks.filter(b => 
      b.weekDay !== breakToRemove.weekDay || 
      b.time !== breakToRemove.time
    );
    this.updateSchedule();
  }

  private updateSchedule() {
    if (!this.currentTrainer) return;

    const workDays = this.weekDays.filter(day => 
      this.workHoursForm.get(day.toLowerCase())?.value
    );

    const workSchedule: WorkSchedule = {
      workDays,
      workHours: {
        start: this.workHoursForm.get('startTime')?.value,
        end: this.workHoursForm.get('endTime')?.value
      },
      breaks: this.breaks
    };

    this.store.dispatch(new UpdateTrainerSchedule(
      this.currentTrainer.tgId,
      workSchedule
    ));
  }

  formatDate(date: Date): string {
    return moment(date).format('DD.MM.YYYY');
  }

  getDaySchedule() {
    if (!this.selected() || !this.currentTrainer?.bookedSlots) {
      console.log('No data available:', {
        selected: this.selected(),
        trainer: this.currentTrainer,
        bookedSlots: this.currentTrainer?.bookedSlots
      });
      return [];
    }
    
    const selectedDate = moment(this.selected()).format('DD.MM.YYYY');
    
    const sessions = this.currentTrainer.bookedSlots
      .filter(slot => slot.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
    
    return sessions;
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

  getStatusIcon(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.COMPLETED:
        return 'check_circle';
      case BookingStatus.MISSED:
        return 'cancel';
      case BookingStatus.PLANNED:
        return 'schedule';
      default:
        return 'help';
    }
  }

  markSessionStatus(session: BookedSlot, newStatus: BookingStatus) {
    if (!this.currentTrainer?._id) return;

    this.apiService.updateSessionStatus(
      this.currentTrainer._id,
      session.client.tgId,
      session.date,
      session.time,
      newStatus
    ).subscribe({
      next: (updatedTrainer) => {
        if (updatedTrainer) {
          this.currentTrainer = updatedTrainer;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error updating session status:', error);
      }
    });
  }

  saveWorkSchedule() {
    if (this.workHoursForm.valid) {
      console.log('Saving work schedule:', this.workHoursForm.value);
      this.updateSchedule();
    }
  }
} 
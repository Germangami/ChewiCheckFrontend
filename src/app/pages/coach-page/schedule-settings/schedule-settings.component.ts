import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Trainer, BookedSlot, BookingStatus } from '../../../shared/Model/TrainerModel/trainer-model';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { TrainerSelectors } from '../../../state/trainer/trainer.selectors';
import { CancelBooking, UpdateBookingStatus } from '../../../state/trainer/trainer.actions';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../shared/services/api.service';
import { WorkScheduleComponent } from './work-schedule/work-schedule.component';

@Component({
  selector: 'app-schedule-settings',
  templateUrl: './schedule-settings.component.html',
  styleUrl: './schedule-settings.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    WorkScheduleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSettingsComponent implements OnInit {
  @Input() currentTrainer: Trainer | null = null;
  selected = model<Date | null>(null);
  BookingStatus = BookingStatus;

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.store.select(TrainerSelectors.getTrainer).subscribe(trainer => {
      if (trainer) {
        this.currentTrainer = trainer;
        this.cdr.markForCheck();
      }
    });
  }

  formatDate(date: Date): string {
    return moment(date).format('DD.MM.YYYY');
  }

  getDaySchedule() {
    if (!this.selected() || !this.currentTrainer?.bookedSlots) {
      return [];
    }
    
    const selectedDate = moment(this.selected()).format('DD.MM.YYYY');
    return this.currentTrainer.bookedSlots
      .filter(slot => slot.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'check';
      case BookingStatus.PENDING:
        return 'schedule';
      case BookingStatus.COMPLETED:
        return 'done_all';
      case BookingStatus.MISSED:
        return 'person_off';
      default:
        return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case BookingStatus.APPROVED:
        return '#4CAF50';  // Material Green
      case BookingStatus.PENDING:
        return '#ff9800';  // Material Orange
      case BookingStatus.COMPLETED:
        return '#2196F3';  // Material Blue
      case BookingStatus.MISSED:
        return '#9C27B0';  // Material Purple
      default:
        return '#9e9e9e';  // Material Grey
    }
  }

  approveBooking(booking: any) {
    if (!this.currentTrainer?.tgId) return;

    this.store.dispatch(new UpdateBookingStatus(
      this.currentTrainer.tgId,
      booking.client.tgId,
      booking.date,
      booking.startTime,
      BookingStatus.APPROVED
    ));
  }

  cancelBooking(booking: any) {
    if (!this.currentTrainer?.tgId) return;

    this.store.dispatch(new CancelBooking(
      this.currentTrainer.tgId,
      booking.client,
      booking.date,
      booking.startTime
    ));
  }

  markSessionCompleted(booking: any) {
    if (!this.currentTrainer?.tgId) return;

    this.store.dispatch(new UpdateBookingStatus(
      this.currentTrainer.tgId,
      booking.client.tgId,
      booking.date,
      booking.startTime,
      BookingStatus.COMPLETED
    ));
  }

  markSessionMissed(booking: any) {
    if (!this.currentTrainer?.tgId) return;

    this.store.dispatch(new UpdateBookingStatus(
      this.currentTrainer.tgId,
      booking.client.tgId,
      booking.date,
      booking.startTime,
      BookingStatus.MISSED
    ));
  }
} 
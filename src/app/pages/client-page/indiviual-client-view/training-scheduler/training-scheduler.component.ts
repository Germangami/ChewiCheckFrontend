import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, model, OnInit } from '@angular/core';
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
import { BookTimeSlot, GetAvailableSlots, GetTrainer } from '../../../../state/trainer/trainer.actions';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';
import { TrainerSelectors } from '../../../../state/trainer/trainer.selectors';
import { Client } from '../../../../shared/Model/ClientModel/client-model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Trainer } from '../../../../shared/Model/TrainerModel/trainer-model';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatIconModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './training-scheduler.component.html',
  styleUrls: ['./training-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingSchedulerComponent implements OnInit {
  selected = model<Date | null>(null);
  availableSlots$: any;
  freeSlots: any[] = [];
  selectedTime: string = '';
  @Input() currentClient: Client | null = null;
  
  isLoading = false;
  trainer: Trainer | null = null;

  constructor(
    private cdr: ChangeDetectorRef, 
    private store: Store, 
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.selected.subscribe(date => {
      if (date) {
        const formattedDate = moment(date).format('DD.MM.YYYY');
        this.store.dispatch(new GetAvailableSlots(469408413, formattedDate));        
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    if (!this.currentClient) {
      this.loadClientData();
    }
  }

  private loadClientData(): void {
    this.isLoading = true;
    
    this.route.paramMap.subscribe(params => {
      const clientId = params.get('id');
      if (clientId) {
        console.log('Loading client data for ID:', clientId);
        
        this.apiService.getCurrentClient(clientId).subscribe({
          next: (client) => {
            console.log('Client data loaded:', client);
            this.currentClient = client;
            
            if (client && client.trainerId) {
              this.loadTrainerData(client.trainerId);
            }
            
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Failed to load client data:', error);
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  private loadTrainerData(trainerId: number): void {
    this.store.dispatch(new GetTrainer(trainerId));
    
    // Subscribe to trainer data to get available slots
    this.store.select(TrainerSelectors.getAvailableSlots).subscribe(slots => {
      if (slots) {
        this.freeSlots = slots;
        this.cdr.markForCheck();
      }
    });
  }

  getFormattedDate(): string {
    if (!this.selected()) return '';
    return moment(this.selected()).format('DD.MM.YYYY');
  }

  getTrainerSchedule(date: Date) {
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
    
    const clientData = {
      tgId: this.currentClient.tgId,
      first_name: this.currentClient.first_name,
      nickname: this.currentClient.nickname || ''
    };

    console.log('Booking slot for client:', clientData);

    // Book with trainer
    this.store.dispatch(new BookTimeSlot(
        469408413, // TODO: replace with dynamic trainer ID
        clientData,
        date,
        this.selectedTime
    ));

    // Save to client
    if (this.currentClient._id) {
        this.apiService.scheduleIndividualTraining(
            this.currentClient._id,
            date,
            this.selectedTime
        ).subscribe(updatedClient => {
            console.log('Training scheduled for client:', updatedClient);
            
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
      return [];
    }
    
    const selectedDate = moment(this.selected()).format('DD.MM.YYYY');
    const sessions = this.currentClient.individualTraining.scheduledSessions
      .filter(session => session.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
    
    console.log('Selected date sessions:', sessions);
    return sessions;
  }

  markSessionStatus(session: any, status: 'completed' | 'missed') {
    if (!this.currentClient?._id) {
      console.error('Cannot update session: client ID is missing');
      return;
    }

    this.apiService.updateIndividualTraining(
      this.currentClient._id,
      session._id,
      status
    ).subscribe({
      next: (updatedClient) => {
        console.log('Training session updated:', updatedClient);
        if (updatedClient) {
          this.currentClient = updatedClient;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error updating training session:', error);
      }
    });
  }
}
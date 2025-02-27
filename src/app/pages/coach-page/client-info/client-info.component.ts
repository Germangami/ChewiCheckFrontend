import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChangeClientData, SelectClientAboniment } from '../../../state/client/client.actions';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../shared/services/web-socket.service';
import moment from 'moment';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.scss',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientInfoComponent implements OnInit {

  @Input()
  set getClient(client: Client) {
    if (client) {
      this.initFormGroup(client);
      this.client = client;
      this.cdr.detectChanges();
    }
  }

  aboniments: {value: number, label: string}[] = [
    {value: 200, label: 'basic 200 zł'},
    {value: 300, label: 'premium 300 zł'},
  ];

  isClientDataEdit: boolean = false;
  client: Client;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private store: Store) {

  }

  ngOnInit(): void {

  }

  initFormGroup(client: Client) {
    this.formGroup = this.fb.group({
      _id: [client._id],
      tgId: [client.tgId],
      note: [client.note],
      nickname: [client?.nickname],
      // Условные поля для группового клиента
      aboniment: [client.groupTraining?.aboniment],
      startDate: [client.groupTraining?.startDate],
      endDate: [client.groupTraining?.endDate],
      totalTrainings: [client.groupTraining?.totalTrainings],
      remainingTrainings: [client.groupTraining?.remainingTrainings],
      // Условные поля для индивидуального клиента
      pricePerSession: [client.individualTraining?.pricePerSession],
      preferredDays: [client.individualTraining?.preferredDays],
      preferredTime: [client.individualTraining?.preferredTime],
    });
  }

  selectAboniment(aboniment: number) {
    this.store.dispatch(new SelectClientAboniment(aboniment, this.client._id));
  }

  editClientData() {
    this.isClientDataEdit = !this.isClientDataEdit;
  }

  saveClientData() {
    if (this.formGroup.valid) {
      const updatedClient = this.formGroup.value;
      this.isClientDataEdit = false;
      this.store.dispatch(new ChangeClientData(updatedClient));
    }
  }

  getNextTraining() {
    if (!this.client?.individualTraining?.scheduledSessions) return null;
    
    return this.client.individualTraining.scheduledSessions
      .filter(session => session.status === 'planned')
      .sort((a, b) => {
        const dateA = moment(`${a.date} ${a.time}`, 'DD.MM.YYYY HH:mm');
        const dateB = moment(`${b.date} ${b.time}`, 'DD.MM.YYYY HH:mm');
        return dateA.diff(dateB);
      })[0];
  }

  getPlannedCount() {
    return this.client?.individualTraining?.scheduledSessions
      .filter(session => session.status === 'planned').length || 0;
  }

  getCompletedCount() {
    return this.client?.individualTraining?.scheduledSessions
      .filter(session => session.status === 'completed').length || 0;
  }

}

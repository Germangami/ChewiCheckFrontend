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

  formGroup: FormGroup;
  isClientDataEdit = false;
  client: Client;
  aboniments: {label: string, value: number}[] = [
    {label: 'basic - 200zł', value: 200},
    {label: 'premium - 300zł', value: 300},
  ];

  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private cdr: ChangeDetectorRef,
    private webSocketService: WebSocketService
  ) {
    
  }


  ngOnInit(): void {
    
  }

  initFormGroup(client: Client) {
    this.formGroup = this.fb.group({
      _id: [client._id],
      tgId: [client.tgId ? client.tgId : null],
      note: [client.note ? client.note : null],
      aboniment: [client.groupTraining.aboniment ? client.groupTraining.aboniment : null],
      nickname: [client.nickname ? client.nickname : null],
      startDate: [client.groupTraining.startDate ? client.groupTraining.startDate : null],
      endDate: [client.groupTraining.endDate ? client.groupTraining.endDate : null],
      totalTrainings: [client.groupTraining.totalTrainings ? client.groupTraining.totalTrainings : null],
      remainingTrainings: [client.groupTraining.remainingTrainings ? client.groupTraining.remainingTrainings: null]
    });
  }

  selectAboniment(event: MatSelectChange) {
    this.store.dispatch(new SelectClientAboniment(event.value, this.formGroup.get('_id').value))
      .subscribe(() => {
        this.webSocketService.emit('clientUpdated', this.client);
      });
    this.cdr.detectChanges();
  }

  editClientData() {
    this.isClientDataEdit = !this.isClientDataEdit;
  }

  saveClientData() {
    if (this.formGroup.valid) {
      const updatedClient = this.formGroup.value;
      this.store.dispatch(new ChangeClientData(updatedClient));
      this.isClientDataEdit = false;
      this.cdr.detectChanges();
    }
  }

}

import { Component, Input } from '@angular/core';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TrainingSchedulerComponent } from './training-scheduler/training-scheduler.component';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-indiviual-client-view',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    ReactiveFormsModule, 
    MatCardModule,
    TrainingSchedulerComponent,
    MatTabsModule
  ],
  templateUrl: './indiviual-client-view.component.html',
  styleUrl: './indiviual-client-view.component.scss'
})
export class IndiviualClientViewComponent {

  @Input()
  set getCurrentClient(currentCLient: Client) {
    if (currentCLient) {
      this.initFormGroup(currentCLient);
      this.currentCLient = currentCLient;
    }
  }

  currentCLient: Client;
  formGroup: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      note: ['']
    });
  }

  initFormGroup(currentCLient: Client) {
    this.formGroup = this.fb.group({
      _id: [currentCLient._id ? currentCLient._id : null],
      tgId: [currentCLient.tgId ? currentCLient.tgId : null],
      first_name: [currentCLient.first_name ? currentCLient.first_name : null],
      last_name: [currentCLient.last_name ? currentCLient.last_name : null],
      username: [currentCLient.username ? currentCLient.username : null],
      nickname: [currentCLient.nickname ? currentCLient.nickname : null],
      note: [currentCLient.note ? currentCLient.note : null]
    });
  }
}

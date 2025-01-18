import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { MarkClientTrainingAsCompleted } from '../../../state/client/client.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-client-tranings',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatCardModule, 
    ReactiveFormsModule, 
    MatDividerModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './current-client-tranings.component.html',
  styleUrl: './current-client-tranings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentClientTraningsComponent {

  @Input()
  set getCurrentClient(currentCLient: Client) {
    if (currentCLient) {
      this.currentCLient = currentCLient;
      this.checkIfTrainingDay();
      this.cdr.detectChanges();
    }
  }

  currentCLient: Client;
  isTrainingDay: boolean = false;
  isChecked: boolean = false;
  formGroup: FormGroup;

  constructor(private cdr: ChangeDetectorRef, private store: Store) {
    
  }

  checkIfTrainingDay() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    this.isTrainingDay = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  }

  markTrainingAsCompleted() {
    this.store.dispatch(new MarkClientTrainingAsCompleted(this.currentCLient._id));
    this.isChecked = true;
    this.cdr.detectChanges();
  }
}

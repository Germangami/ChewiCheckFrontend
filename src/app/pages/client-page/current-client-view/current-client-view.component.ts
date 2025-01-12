import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-current-client-view',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './current-client-view.component.html',
  styleUrl: './current-client-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentClientViewComponent {

  @Input()
  set getCurrentClient(currentCLient: Client) {
    if (currentCLient) {
      this.initFormGroup(currentCLient);
    }
  }

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    
  }

  initFormGroup(currentCLient: Client) {
    this.formGroup = this.fb.group({
      _id: [currentCLient._id ? currentCLient._id : null],
      tgId: [currentCLient.tgId ? currentCLient.tgId : null],
      first_name: [currentCLient.first_name ? currentCLient.first_name : null],
      last_name: [currentCLient.last_name ? currentCLient.last_name : null],
      username: [currentCLient.username ? currentCLient.username : null],
      nickname: [currentCLient.nickname ? currentCLient.nickname : null]
    });
  }

}

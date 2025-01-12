import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Store } from '@ngxs/store';
import { ChangeClientData } from '../../../state/client/client.actions';
import { Observable } from 'rxjs';
import { ClientSelectors } from '../../../state/client/client.selectors';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ]
})
export class ClientInfoComponent implements OnInit {

  @Input()
  set getClient(client: Client) {
    if (client) {
      this.initFormGroup(client);
    }
  }

  formGroup: FormGroup;
  isClientDataEdit = false;

  constructor(private fb: FormBuilder, private store: Store, private cdr: ChangeDetectorRef) {
    
  }


  ngOnInit(): void {
    
  }

  initFormGroup(client: Client) {
    this.formGroup = this.fb.group({
      _id: [client._id],
      tgId: [client.tgId ? client.tgId : null],
      first_name: [client.first_name ? client.first_name : null],
      last_name: [client.last_name ? client.last_name : null],
      username: [client.username ? client.username : null ],
      nickname: [client.nickname ? client.nickname : null]
    });
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

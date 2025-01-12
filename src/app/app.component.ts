import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetAllClients } from './state/client/client.actions';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ChewiCheck';

  constructor(private store: Store) {

  }

  ngOnInit(): void {
    // this.store.dispatch(new GetAllClients).subscribe()
  }
}

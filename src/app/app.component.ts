import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetAllClients } from './state/client/client.actions';
import { ToolbarComponent } from "./shared/toolbar/toolbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToolbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ChewiCheck';
  tg: any;
  tgId: number;

  constructor(private store: Store) {

  }

  ngOnInit(): void {
    this.initTelegramWebApp();
  }

  initTelegramWebApp() {
    if (window.Telegram.WebApp) {
      console.log(window.Telegram.WebApp, 'CHECK TELEGRAM')
      this.tg = window.Telegram.WebApp;
      this.tgId = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      window.Telegram.WebApp.ready();
    } else {
      return;
    }
  }
}

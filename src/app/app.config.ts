import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngxs/store';
import { ClientState } from './state/client/client.state';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TrainerState } from './state/trainer/trainer.state';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY', // Формат для ввода даты
  },
  display: {
    dateInput: 'DD.MM.YYYY', // Формат для отображения даты
    monthYearLabel: 'MMM YYYY', // Формат для отображения месяца и года
    dateA11yLabel: 'LL', // Доступный формат даты
    monthYearA11yLabel: 'MMMM YYYY', // Доступный формат месяца и года
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideAnimationsAsync(), provideStore(
      [
        ClientState,
        TrainerState
      ],
      withNgxsReduxDevtoolsPlugin(),
    ), 
    provideCharts(withDefaultRegisterables())
  ]
};

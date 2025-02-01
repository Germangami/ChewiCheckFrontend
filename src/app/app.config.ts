import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngxs/store';
import { ClientState } from './state/client/client.state';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideAnimationsAsync(), provideStore(
      [
        ClientState
      ],
      withNgxsReduxDevtoolsPlugin(),
    ), 
    provideCharts(withDefaultRegisterables())
  ]
};

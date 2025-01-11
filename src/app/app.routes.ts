import { Routes } from '@angular/router';
import { CoachPageComponent } from './pages/coach-page/coach-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';

export const routes: Routes = [
    {
        path: 'coach',
        component: CoachPageComponent
    },
    {
        path: 'client',
        component: ClientPageComponent
    }
];

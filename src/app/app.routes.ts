import { Routes } from '@angular/router';
import { CoachPageComponent } from './pages/coach-page/coach-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'coach',
        component: CoachPageComponent
    },
    {
        path: 'client/:id',
        component: ClientPageComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

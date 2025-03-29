import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { AuthStateModel, UserRole } from './auth.model';
import { 
    CheckUserRole,
    SetUserRole,
    SetAuthLoading,
    SetAuthError,
    ClearAuthError,
    ResetAuthState
} from './auth.actions';
import { ApiService } from '../../shared/services/api.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { GetTrainer } from '../trainer/trainer.actions';
import { GetAllClients } from '../client/client.actions';

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        role: UserRole.UNKNOWN,
        userData: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class AuthState {
    constructor(private apiService: ApiService, private store: Store) {}

    @Action(CheckUserRole)
    checkUserRole(ctx: StateContext<AuthStateModel>, action: CheckUserRole) {
        console.log('ASDLKJASDJ ASKLDJ ')
        return this.apiService.getTrainerById(action.tgId).pipe(
            catchError(() => of(null)), // Если 404, продолжаем с null
            switchMap(trainer => {
                console.log(trainer, 'TRAINER')
                if (trainer && trainer.role === 'trainer') {
                    ctx.patchState({ role: UserRole.TRAINER });
                    this.store.dispatch(new GetTrainer(action.tgId))
                    this.store.dispatch(new GetAllClients());
                    return of(trainer);
                } 
                return this.apiService.getCurrentClient(action.tgId).pipe(
                    catchError(() => of(null)), // Если клиента тоже нет, просто null
                    tap(client => {
                        console.log(client, 'CLIENT!')
                        if (client && client.role === 'client') {
                            ctx.patchState({ role: UserRole.CLIENT });
                        } else {
                            ctx.patchState({ role: UserRole.UNKNOWN });
                        }
                    })
                );
            })
        )
    }
} 
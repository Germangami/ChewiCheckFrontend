import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
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
    constructor(private apiService: ApiService) {}

    @Action(CheckUserRole)
    checkUserRole(ctx: StateContext<AuthStateModel>, action: CheckUserRole) {
        ctx.dispatch(new SetAuthLoading(true));
        
        return this.apiService.getTrainerById(action.tgId).pipe(
            tap(() => ctx.dispatch(new ClearAuthError())),
            map(trainer => {
                if (trainer) {
                    // Если это тренер, сразу загружаем его данные и список клиентов
                    ctx.dispatch([
                        new SetUserRole({
                            role: UserRole.TRAINER,
                            userData: trainer
                        }),
                        new GetTrainer(action.tgId),
                        new GetAllClients()
                    ]);
                }
                return this.apiService.getCurrentClient(action.tgId).pipe(
                    map(client => {
                        if (client) {
                            return ctx.dispatch(new SetUserRole({
                                role: UserRole.CLIENT,
                                userData: client
                            }));
                        }
                        return ctx.dispatch(new SetUserRole({
                            role: UserRole.UNKNOWN,
                            userData: null
                        }));
                    })
                );
            }),
            catchError(error => {
                console.error('Error checking user role:', error);
                return of(ctx.dispatch(new SetAuthError('Failed to check user role')));
            }),
            tap(() => ctx.dispatch(new SetAuthLoading(false)))
        );
    }

    @Action(SetUserRole)
    setUserRole(ctx: StateContext<AuthStateModel>, action: SetUserRole) {
        ctx.patchState({
            role: action.payload.role,
            userData: action.payload.userData
        });
    }

    @Action(SetAuthLoading)
    setLoading(ctx: StateContext<AuthStateModel>, action: SetAuthLoading) {
        ctx.patchState({
            loading: action.loading
        });
    }

    @Action(SetAuthError)
    setError(ctx: StateContext<AuthStateModel>, action: SetAuthError) {
        ctx.patchState({
            error: action.error
        });
    }

    @Action(ClearAuthError)
    clearError(ctx: StateContext<AuthStateModel>) {
        ctx.patchState({
            error: null
        });
    }

    @Action(ResetAuthState)
    resetState(ctx: StateContext<AuthStateModel>) {
        ctx.setState({
            role: UserRole.UNKNOWN,
            userData: null,
            loading: false,
            error: null
        });
    }
} 
import { Selector } from '@ngxs/store';
import { AuthState } from './auth.state';
import { AuthStateModel, UserRole } from './auth.model';
import { Client } from '../../shared/Model/ClientModel/client-model';
import { Trainer } from '../../shared/Model/TrainerModel/trainer-model';

export interface AuthStateView {
    role: UserRole;
    userData: Client | Trainer | null;
    isLoading: boolean;
    error: string | null;
}

export class AuthSelectors {
    @Selector([AuthState])
    static getAuthState(state: AuthStateModel): AuthStateView {
        return {
            role: state.role,
            userData: state.userData,
            isLoading: state.loading,
            error: state.error
        };
    }

    @Selector([AuthState])
    static getRole(state: AuthStateModel): UserRole {
        return state.role;
    }

    @Selector([AuthState])
    static isTrainer(state: AuthStateModel): boolean {
        return state.role === UserRole.TRAINER;
    }

    @Selector([AuthState])
    static isClient(state: AuthStateModel): boolean {
        return state.role === UserRole.CLIENT;
    }

    @Selector([AuthState])
    static getTrainerData(state: AuthStateModel): Trainer | null {
        return state.role === UserRole.TRAINER ? state.userData as Trainer : null;
    }

    @Selector([AuthState])
    static getClientData(state: AuthStateModel): Client | null {
        return state.role === UserRole.CLIENT ? state.userData as Client : null;
    }

    @Selector([AuthState])
    static isLoading(state: AuthStateModel): boolean {
        return state.loading;
    }

    @Selector([AuthState])
    static getError(state: AuthStateModel): string | null {
        return state.error;
    }
} 
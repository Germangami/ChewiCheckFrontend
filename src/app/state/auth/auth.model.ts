import { Client } from "../../shared/Model/ClientModel/client-model";
import { Trainer } from "../../shared/Model/TrainerModel/trainer-model";

export enum UserRole {
    TRAINER = 'trainer',
    CLIENT = 'client',
    UNKNOWN = 'unknown'
}

export interface AuthStateModel {
    role: UserRole;
    userData: Client | Trainer | null;
    loading: boolean;
    error: string | null;
} 
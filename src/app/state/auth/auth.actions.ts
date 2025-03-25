import { Client } from "../../shared/Model/ClientModel/client-model";
import { Trainer } from "../../shared/Model/TrainerModel/trainer-model";
import { UserRole } from "./auth.model";

export class CheckUserRole {
    static readonly type = '[Auth] Check User Role';
    constructor(public tgId: number) {}
}

export class SetUserRole {
    static readonly type = '[Auth] Set User Role';
    constructor(public payload: {
        role: UserRole;
        userData: Client | Trainer | null;
    }) {}
}

export class SetAuthLoading {
    static readonly type = '[Auth] Set Loading';
    constructor(public loading: boolean) {}
}

export class SetAuthError {
    static readonly type = '[Auth] Set Error';
    constructor(public error: string) {}
}

export class ClearAuthError {
    static readonly type = '[Auth] Clear Error';
}

export class ResetAuthState {
    static readonly type = '[Auth] Reset State';
} 
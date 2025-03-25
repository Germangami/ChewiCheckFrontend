export interface TelegramStateModel {
    tgId: number | null;
    initData: any;
    isWebAppReady: boolean;
    error: string | null;
}

export interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

export interface TelegramInitData {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
} 
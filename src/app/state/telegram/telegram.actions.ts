import { TelegramInitData } from './telegram.model';

export class InitTelegramWebApp {
    static readonly type = '[Telegram] Init WebApp';
}

export class SetTelegramData {
    static readonly type = '[Telegram] Set Data';
    constructor(public payload: {
        tgId: number;
        initData: TelegramInitData;
        isWebAppReady: boolean;
    }) {}
}

export class SetTelegramError {
    static readonly type = '[Telegram] Set Error';
    constructor(public error: string) {}
}

export class ClearTelegramError {
    static readonly type = '[Telegram] Clear Error';
}

export class ResetTelegramState {
    static readonly type = '[Telegram] Reset State';
} 
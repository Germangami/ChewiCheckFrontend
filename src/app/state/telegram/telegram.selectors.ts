import { Selector } from '@ngxs/store';
import { TelegramState } from './telegram.state';
import { TelegramStateModel } from './telegram.model';

export class TelegramSelectors {
    @Selector([TelegramState])
    static getTgId(state: TelegramStateModel): number | null {
        return state.tgId;
    }

    @Selector([TelegramState])
    static getInitData(state: TelegramStateModel): any {
        return state.initData;
    }

    @Selector([TelegramState])
    static isWebAppReady(state: TelegramStateModel): boolean {
        return state.isWebAppReady;
    }

    @Selector([TelegramState])
    static getError(state: TelegramStateModel): string | null {
        return state.error;
    }
} 
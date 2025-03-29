import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { TelegramStateModel } from './telegram.model';
import { 
    InitTelegramWebApp, 
    SetTelegramData, 
    SetTelegramError,
    ClearTelegramError,
    ResetTelegramState 
} from './telegram.actions';

// TODO ЗАХАРДКОЖЕННЫЕ ДАННЫЕ tgId, isWebAppReaddy 
// 469408413
// 445244007

@State<TelegramStateModel>({
    name: 'telegram',
    defaults: {
        tgId: 469408413,
        initData: null,
        isWebAppReady: true,
        error: null
    }
})
@Injectable()
export class TelegramState {
    
    @Action(InitTelegramWebApp)
    initWebApp(ctx: StateContext<TelegramStateModel>) {
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
            const webApp = window.Telegram.WebApp;
            const initData = webApp.initDataUnsafe;
            
            if (initData?.user?.id) {
                ctx.dispatch(new SetTelegramData({
                    tgId: initData.user.id,
                    initData,
                    isWebAppReady: true
                }));
                webApp.ready();
                webApp.expand();
            } else {
                ctx.dispatch(new SetTelegramError('No user data available'));
            }
        } else {
            ctx.dispatch(new SetTelegramError('Telegram WebApp is not available'));
        }
    }

    @Action(SetTelegramData)
    setData(ctx: StateContext<TelegramStateModel>, action: SetTelegramData) {
        ctx.patchState({
            tgId: action.payload.tgId,
            initData: action.payload.initData,
            isWebAppReady: action.payload.isWebAppReady,
            error: null
        });
    }

    @Action(SetTelegramError)
    setError(ctx: StateContext<TelegramStateModel>, action: SetTelegramError) {
        ctx.patchState({
            error: action.error
        });
    }

    @Action(ClearTelegramError)
    clearError(ctx: StateContext<TelegramStateModel>) {
        ctx.patchState({
            error: null
        });
    }

    @Action(ResetTelegramState)
    resetState(ctx: StateContext<TelegramStateModel>) {
        ctx.setState({
            tgId: null,
            initData: null,
            isWebAppReady: false,
            error: null
        });
    }
} 
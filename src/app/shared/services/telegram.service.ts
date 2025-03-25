import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { InitTelegramWebApp } from "../../state/telegram/telegram.actions";
import { TelegramSelectors } from "../../state/telegram/telegram.selectors";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TelegramService {
    private webApp: any;

    constructor(private store: Store) {
        this.webApp = window.Telegram?.WebApp;
    }

    initTelegramWebApp() {
        this.store.dispatch(new InitTelegramWebApp());
    }

    getTgId(): Observable<number | null> {
        return this.store.select(TelegramSelectors.getTgId);
    }

    isWebAppReady(): Observable<boolean> {
        return this.store.select(TelegramSelectors.isWebAppReady);
    }

    // Haptic feedback
    hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium') {
        this.webApp?.HapticFeedback?.impactOccurred(style);
    }

    // Главная кнопка
    showMainButton(text: string, onClick: () => void) {
        if (this.webApp?.MainButton) {
            this.webApp.MainButton.setText(text);
            this.webApp.MainButton.onClick(onClick);
            this.webApp.MainButton.show();
        }
    }

    hideMainButton() {
        this.webApp?.MainButton?.hide();
    }

    // Нативный алерт
    showAlert(message: string) {
        return this.webApp?.showAlert(message);
    }
}

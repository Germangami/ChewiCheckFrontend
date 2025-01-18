export {}; // Убедитесь, что файл является модулем
declare global {
    interface Window {
        Telegram: {
            WebApp: any; // Замените `any` на более конкретный тип, если известно
        };
    }
}
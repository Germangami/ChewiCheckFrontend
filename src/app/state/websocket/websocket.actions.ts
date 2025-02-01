export class WebSocketConnected {
    static readonly type = '[WebSocket] Connected';
}

export class WebSocketDisconnected {
    static readonly type = '[WebSocket] Disconnected';
}

export class WebSocketMessageReceived {
    static readonly type = '[WebSocket] Message Received';
    constructor(public payload: any) {}
} 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const ws_1 = require("ws");
const events = require("events");
class Executor {
    constructor() {
        this.clientConnected = 0;
    }
    /**
     * @description
     * Creates a WebSocket Server for script execution. (Exploit must support WebSocket Library), Must also have script below executed (Recommended to put with exploit auto_execute folder).
     *
     * [WebSocketExecute.lua](https://github.com/maikokain/ram.ts/tree/main/src/WebSocketExecute.lua)
     */
    CreateWebSocket(opt) {
        opt.port = opt.port ?? 8080;
        const client = new events.EventEmitter();
        const ws = new ws_1.Server({ port: opt.port });
        this.ws = ws;
        ws.on('listening', () => client.emit('connect', `Listening to clients on port ${opt.port}`));
        ws.on('connection', (socket, req) => {
            this.clientConnected++;
            client.emit('connect', `A client connected, Currently connected: ${this.clientConnected}`);
            socket.once('close', () => {
                this.clientConnected--;
                this.clientConnected = Math.max(this.clientConnected, 0);
                client.emit('connect', `A client disconnected, Currently connected: ${this.clientConnected}`);
            });
            socket.on('message', (data) => {
                const content = data.toString();
                try {
                    const json = JSON.parse(content);
                    if (json.type == "error") {
                        client.emit('message', json.message);
                    }
                }
                catch (e) { }
            });
        });
        ws.on('close', () => {
            for (const client of ws.clients) {
                if (client.readyState === client.OPEN)
                    client.close();
            }
        });
        return client;
    }
    /**
     * Send a script to WebSocket Server or Exploit pipe.
     */
    async Execute(exploit, script) {
        switch (exploit) {
            case "socket":
                if (this.clientConnected === 0) {
                    return `No Exploit is connected to websocket.`;
                }
                for (const client of this.ws.clients) {
                    if (client.readyState == client.OPEN) {
                        client.send(String(script));
                    }
                }
                return `Success`;
            case "krnl":
                break;
            case "fluxus":
                break;
            default: break;
        }
    }
}
exports.Executor = Executor;

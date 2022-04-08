"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const ws_1 = require("ws");
const events = __importStar(require("events"));
const net = __importStar(require("net"));
const find_process_1 = __importDefault(require("find-process"));
class Executor {
    constructor() {
        this.clientConnected = 0;
    }
    /**
     * @description
     * Creates a WebSocket Server for script execution. (Exploit must support WebSocket Library), Must also have script below executed (Recommended to put with exploit auto_execute folder).
     *
     * [WebSocketExecute.lua](https://github.com/maikokain/ram.ts/tree/main/WebSocketExecute.lua)
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
                const client = net.connect(pipes[exploit]);
                client.once('ready', () => { client.end(script); });
                return client;
            case "fluxus":
                const InjectedMaps = new Map();
                const roblox_process = await (0, find_process_1.default)('name', 'RobloxPlayer');
                for (let i = 0; i < roblox_process.length; i++) {
                    if (InjectedMaps.has(roblox_process[i].pid)) {
                        const krnl_client = net.connect(pipes[exploit] + roblox_process[i].pid);
                        krnl_client.once('ready', () => { krnl_client.end(script); });
                        return krnl_client;
                    }
                    else {
                        InjectedMaps.set(roblox_process[i].pid, "");
                        const client = net.connect(pipes[exploit] + roblox_process[i].pid);
                        client.once('ready', () => { client.end(script); });
                        return client;
                    }
                }
                break;
            case "oxygen_u":
                const oxy_client = net.connect(pipes[exploit]);
                oxy_client.once('ready', () => { oxy_client.end(script); });
                return oxy_client;
            case "easy_exploit":
                const easyexploit_client = net.connect(pipes[exploit]);
                easyexploit_client.once('ready', () => { easyexploit_client.end(script); });
                return easyexploit_client;
            default: break;
        }
    }
}
exports.Executor = Executor;
const pipes = {
    "krnl": "\\\\.\\pipe\\krnlpipe",
    "oxygen_u": "\\\\.\\pipe\\OxygenU",
    "fluxus": "\\\\.\\pipe\\fluxus_send_pipe",
    "easy_exploit": "\\\\.\\pipe\\ocybedam"
};

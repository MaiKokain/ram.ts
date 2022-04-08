/// <reference types="node" />
import TypedEmitter from 'typed-emitter';
import * as net from 'net';
export declare class Executor {
    private clientConnected;
    private ws;
    constructor();
    /**
     * @description
     * Creates a WebSocket Server for script execution. (Exploit must support WebSocket Library), Must also have script below executed (Recommended to put with exploit auto_execute folder).
     *
     * [WebSocketExecute.lua](https://github.com/maikokain/ram.ts/tree/main/WebSocketExecute.lua)
     */
    CreateWebSocket(opt: {
        port?: number;
    }): TypedEmitter<{
        connect: (message: string) => void;
        message: (message: string) => void;
    }>;
    /**
     * Send a script to WebSocket Server or Exploit pipe.
     */
    Execute(exploit: exploit_opt, script: string): Promise<net.Socket | "No Exploit is connected to websocket." | "Success" | undefined>;
}
declare type exploit_opt = "socket" | "krnl" | "fluxus" | "oxygen_u" | "easy_exploit";
export {};

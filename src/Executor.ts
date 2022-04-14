import { Server } from 'ws'
import * as events from 'events'
import TypedEmitter from 'typed-emitter'
import * as net from 'net';
import find from 'find-process';

export class Executor {
    private clientConnected: number = 0
    private ws!: Server
    constructor() { }

    /**
     * @description
     * Creates a WebSocket Server for script execution. (Exploit must support WebSocket Library), Must also have script below executed (Recommended to put with exploit auto_execute folder).
     * 
     * [WebSocketExecute.lua](https://github.com/maikokain/ram.ts/tree/main/WebSocketExecute.lua)
     */
    CreateWebSocket(opt: { port?: number }) {
        opt.port = opt.port ?? 8080
        const client = new events.EventEmitter() as TypedEmitter<{ connect: (message: string) => void, message: (message: string) => void }>
        const ws = new Server({ port: opt.port })
        this.ws = ws

        ws.on('listening', () => client.emit('connect', `Listening to clients on port ${opt.port}`))
        ws.on('connection', (socket, req) => {
            this.clientConnected++
            client.emit('connect', `A client connected, Currently connected: ${this.clientConnected}`)

            socket.once('close', () => {
                this.clientConnected--
                this.clientConnected = Math.max(this.clientConnected, 0)
                client.emit('connect', `A client disconnected, Currently connected: ${this.clientConnected}`)
            })

            socket.on('message', (data) => {
                const content = data.toString()

                try {
                    const json = JSON.parse(content)

                    if (json.type == "error") {
                        client.emit('message', json.message)
                    }
                } catch (e) { }
            })
        })
        ws.on('close', () => {
            for (const client of ws.clients) {
                if (client.readyState === client.OPEN) client.close()
            }
        })

        return client
    }

    /**
     * Send a script to WebSocket Server or Exploit pipe.
     */
    async Execute(exploit: exploit_opt, script: string) {
        switch (exploit) {
            case "socket":
                if (this.clientConnected === 0) {
                    return `No Exploit is connected to websocket.`
                }
                for (const client of this.ws.clients) {
                    if (client.readyState == client.OPEN) {
                        client.send(String(script))
                    }
                }
                return this.ws.clients
            case "krnl":
                return sendPipe(pipes[exploit])
            case "fluxus":
                const InjectedMaps = new Map()
                const roblox_process = await find('name', 'RobloxPlayer')
                for (let i = 0; i < roblox_process.length; i++) {
                    if (InjectedMaps.has(roblox_process[i].pid)) {
                        return sendPipe(pipes[exploit]+roblox_process[i].pid)
                    } else {
                        InjectedMaps.set(roblox_process[i].pid, "");
                        return sendPipe(pipes[exploit]+roblox_process[i].pid)
                    }
                }
                break
            case "oxygen_u":
                return sendPipe(pipes[exploit])
            case "easy_exploit":
                return sendPipe(pipes[exploit])
            default: break
        }

        function sendPipe(pipe: string) {
            const client = net.connect(pipe)
            client.once('ready', () => { client.end(script) })
            return client
        }
    }
}

type exploit_opt = "socket" | "krnl" | "fluxus" | "oxygen_u" | "easy_exploit"

const pipes = {
    "krnl": "\\\\.\\pipe\\krnlpipe",
    "oxygen_u": "\\\\.\\pipe\\OxygenU",
    "fluxus": "\\\\.\\pipe\\fluxus_send_pipe",
    "easy_exploit": "\\\\.\\pipe\\ocybedam"
}

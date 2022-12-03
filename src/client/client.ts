import axios, { AxiosError, AxiosResponse } from "axios";
import { RequestTypes, Update, BasicResponse } from "../types/requests";
import { EventEmitter } from "node:events";
import State from "../state/state";

export default class Client extends EventEmitter {
    private basicUri = "https://api.telegram.org/bot";
    
    private token: string;
    public State: typeof State.prototype | undefined; 

    constructor (config: { token: string, state?: typeof State.prototype }) {
        super();
        this.token = config.token;
        if (config.state) this.State = config.state;
    }

    public load () {
        this.emit("load");
    } 

    public async start () {
        let answer = await this.request("getMe");
        if (answer) {
            this.emit("start", answer);
            this.longpoll();
        }
    }

    public async request<K extends keyof RequestTypes>(methodName: K, methodParams: RequestTypes[K]["request"] = {}): Promise<RequestTypes[K]["response"]> {  
        let response: AxiosResponse<any, any> = await new Promise (async (resolve) => {
            let request = axios.get(
                this.basicUri + this.token + "/" + methodName + "?" + new URLSearchParams(methodParams as Record<string, string>)
            );

            request.catch((e: AxiosError) => {
                let data = e.response?.data as BasicResponse;
                throw new Error(`Bad response from telegram api:\n${e.message}\n${data.description}`);
            })

            request.then((e) => {
                resolve(e);
            })
        })

        let data: BasicResponse = await response.data;

        let result: RequestTypes[K]["response"] = data.result;
            
        return result;
    }

    private async longpoll (updateId: number = 0) {
        let updates = await this.request("getUpdates", 
            { offset: (updateId != 0) ? updateId + 1 : updateId, timeout: 60});

        if (this.State) {
            updates.forEach(async (event) => {
                if (event.message) {
                    let state = this.State?.states[event.message.chat.id]
                        || this.State?.update(event.message.chat.id, "default") as string // event.callback_query.from.id

                    if (event.message.entities) {
                        for (let i = 0; i < event.message.entities.length; i++) {
                            if (event.message.entities[i].type == "bot_command") {
                                let command = event.message?.text?.split(" ").find((word) => word.startsWith("/")) as string;
                                this.State?.update(
                                    event.message.chat.id,
                                    await this.State?.filter("default", "command", command, [this, event.message])
                                )
                                return;
                            }
                        }
                    }
                    else {
                        this.State?.update(
                            event.message.chat.id,
                            await this.State?.filter(state, "message", event.message.text as string, [this, event.message]) as string
                        )
                        return;
                    }
                }
                if (event.callback_query) {
                    let state = this.State?.states[event.callback_query.from.id]
                        || this.State?.update(event.callback_query.from.id, "default") as string;
                    await this.State?.filter("default", "callback", event.callback_query.data as string, [this, event.callback_query]);
                    this.State?.update(
                        event.message.chat.id,
                        await this.State?.filter(state, "callback", event.callback_query.data as string, [this, event.callback_query])
                    )
                    return;
                }
            })
        }
        else {
            updates.forEach((update: Update) => {
                this.emit("update", update);
            })
        }

        await this.longpoll(updates.at(-1)?.update_id);
    }
}
import axios, { AxiosError, AxiosResponse } from "axios";
import { IUpdate, IBasicResponse, IUser, RequestTypes } from "../types";
import { State } from ".";
import { TelegramEventEmitter } from "./TelegramEventEmitter";
import { CallbackQuery, Message } from "../models";

export class Telegram extends TelegramEventEmitter {
    private basicUri = "https://api.telegram.org/bot";
    
    private token: string;
    public State: typeof State.prototype | undefined;
    public self: IUser | undefined;

    constructor ({ token, state }: { token: string, state?: typeof State.prototype }) {
        super();
        this.token = token;
        if (state) this.State = state;
    }

    public load () {
        this.emit("load");
    } 

    public async start () {
        let answer = await this.request("getMe");
        if (answer) {
            this.emit("start", answer);
            this.self = answer;
            this.longpoll();
        }
    }

    public async request<K extends keyof RequestTypes, P extends RequestTypes[K]>(methodName: K, methodParams: P["request"] = {}): Promise<P["response"]> {  
        let data: IBasicResponse = await new Promise (async (resolve) => {
            let request = axios.request({
                url: this.basicUri + this.token + "/" + methodName,
                params: methodParams,
                validateStatus: (s) => true
            })
            
            request.catch((e: AxiosError) => {
                let data = (e.response as AxiosResponse<any,any>).data;
                if (data) resolve(data);
                // throw new Error(`Bad response from telegram api:\n${e.message}\n${data.description}`);
            })

            request.then((e) => {
                resolve(e.data);
            })

            request.finally(() => {})
        })
    
        if (!data.ok) {
            this.emit("error", data);
        }
    
        let result: RequestTypes[K]["response"] = data.result;
        return result;
    }

    public async downloadFile(filePath: string): Promise<string> {
        try {
            const file = (await axios.request({
                url: `https://api.telegram.org/file/bot${this.token}/${filePath}`,
                method: "GET",
                responseType: "arraybuffer"
            })).data;
            return Buffer.from(file, "binary").toString('base64');;
        } catch (e) {
            return (e as AxiosError).message;
        }
    }

    private async longpoll (updateId: number = 0) {
        let updates = await this.request("getUpdates", { offset: (updateId != 0) ? updateId + 1 : updateId, timeout: 60 });

        if (this.State) {
            updates.forEach(async (update) => {
                let newState = await this.updateFilter(update);

                if (newState) {
                    this.State?.update(
                        update.message.chat.id || update.callback_query.from.id || 0,
                        newState
                    )
                }
            })
        }
        else {
            updates.forEach((update: IUpdate) => {
                this.emit("update", update);
            })
        }

        await this.longpoll(updates.at(-1)?.update_id);
    }

    private async updateFilter (e: IUpdate): Promise<string | undefined> {
        if (e.message) {
            const m = new Message(this, e.message);

            let state = (this.State?.states[m.chat.id]
                || this.State?.update(m.chat.id, "default")) as string // e.callback_query.from.id

            if (m.entities && m.entities.map((e) => e.type === "bot_command")) {
                let command = m.text?.split(" ").find((word) => word.startsWith("/")) as string;
                return (await this.State?.filter("default", "command", command, [this, m]));
            }

            if (m.text) {
                return (await this.State?.filter(state, "message", m.text as string, [this, m]));
            }

            else {
                return (await this.State?.filter(state, "message", "default", [this, m]));
            }
        }
        
        if (e.callback_query) {
            const cq = new CallbackQuery(this, e.callback_query);

            let state = this.State?.states[e.callback_query.from.id]
                || this.State?.update(e.callback_query.from.id, "default") as string;

            await this.State?.filter("default", "callback", e.callback_query.data as string, [this, cq]);
            return (await this.State?.filter(state, "callback", e.callback_query.data as string, [this, cq]));
        }
    }
}
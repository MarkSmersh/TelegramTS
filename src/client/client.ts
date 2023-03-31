import axios, { AxiosError, AxiosResponse } from "axios";
import { RequestTypes, Update, BasicResponse, User } from "../types/request";
import State from "../state/state";
import { TelegramEventEmitter } from "./TelegramEventEmitter";
import FormData from "form-data"

export default class Client extends TelegramEventEmitter {
    private basicUri = "https://api.telegram.org/bot";
    
    private token: string;
    public State: typeof State.prototype | undefined;
    public self: User | undefined;

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
            this.self = answer;
            this.longpoll();
        }
    }

    public async request<K extends keyof RequestTypes, P extends RequestTypes[K]>(methodName: K, methodParams: P["request"] = {}): Promise<P["response"]> {  
        let data: BasicResponse = await new Promise (async (resolve) => {
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
                responseType: "blob"
            })).data;
            // return Buffer.from(file, "binary").toString('base64');
            const formData = new FormData();

            formData.append("file", file);
            formData.append("model", "whisper-1");
    
            const response = (await axios.request({
                url: "https://api.openai.com/v1/audio/transcriptions",
                method: "post",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                    'Authorization': `Bearer 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`
                },
                data: formData
            })).data

            console.log(response);

            return file;
        } catch (e) {
            return (e as AxiosError).message;
        }
    }

    private async longpoll (updateId: number = 0) {
        let updates = await this.request("getUpdates", { offset: (updateId != 0) ? updateId + 1 : updateId, timeout: 60 });

        if (this.State) {
            updates.forEach(async (event) => {
                if (event.message) {
                    let state = this.State?.states[event.message.chat.id]
                        || this.State?.update(event.message.chat.id, "default") as string // event.callback_query.from.id

                    if (event.message.entities) {
                        for (let i = 0; i < event.message.entities.length; i++) {
                            if (event.message.entities[i].type == "bot_command") {
                                let command = event.message?.text?.split(" ").find((word) => word.startsWith("/")) as string;
                                let newState = await this.State?.filter("default", "command", command, [this, event.message])

                                if (newState) {
                                    this.State?.update(
                                        event.message.chat.id,
                                        newState
                                    )
                                }
                                return;
                            }
                        }
                    }
                    else {
                        let newState = await this.State?.filter(state, "message", event.message.text as string, [this, event.message])

                        if (newState) {
                            this.State?.update(
                                event.message.chat.id,
                                newState
                            )
                        }
                        return;
                    }
                }
                if (event.callback_query) {
                    let state = this.State?.states[event.callback_query.from.id]
                        || this.State?.update(event.callback_query.from.id, "default") as string;
                    await this.State?.filter("default", "callback", event.callback_query.data as string, [this, event.callback_query]);
                    
                    let newState = await this.State?.filter(state, "callback", event.callback_query.data as string, [this, event.callback_query]);
                    if (newState) {
                        this.State?.update(
                            event.callback_query.from.id,
                            newState
                        )
                    }
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
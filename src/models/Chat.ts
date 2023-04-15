import { Telegram } from "..";
import { RequestTypes, IChat } from "../types";

export class Chat implements IChat {
    id!: IChat["id"];
    type!: IChat["type"];
    title?: IChat["title"];
    username?: IChat["username"];
    first_name?: IChat["first_name"];
    last_name?: IChat["last_name"];
    bio?: IChat["bio"];

    client: Telegram;

    constructor (client: Telegram, chat: IChat) {
        Object.assign(this, chat);
        this.client = client;
    }

    async get () {
        return (
            new Chat(this.client, await this.client.request('getChat', { chat_id: this.id }))
        )
    }
}
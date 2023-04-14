import { Telegram } from "..";
import { ICallbackQuery, RequestTypes } from "../types";

export class CallbackQuery implements ICallbackQuery {
    id!: ICallbackQuery["id"];
    from!: ICallbackQuery["from"];
    message?: ICallbackQuery["message"];
    inline_message_id?: ICallbackQuery["inline_message_id"];
    chat_instance!: ICallbackQuery["chat_instance"];
    data?: ICallbackQuery["data"];
    game_short_name?: ICallbackQuery["game_short_name"];

    client: Telegram;

    constructor (client: Telegram, callbackQuery: ICallbackQuery) {
        Object.assign(this, callbackQuery);
        this.client = client;
    }

    async answer (p: Omit<RequestTypes["answerCallbackQuery"]["request"], "callback_query_id">) {
        return (await this.client.request('answerCallbackQuery', { callback_query_id: this.id, ...p }))
    }
}
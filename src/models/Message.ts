import { IMessage, Telegram } from "..";
import { RequestTypes } from "../types";
import { Chat, Voice } from ".";

export class Message implements IMessage {
    message_id!: IMessage["message_id"];
    from?: IMessage["from"];
    sender_chat?: IMessage["sender_chat"];
    date!: IMessage["date"];
    chat!: Chat
    forward_from?: IMessage["forward_from"];
    forward_from_chat?: Chat
    forward_from_message_id?: IMessage["forward_from_message_id"];
    forward_signature?: IMessage["forward_signature"];
    forward_sender_name?: IMessage["forward_sender_name"];
    forward_date?: IMessage["forward_date"];
    is_automatic_forward?: IMessage["is_automatic_forward"];
    reply_to_message?: IMessage["reply_to_message"];
    via_bot?: IMessage["via_bot"];
    edit_date?: IMessage["edit_date"];
    has_protected_content?: IMessage["has_protected_content"];
    media_group_id?: IMessage["media_group_id"];
    author_signature?: IMessage["author_signature"];
    entities?: IMessage["entities"];
    reply_markup?: IMessage["reply_markup"];
    web_app_data?: IMessage["web_app_data"];
    audio?: IMessage["audio"];
    photo?: IMessage["photo"];
    voice?: Voice;
    text?: IMessage["text"];

    client: Telegram

    constructor (client: Telegram, message: IMessage) {
      Object.assign(this, message)
      this.client = client

      const chat = new Chat(client, message.chat);
      this.chat = chat;
      this.forward_from_chat = chat;

      if (message.voice) {
        this.voice = new Voice(client, message.voice);
      }
    }

    async reply(p: Omit<RequestTypes['sendMessage']["request"], "chat_id" | "reply_to_message_id">) {
      return (await this.client.request('sendMessage', { chat_id: this.chat.id, reply_to_message_id: this.message_id, ...p }))
    }

    async edit(p: Omit<RequestTypes['editMessageText']["request"], "chat_id" | "message_id">) {
      return (await this.client.request('editMessageText', { chat_id: this.chat.id, message_id: this.message_id, ...p }))
    }

    async delete() {
      return (await this.client.request('deleteMessage', { chat_id: this.chat.id, message_id: this.message_id.toString()}))
    }
}
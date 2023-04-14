import { Telegram } from "..";
import { SlashCommands, CallbackData, MessageData } from ".";

export interface EventModel {
    type: keyof EventTypeModel,
    data: EventTypeModel[keyof EventTypeModel] | "default",
    function: FunctionModel
}

export interface EventTypeModel {
    command: SlashCommands,
    callback: CallbackData,
    message: MessageData
}

export type FunctionModel = (client: Telegram, event: any) => Promise<FunctionReturn>

export type FunctionReturn = string | void; 
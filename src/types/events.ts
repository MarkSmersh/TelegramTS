import Client from "../client/client";
import { SlashCommands, CallbackData, MessageData } from "./request";

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

export type FunctionModel = (client: Client, event: any) => Promise<FunctionReturn>

export type FunctionReturn = string | void; 
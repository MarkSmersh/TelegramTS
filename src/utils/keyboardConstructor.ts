import { IInlineKeyboardButton, IInlineKeyboardMarkup, 
         IReplyKeyboardButton, IReplyKeyboardMarkup,
         IReplyKeyboardRemove, IForceReply,
         ILoginUrl, MessageData, IWebAppInfo, CallbackData } from "../types";

export function InlineMarkup (...inlineButtons: IInlineKeyboardButton[][]): string {
    let inlineKeyboard: IInlineKeyboardMarkup = {
        inline_keyboard: inlineButtons
    }
    return JSON.stringify(inlineKeyboard);
}

export function InlineButton (config: { text: string, callbackData?: CallbackData, webApp?: IWebAppInfo, url?: string, loginUrl?: ILoginUrl }): IInlineKeyboardButton {
    return {
        text: config.text,
        callback_data: config.callbackData,
        url: config.url,
        web_app: config.webApp
    }
}

export function ReplyMarkup (config: { resizeKeyboard?: boolean, oneTimeKeyboard?: boolean, inputFieldPlaceholder?: string, selective?: boolean }, ...replyButtons: IReplyKeyboardButton[][]): string { // ...replyButtons: ReplyKeyboardButton[][], 
    let replyKeyboard: IReplyKeyboardMarkup = {
        keyboard: replyButtons,
        resize_keyboard: config.resizeKeyboard,
        one_time_keyboard: config.oneTimeKeyboard,
        input_field_placeholder: config.inputFieldPlaceholder,
        selective: config.selective
    }
    return JSON.stringify(replyKeyboard);
}

export function ReplyButton (config: { text: MessageData, requestContact?: boolean, requestLocation?: boolean, webApp?: IWebAppInfo }): IReplyKeyboardButton {
    return {
        text: config.text,
        request_contact: config.requestContact,
        request_location: config.requestLocation,
        web_app: config.webApp
    }
}

export function ReplyRemove (config: { selective?: boolean }): string { // ...replyButtons: ReplyKeyboardButton[][], 
    let replyRemove: IReplyKeyboardRemove = {
        remove_keyboard: true,
        selective: config.selective
    }
    return JSON.stringify(replyRemove);
}

export function ForceReply (config: { inputFieldPlaceholder?: string, selective?: boolean }): string { // ...replyButtons: ReplyKeyboardButton[][], 
    let forceReply: IForceReply = {
        force_reply: true,
        input_field_placeholder: config.inputFieldPlaceholder,
        selective: config.selective
    }
    return JSON.stringify(forceReply);
}
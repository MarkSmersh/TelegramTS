import {
    IMessage,
    IChat,
    IUser,
    IBasicResponse,
    IInlineKeyboardMarkup,
    IFile,
    IUpdate,
    IChatMember,
} from ".";

export interface ResponseEvents {
    load: [];
    start: [message: IUser];
    update: [update: IUpdate];
    error: [error: IBasicResponse];
}

type ParseModes = "MarkdownV2" | "HTML" | "Markdown";

export interface RequestTypes {
    getMe: {
        request: {};
        response: IUser;
    };
    getUpdates: {
        request: {
            offset?: number;
            limit?: number;
            timeout?: number;
            allowed_updates?: string[];
        };
        response: IUpdate[];
    };
    sendMessage: {
        request: {
            chat_id: number | string | undefined;
            text: string | undefined;
            parse_mode?: ParseModes;
            entities?: MessageEventInit[];
            disable_web_page_preview?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            reply_to_message_id?: number;
            allow_sending_without_reply?: boolean;
            reply_markup?: IInlineKeyboardMarkup | string;
        };
        response: IMessage;
    };
    editMessageText: {
        request: {
            chat_id: number | string | undefined;
            message_id: number;
            text: string;
            inline_message_id?: string;
            parse_mode?: ParseModes;
            entites?: MessageEventInit[];
            disable_web_page_preview?: boolean;
            reply_markup?: string;
        };
        response: IMessage;
    };
    answerCallbackQuery: {
        request: {
            callback_query_id: string;
            text?: string;
            show_alert?: boolean;
            url?: string;
            cache_time?: number;
        };
        response: true;
    };
    deleteMessage: {
        request: {
            chat_id: number | string | undefined;
            message_id: string;
        };
        response: true;
    };
    forwardMessage: {
        request: {
            chat_id: number | string | undefined;
            message_thread_id?: number;
            from_chat_id: string | number;
            disable_notification?: boolean;
            protect_content?: boolean;
            message_id: number;
        };
        response: IMessage;
    };
    copyMessage: {
        request: {
            chat_id: number | string | undefined;
            message_thread_id?: number;
            from_chat_id: string | number;
            message_id: number;
            caption?: string;
            parse_mode?: string;
            caption_entities?: MessageEventInit[];
            disable_notification?: boolean;
            protect_content?: boolean;
            reply_to_message_id?: number;
            allow_sending_without_reply?: boolean;
            reply_markup?: string;
        };
        response: IMessage;
    };
    getFile: {
        request: {
            file_id: string;
        };
        response: IFile;
    };
    getChat: {
        request: {
            chat_id: number | string;
        };
        response: IChat;
    };
    getChatAdministrators: {
        request: {
            chat_id: number | string;
        };
        response: IChatMember[];
    };
    getChatMember: {
        request: {
            chat_id: number | string;
            user_id: number;
        };
        response: IChatMember;
    };
}

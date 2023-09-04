export type SlashCommands = string;
export type CallbackData = string;
export type MessageData = string;

export interface IBasicResponse {
    ok: boolean;
    result: any;
    error_code?: number;
    description?: string;
}

export interface IMessage {
    text?: string;
    message_id: number;
    from?: IUser;
    sender_chat?: IUser;
    date: number;
    chat: IChat;
    forward_from?: IUser;
    forward_from_chat?: IChat;
    forward_from_message_id?: number;
    forward_signature?: string;
    forward_sender_name?: string;
    forward_date?: number;
    is_automatic_forward?: true;
    reply_to_message?: IMessage;
    via_bot?: IUser;
    edit_date?: number;
    has_protected_content?: true;
    media_group_id?: string;
    author_signature?: string;
    entities?: IMessageEntity[];
    reply_markup?: IInlineKeyboardMarkup;
    web_app_data?: IWebAppData;
    audio?: IAudio;
    photo?: IPhotoSize[];
    voice?: IVoice;
}

export interface IFile {
    file_id: string;
    file_unique_id: string;
    file_size?: number;
    file_path?: string;
}

export interface IVoice {
    file_id: string;
    file_unique_id: string;
    duration: number;
    mime_type?: string;
    file_size?: number;
}

export interface IAudio {
    file_id: string;
    file_unique_id: string;
    duration: number;
    performer?: string;
    title?: string;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
    thumbnail?: IPhotoSize;
}

export interface IPhotoSize {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
}

export interface IInlineKeyboardMarkup {
    inline_keyboard: IInlineKeyboardButton[][];
}

export interface IInlineKeyboardButton {
    text: string;
    url?: string;
    callback_data?: CallbackData;
    web_app?: IWebAppInfo;
    login_url?: ILoginUrl;
    switch_inline_query?: string;
    switch_inline_query_current_chat?: string;
    //callback_game,
    pay?: boolean;
}

export interface IReplyKeyboardMarkup {
    keyboard: IReplyKeyboardButton[][];
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
    input_field_placeholder?: string;
    selective?: boolean;
}

export interface IReplyKeyboardRemove {
    remove_keyboard: true;
    selective?: boolean;
}

export interface IForceReply {
    force_reply: true;
    input_field_placeholder?: string;
    selective?: boolean;
}

export interface IReplyKeyboardButton {
    text: MessageData;
    request_contact?: boolean;
    request_location?: boolean;
    web_app?: IWebAppInfo;
    // https://core.telegram.org/bots/api#keyboardbutton
}

export interface ILoginUrl {
    url: string;
    forward_text?: string;
    bot_username?: string;
    request_write_access?: boolean;
}

export interface IUpdate {
    update_id: number;
    message: IMessage;
    edited_message: IMessage;
    channel_post: IMessage;
    edited_channel_post: IMessage;
    inline_query: IInlineQuery;
    // chosen_inline_result,
    callback_query: ICallbackQuery;
    //add more https://core.telegram.org/bots/api#update
}

export interface IInlineQuery {
    id: string;
    from: IUser;
    query: string;
    offset: string;
    chat_type?: string;
}

export interface IUser {
    id: number;
    is_bot: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: true;
    added_to_attachment_menu?: true;
    can_join_groups?: boolean;
    can_read_all_group_messages?: boolean;
    supports_inline_queries?: boolean;
}

export interface IChat {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
}

export interface ICallbackQuery {
    id: string;
    from: IUser;
    message?: IMessage;
    inline_message_id?: string;
    chat_instance: string;
    data?: CallbackData;
    game_short_name?: string;
}

export interface IWebAppInfo {
    url: string;
}

export interface IWebAppData {
    data: string;
    button_text: string;
}

export interface IMessageId {
    message_id: number;
}

export type IChatMember = IChatMemberOwner | IChatMemberAdministator | IChatMemberMember | IChatMemberRestricted | IChatMemberLeft | IChatMemberBanned;

export interface IChatMemberOwner {
    status: "creator";
    user: IUser;
    is_anonymous: boolean;
    custom_title?: string;
}

export interface IChatMemberAdministator {
    status: "administrator";
    user: IUser;
    can_be_edited: boolean;
    is_anonymous: boolean;
    can_manage_chat: boolean;
    can_delete_messages: boolean;
    can_manage_voice_chats: boolean;
    can_restrict_members: boolean;
    can_promote_members: boolean;
    can_change_info: boolean;
    can_invite_users: boolean;
    can_post_messages: boolean;
    can_edit_messages: boolean;
    can_pin_messages: boolean;
    cam_manage_topics: boolean;
    custom_title?: string;
}

export interface IChatMemberMember {
    status: "member";
    user: IUser;
}

export interface IChatMemberRestricted {
    status: "restricted";
    user: IUser;
    is_member: boolean;
    can_change_info: boolean;
    can_invite_users: boolean;
    can_pin_messages: boolean;
    can_send_messages: boolean;
    can_send_media_messages: boolean;
    can_send_polls: boolean;
    can_send_other_messages: boolean;
    can_add_web_page_previews: boolean;
    until_date: number;
}

export interface IChatMemberLeft {
    status: "left";
    user: IUser;
}

export interface IChatMemberBanned {
    status: "kicked";
    user: IUser;
    until_date: number;
}

export interface IMessageEntity {
    type:
        | "mention"
        | "hashtag"
        | "cashtag"
        | "bot_command"
        | "url"
        | "email"
        | "phone_number"
        | "bold"
        | "italic"
        | "underline"
        | "strikethrough"
        | "spoiler"
        | "code"
        | "pre"
        | "text_link"
        | "text_mention"
        | "custom_emoji";
    offset: number;
    length: number;
    url?: string;
    user?: IUser;
    language?: string;
    custom_emoji_id?: string;
}

import { Telegram } from "../client";
import { IVoice } from "../types";

export class Voice implements IVoice {
    file_id!: IVoice["file_id"];
    file_unique_id!: IVoice["file_unique_id"];
    duration!: IVoice["duration"];
    mime_type?: IVoice["mime_type"];
    file_size?: IVoice["file_size"];

    client: Telegram

    constructor (client: Telegram, voice: IVoice) {
        Object.assign(this, voice)
        this.client = client
    }

    async get () {
        return (await this.client.request('getFile', { file_id: this.file_id }))
    }

    async download () {
        const file = await this.get();
        return (await this.client.downloadFile(file.file_path as string));
    }
}
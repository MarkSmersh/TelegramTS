import { Telegram, States, Message, ReplyMarkup, ReplyButton, ReplyRemove } from "../src";

const t = new Telegram({
    token: "6214200735:AAFp5VPLHr5VDvDFCAznZ0DtertnY-s-tns",
    state: new States({
        "default": [
            {
                type: "command",
                data: "/start",
                function: start
            },
        ],
        "menu": [
            {
                type: "message",
                data: "finish",
                function: finish
            }
        ]
    }, {
        states: {},
        onStateUpdate: newStateExecute
    })
})

t.on("start", (e) => {
    console.log(`Bot ${e.first_name} started!`);
    t.request("sendMessage", { chat_id: -1, text: "It will never send this text..." }); // testing .on("error")
})

t.on("update", (e) => {
    console.log(e);
})

t.on("error", (e) => {
    console.log(`Inside client occured error: ${e.description}`);
})

t.start();

async function start(client: Telegram, event: Message) {
    client.request("sendMessage", { text: "Started!", chat_id: event.chat.id, 
        reply_markup: ReplyMarkup({ resizeKeyboard: true }, [
            ReplyButton({ text: "finish" })
        ], [
            ReplyButton({ text: "finish" }), ReplyButton({ text: "finish" })
        ])})
    return "menu";
}

async function finish(client: Telegram, event: Message) {
    client.request("sendMessage", { text: "Finish!", chat_id: event.chat.id,
        reply_markup: ReplyRemove({})})
}

async function newStateExecute(newState: string) {
    console.log(`New state!: ${newState}`);
}
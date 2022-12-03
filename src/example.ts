import { Telegram, States, Message, ReplyMarkup, ReplyButton, ReplyRemove } from ".";

const t = new Telegram({
    token: "",
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
})

t.on("update", (e) => {
    console.log(e);
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
import { Telegram, States, Message } from ".";

const t = new Telegram({
    token: "5145270511:AAGloYqT2qiXvB_XzNL4EdlNQckHX9dDnSA",
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
    console.log(e);
})

t.on("update", (e) => {
    console.log(e);
})

t.start();

async function start(client: Telegram, event: Message) {
    client.request("sendMessage", { text: "Started!", chat_id: event.chat.id })
    return "menu";
}

async function finish(client: Telegram, event: Message) {
    client.request("sendMessage", { text: "Nice!", chat_id: event.chat.id })
}

async function newStateExecute(newState: string) {
    console.log(`New state!: ${newState}`);
}
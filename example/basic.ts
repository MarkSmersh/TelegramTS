import {
    Telegram,
    State,
    ReplyMarkup,
    ReplyButton,
    ReplyRemove,
    Message,
} from "../src";

const t = new Telegram({
    token: "",
    state: new State({
        events: {
            default: [
                {
                    type: "command",
                    data: "/start",
                    function: start,
                },
            ],
            menu: [
                {
                    type: "message",
                    data: "finish",
                    function: finish,
                },
                {
                    type: "message",
                    data: "default",
                    function: other,
                },
            ],
        },
        config: {
            states: {},
            onStateUpdate: newStateExecute,
        },
    }),
});

t.on("start", (e) => {
    console.log(`Bot ${e.first_name} started!`);
});

t.on("update", (e) => {
    console.log(e);
});

t.on("error", (e) => {
    console.log(`Inside client occured error: ${e.description}`);
});

t.start();

async function start(client: Telegram, event: Message) {
    await event.reply({
        text: "Started!",
        reply_markup: ReplyMarkup(
            { resizeKeyboard: true },
            [ReplyButton({ text: "finish" })],
            [ReplyButton({ text: "finish" }), ReplyButton({ text: "finish" })]
        ),
    });
    return "menu";
}

async function finish(client: Telegram, event: Message) {
    await event.reply({
        text: "Finish!",
        reply_markup: ReplyRemove({}),
    });
}

async function other(client: Telegram, event: Message) {
    if (event.voice) {
        await event.voice.download();
        await event.reply({ text: "Some audio downloaded!" });
        return;
    }

    await event.reply({ text: event.text });
}

async function newStateExecute(newState: string) {
    console.log(`New state!: ${newState}`);
}

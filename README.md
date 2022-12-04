![telegramts-01](https://user-images.githubusercontent.com/82462033/205465371-fa3237e9-a793-41a9-9f6b-dcd2ddcb89d2.png)

# About
TelegramTS is low-weight client for telegram bots.

### Why I should use this?
- Low-weight
- Has own state-machine for users
- Events
- Built-in function

### To do

- [x] Basic TelegramBot client
- [x] State-machine
- [x] Add keyboard constructor
- [ ] Create types for antire telegram api
- [ ] In progress...

# Instalation

via npm:

```sh-session
npm install @marksmersh/telegramts
```

# Example
```ts
import { Telegram, States, Message, ReplyMarkup, ReplyButton, ReplyRemove } from ".";

const t = new Telegram({
    token: "your token here",
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
        states: {}, // Record of states (ex you can sync states from database)
        onStateUpdate: newStateExecute // Callback function, that works, when states was changed
    })
})

t.once("start", (e) => {
    console.log(`Bot ${e.first_name} started!`);
})

t.once("load", () => {
  // You can insert here anything, that need to load before client starts. For example auth and sync database
})

t.start();

async function start(client: Telegram, event: Message) {
    client.request("sendMessage", { text: "Started!", chat_id: event.chat.id, 
        reply_markup: ReplyMarkup({ resizeKeyboard: true }, [
            ReplyButton({ text: "finish" })
        ], [
            ReplyButton({ text: "finish" }), ReplyButton({ text: "finish" })
        ])})
    return "menu"; // As an analog, can be used client.States.update()
}

async function finish(client: Telegram, event: Message) {
    client.request("sendMessage", { text: "Finish!", chat_id: event.chat.id,
        reply_markup: ReplyRemove({})})
}

async function newStateExecute(newState: string) {
    console.log(`New state!: ${newState}`);
}
```

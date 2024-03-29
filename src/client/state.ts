import { EventTypeModel, EventModel, FunctionModel } from "../types";

export class State {
    private events: Record<string, EventModel[]>;
    public states: Record<number, string>;
    private onStateUpdate: ((newState: string, id: number) => void) | undefined;

    public constructor({
        events,
        config,
    }: {
        events: Record<string, EventModel[]>;
        config?: {
            states?: Record<number, string>;
            onStateUpdate?: (newState: string, id: number) => void;
        };
    }) {
        this.events = events;
        this.states = config?.states || {};
        this.onStateUpdate = config?.onStateUpdate;
    }

    public async filter<
        KS extends string | "default",
        KT extends EventModel["type"],
        KE extends EventTypeModel[KT]
    >(
        state: KS, // "default"
        type: KT, // "callback" | "command" | "message"
        data: KE, // actually event (using as key)
        args: Parameters<FunctionModel> // (event, event.message | event.callback)
    ): Promise<string | undefined> {
        let curEvent = this.events[state];

        if (curEvent) {
            let event = curEvent.find(
                (event) => event.type == type && event.data == data
            );
            if (event) return (await event.function(...args)) || undefined;

            event = curEvent.find(
                (event) => event.type == type && event.data == "default"
            );
            if (event) return (await event.function(...args)) || undefined;
        }
    }

    public update(id: number, state: string): string {
        if (this.states[id] !== state) {
            this.states[id] = state;
            if (this.onStateUpdate) {
                this.onStateUpdate(state, id);
            }
        }
        return state;
    }

    public set(states: { id: number; state: string }[]) {
        states.forEach((s) => {
            this.states[s.id] = s.state;
        });
    }
}

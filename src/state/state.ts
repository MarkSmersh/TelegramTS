import { EventTypeModel, EventModel, FunctionModel } from "../types/events";

export default class State {
    private events: Record<string, EventModel[]>;
    public states: Record<number, string>;
    private onStateUpdate: ((newState: string) => void) | undefined 

    public constructor(
        events: Record<string, EventModel[]>,
        config?: {
            states?: Record<number, string>,
            onStateUpdate?: (newState: string) => void 
        }
    ) {
        this.events = events;
        this.states = config?.states || {};
        this.onStateUpdate = config?.onStateUpdate;
    }

    public async filter
    <
        KS extends string | "default",
        KT extends EventModel["type"],
        KE extends EventTypeModel[KT],
    >(
        state: KS, // "default"
        type: KT, // "callback" | "command" | "message"
        data: KE, // actually event (using as key)
        args: Parameters<FunctionModel> // (event, event.message | event.callback)
    ): Promise<string | undefined> {
        let curEvent = this.events[state];
    
        if (curEvent) {
            let event = curEvent.find((event) => event.type == type && event.data == data);
            if (event) return (await event.function(...args)) || state;

            event = curEvent.find((event) => event.type == type && event.data == "default");
            if (event) return (await event.function(...args)) || state;
        }
    }

    public update (id: number, state: string): string {
        if (this.states[id] !== state) {
            this.states[id] = state;
            if (this.onStateUpdate) {
                this.onStateUpdate(state);
            }
        }
        return this.states[id];
    }
}
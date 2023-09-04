import { ResponseEvents } from "../types";
import { EventEmitter } from "events";

export class TelegramEventEmitter extends EventEmitter {
  public on<K extends keyof ResponseEvents>(eventName: K, listener: (...args: ResponseEvents[K]) => void): this {
      super.on(eventName, (...args: any[]) => {
          listener(...(args as ResponseEvents[K]));
      });
      return this;
  }

  public once<K extends keyof ResponseEvents>(eventName: K, listener: (...args: ResponseEvents[K]) => void): this {
      super.once(eventName, (...args: any[]) => {
          listener(...(args as ResponseEvents[K]));
      });
      return this;
  }
    
  public emit<K extends keyof ResponseEvents>(event: K, ...args: ResponseEvents[K]): boolean {
      return super.emit(event, ...args);
  }

  public off<K extends keyof ResponseEvents>(eventName: K, listener: (...args: ResponseEvents[K]) => void): this {
      super.off(eventName, (...args: any[]) => {
          listener(...(args as ResponseEvents[K]));
      });
      return this;
  }

  public removeAllListeners<K extends keyof ResponseEvents>(event?: K): this {
      super.removeAllListeners(event);
      return this;
  }
}
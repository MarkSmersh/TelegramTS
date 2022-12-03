import { ResponseEvents } from "./requests";

declare module 'node:events' {
    class EventEmitter {
      // Add type overloads for client events.
      // Thanks for DiscordJS, that teached me this technik
  
      public on<K extends keyof ResponseEvents>(eventName: K, listener: (...args: ResponseEvents[K]) => void): this;
  
      public once<K extends keyof ResponseEvents>(event: K, listener: (...args: ResponseEvents[K]) => void): this;
      
      public emit<K extends keyof ResponseEvents>(event: K, ...args: ResponseEvents[K]): boolean;
  
      public off<K extends keyof ResponseEvents>(event: K, listener: (...args: ResponseEvents[K]) => void): this;
  
      public removeAllListeners<K extends keyof ResponseEvents>(event?: K): this;
    }
}

export {}
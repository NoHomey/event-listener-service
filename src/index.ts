export interface EventListenerImplementation {
    addListener: (eventName: string, listener: (event?: any) => void, ...additional: any[]) => void;
    removeListener: (eventName: string, listener: (event?: any) => void, ...additional: any[]) => void;
}

export interface EventListenerRegisterdListener {
    eventName: string;
    listener: (event?: any) => void;
}

interface Emit {
    eventName: string;
    emitted: any;
}

namespace constants {
    export const minusOne: number = -1;
    export const zero: number = 0;
    export const one: number = 1;
}

export class EventListenerService {
    private static implementation: EventListenerImplementation;
    private static registered: EventListenerRegisterdListener[] = [];

    private static findIndexOf(wanted: EventListenerRegisterdListener): number {
        const { registered } = EventListenerService;
        for(let index: number = constants.zero; index < registered.length; ++index) {
            if((wanted.eventName === registered[index].eventName) && (wanted.listener === registered[index].listener)) {
                return index;
            }
        }

        return constants.minusOne;
    }

    public static useWithoutImplementation(): void {
        EventListenerService.implementation = null;
    }

    public static setImplementation(implementation: EventListenerImplementation): void {
        const { implementation: previus, registered } = EventListenerService;
        let listener: EventListenerRegisterdListener;
        if(previus && ((previus.addListener !== implementation.addListener) || (previus.removeListener !== implementation.removeListener))) {
            while(registered.length) {
                listener = registered[registered.length - constants.one];
                previus.removeListener(listener.eventName, listener.listener);
                registered.pop();
            }
        }
        EventListenerService.implementation = implementation;
    }

    public static addListener(eventName: string, listener: (event?: any) => void, ...additional: any[]): void {
        const { implementation, findIndexOf } = EventListenerService;
        const register: EventListenerRegisterdListener = { eventName: eventName, listener: listener };
        if(findIndexOf(register) === constants.minusOne) {
            EventListenerService.registered.push(register);
            if(implementation !== null) implementation.addListener(eventName, listener, ...additional);
        }
    }

    public static emit(eventName: string, emitted?: any): void {
        for(let listener of EventListenerService.registered) {
            if(listener.eventName === eventName) {
                emitted ? listener.listener(emitted) : listener.listener();
            }
        }
    }

    public static removeListener(eventName: string, listener: (event?: any) => void, ...additional: any[]): void {
        const { implementation } = EventListenerService;
        const index: number = EventListenerService.findIndexOf({ eventName: eventName, listener: listener });
        if(index !== constants.minusOne) {
            EventListenerService.registered.splice(index, constants.one);
            if(implementation !== null) implementation.removeListener(eventName, listener, ...additional);
        }
    }
};

export default EventListenerService;
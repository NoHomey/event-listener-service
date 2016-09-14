export interface EventListenerImplementation {
    addListener: (event: string, listener: Function, ...additional: any[]) => void;
    removeListener: (event: string, listener: Function, ...additional: any[]) => void;
}

export interface EventListenerRegisterdListener {
    event: string;
    listener: Function;
}

interface Emit {
    event: string;
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

    private static emitToLisener(registered: EventListenerRegisterdListener): void {
        const emit: Emit = this as any;
        if(emit.event === registered.event) {
            emit.emitted ? registered.listener(emit.emitted) : registered.listener();
        }
    }

    private static findIndexOf(wanted: EventListenerRegisterdListener): number {
        const { registered } = EventListenerService;
        for(let index: number = constants.zero; index < registered.length; ++index) {
            if((wanted.event === registered[index].event) && (wanted.listener === registered[index].listener)) {
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
                previus.removeListener(listener.event, listener.listener);
                registered.pop();
            }
        }
        EventListenerService.implementation = implementation;
    }

    public static addListener(event: string, listener: Function, ...additional: any[]): void {
        const { implementation, findIndexOf } = EventListenerService;
        const register: EventListenerRegisterdListener = { event: event, listener: listener };
        if(findIndexOf(register) === constants.minusOne) {
            EventListenerService.registered.push(register);
            if(implementation !== null) implementation.addListener(event, listener, ...additional);
        }
    }

    public static emit(event: string, emitted?: any): void {
        const { registered, emitToLisener } = EventListenerService;
        registered.forEach(emitToLisener, { event: event, emitted: emitted });
    }

    public static removeListener(event: string, listener: Function, ...additional: any[]): void {
        const { implementation } = EventListenerService;
        const index: number = EventListenerService.findIndexOf({ event: event, listener: listener });
        if(index !== constants.minusOne) {
            EventListenerService.registered.splice(index, constants.one);
            if(implementation !== null) implementation.removeListener(event, listener, ...additional);
        }
    }
};

export default EventListenerService;
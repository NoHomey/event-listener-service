import { EventListenerImplementation, EventListenerService } from './../src';

describe('EventListenerService', () => {
    type PureVoidFn = () => void;
    type MessageListener = (message: string) => void;
    describe('without implementation', () => {
        describe('useWithoutImplementation', () => {
            it('dose not use any internal event registering', () => {
                expect(EventListenerService.useWithoutImplementation).not.toThrow();
            });
        });

        describe('event registering and emitting', () => {
            let listener: jest.Mock<PureVoidFn>;

            beforeEach(() => {
                listener = jest.fn<PureVoidFn>();
                EventListenerService.useWithoutImplementation();
            });

            describe('addListener' , () => {
                it('adds new event listener by using EventListenerService built in only', () => {
                    expect(() => EventListenerService.addListener('listen', listener)).not.toThrow();
                });
            });

            describe('emit', () => {
                it('emits event by using EventListenerService built in to all registered listeners', () => {
                    const second: jest.Mock<PureVoidFn> = jest.fn<PureVoidFn>();
                    EventListenerService.addListener('listen', listener);
                    EventListenerService.addListener('listen', second);
                    EventListenerService.emit('listen');
                    expect(listener).toBeCalled();
                    expect(second).toBeCalled();
                });

                it('can also pass provided event object to all listeners', () => {
                    const first: jest.Mock<MessageListener> = jest.fn<MessageListener>();
                    const second: jest.Mock<MessageListener> = jest.fn<MessageListener>();
                    EventListenerService.addListener('listen', first);
                    EventListenerService.addListener('listen', second);
                    EventListenerService.emit('listen', 'music');
                    expect(first).toBeCalledWith('music');
                    expect(second).toBeCalledWith('music');
                });
            });

            describe('removeListener', () => {
                it('removes given event listener for given event by using EventListenerService built in only', () => {
                    EventListenerService.addListener('listen', listener);
                    expect(() => EventListenerService.removeListener('listen', listener)).not.toThrow();
                    EventListenerService.emit('listen');
                    expect(listener).not.toBeCalled();
                });
            });

            describe('when addListener and removeListener are called multiple times with same event listener combination', () => {
                it('adds, emits and removes listener once when multiple calls with same event listener combination are made ', () => {
                    EventListenerService.addListener('event', listener);
                    EventListenerService.addListener('event', listener);
                    EventListenerService.emit('event');
                    EventListenerService.removeListener('event', listener);
                    EventListenerService.removeListener('event', listener);
                    expect(listener.mock.calls.length).toBe(1);
                });
            });
        });
    });

    describe('with setted implementation', () => {
        describe('setImplementation', () => {
            it('sets implementation for registering events internally', () => {
                const implementation: EventListenerImplementation = {
                    addListener: jest.fn(),
                    removeListener: jest.fn()
                };
                expect(() => EventListenerService.setImplementation(implementation)).not.toThrow();
            });
        });

        describe('event registering', () => {
            let implementation: EventListenerImplementation;
            let listener: jest.Mock<PureVoidFn>;

            beforeEach(() => {
                implementation = {
                    addListener: jest.fn(),
                    removeListener: jest.fn()
                };
                listener = jest.fn<PureVoidFn>();
                EventListenerService.setImplementation(implementation);
            });

            describe('addListener' , () => {
                it('adds new event listener by registering with EventListenerService built in and calls implementation.addListener', () => {
                    EventListenerService.addListener('listen', listener);
                    expect(implementation.addListener).toBeCalledWith('listen', listener);
                });
            });

            describe('emit', () => {
                it('emits event by using EventListenerService built in to all registered listeners', () => {
                    const second: jest.Mock<PureVoidFn> = jest.fn<PureVoidFn>();
                    EventListenerService.addListener('listen', listener);
                    EventListenerService.addListener('listen', second);
                    EventListenerService.emit('listen');
                    expect(listener).toBeCalled();
                    expect(second).toBeCalled();
                });

                it('can also pass provided event object to all listeners', () => {
                    const first: jest.Mock<MessageListener> = jest.fn<MessageListener>();
                    const second: jest.Mock<MessageListener> = jest.fn<MessageListener>();
                    EventListenerService.addListener('listen', first);
                    EventListenerService.addListener('listen', second);
                    EventListenerService.emit('listen', 'music');
                    expect(first).toBeCalledWith('music');
                    expect(second).toBeCalledWith('music');
                });
            });

            describe('removeListener', () => {
                it('removes given event listener for given event from EventListenerService built in and calls implementation.removeListener', () => {
                    EventListenerService.addListener('listen', listener);
                    EventListenerService.removeListener('listen', listener);
                    expect(implementation.removeListener).toBeCalledWith('listen', listener);
                    EventListenerService.emit('listen');
                    expect(listener).not.toBeCalled();
                });
            });

            describe('when addListener and removeListener are called multiple times with same event listener combination', () => {
                it('adds, emits and removes listener once when multiple calls with same event listener combination are made ', () => {
                    EventListenerService.addListener('event', listener);
                    EventListenerService.addListener('event', listener);
                    EventListenerService.emit('event');
                    EventListenerService.removeListener('event', listener);
                    EventListenerService.removeListener('event', listener);
                    expect((implementation.addListener as jest.Mock<PureVoidFn>).mock.calls.length).toBe(1);
                    expect(listener.mock.calls.length).toBe(1);
                    expect((implementation.removeListener as jest.Mock<PureVoidFn>).mock.calls.length).toBe(1);
                });
            });
        });

        describe('when implementation changes', () => {
            let implementation: EventListenerImplementation;
            let listener: jest.Mock<PureVoidFn>;

            beforeEach(() => {
                implementation = {
                    addListener: jest.fn(),
                    removeListener: jest.fn()
                };
                listener = jest.fn<PureVoidFn>();
                EventListenerService.setImplementation(implementation);
                EventListenerService.addListener('listen', listener);
            });

            it('removes all listeners using previus implementation.removeListener when implementation.addListener changes', () => {
                const changed: EventListenerImplementation = {
                    addListener: jest.fn(),
                    removeListener: implementation.removeListener
                };
                EventListenerService.setImplementation(changed);
                EventListenerService.emit('listen');
                expect(listener).not.toBeCalled();
                expect(implementation.removeListener).toBeCalledWith('listen', listener);
            });

            it('removes all listeners using previus implementation.removeListener when implementation.removeListener changes', () => {
                const newRemover: jest.Mock<EventListenerImplementation> = jest.fn<EventListenerImplementation>();
                const changed: EventListenerImplementation = {
                    addListener: implementation.addListener,
                    removeListener: newRemover
                };
                EventListenerService.setImplementation(changed);
                EventListenerService.emit('listen');
                expect(listener).not.toBeCalled();
                expect(implementation.removeListener).toBeCalledWith('listen', listener);
            });

            it('removes all listeners using previus implementation.removeListener when implementation changes', () => {
                const newRemover: jest.Mock<EventListenerImplementation> = jest.fn<EventListenerImplementation>();
                const changed: EventListenerImplementation = {
                    addListener: jest.fn(),
                    removeListener: newRemover
                };
                const second: jest.Mock<MessageListener> = jest.fn<MessageListener>();
                EventListenerService.addListener('message', second);
                EventListenerService.setImplementation(changed);
                EventListenerService.emit('listen');
                EventListenerService.emit('message', 'bottle');
                expect(listener).not.toBeCalled();
                expect(second).not.toBeCalled();
                expect(implementation.removeListener).toBeCalledWith('listen', listener);
                expect(implementation.removeListener).toBeCalledWith('message', second);
            });
        });
    });
});
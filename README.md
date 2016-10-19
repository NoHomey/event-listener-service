# event-listener-service
Universal Event Litener with testability built in

[![npm version](https://badge.fury.io/js/event-listener-service.svg)](https://badge.fury.io/js/event-listener-service)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NoHomey/event-listener-service)
[![Build Status](https://semaphoreci.com/api/v1/nohomey/event-listener-service/branches/master/badge.svg)](https://semaphoreci.com/nohomey/event-listener-service)
[![Code Climate](https://codeclimate.com/github/NoHomey/event-listener-service/badges/gpa.svg)](https://codeclimate.com/github/NoHomey/event-listener-service)
[![Test Coverage](https://codeclimate.com/github/NoHomey/event-listener-service/badges/coverage.svg)](https://codeclimate.com/github/NoHomey/event-listener-service/coverage)
[![Issue Count](https://codeclimate.com/github/NoHomey/event-listener-service/badges/issue_count.svg)](https://codeclimate.com/github/NoHomey/event-listener-service)
![TypeScript](https://img.shields.io/badge/%3C%20%2F%3E-TypeScript-blue.svg)
![Typings](https://img.shields.io/badge/typings-%E2%9C%93-brightgreen.svg)

# Install

Install with npm:

```bash
$ npm install event-listener-service
```

[![NPM](https://nodei.co/npm/event-listener-service.png?downloads=true&stars=true)](https://nodei.co/npm/event-listener-service/)

# Api

## public static useWithoutImplementation(): void

Declare usage without internal event registering implementation

## public static setImplementation(implementation: EventListenerImplementation): void

Set internal event registering implementation

## public static addListener(eventName: string, listener: (event?: any) => void, ...additional: any[]): void

Add EventListener

## public static emit(eventName: string, emitted?: any): void

Emit event using built in event emiting

## public static removeListener(eventName: string, listener: (event?: any) => void, ...additional: any[]): void

Remove EventListener

# Usage

## As stand alone EventListener

```javascript
import EventListenerService from 'event-listener-service';

// Declare usage without internal event registering implementation
EventListenerService.useWithoutImplementation();

function onSomeEvent(event) {
  console.log('some-event', event);
}

// Adding EventLisner
EventListenerService.addListener('some-event', onSomeEvent);

// Emiting Events 
EventListenerService.emit('some-event', { rand: 9 });

// Removing EventLisnter
EventListenerService.removeListener('some-event', onSomeEvent);
```

## For listening events on DOM Nodes in the Browser

```javascript
import EventListenerService from 'event-listener-service';

// Seting internal event registering implementation
EventListenerService.setImplementation({
    addListener: window.addEventListener.bind(window),
    removeListener: window.removeEventListener.bind(window)
});

function onResize() {
  /* ... */
}

// Adding EventLisner
EventListenerService.addListener('resize', onResize, false);

// Removing EventLisnter
EventListenerService.removeListener('resize', onResize, false);

// Optionaly you can manually trigger event listeners in your tests or when you need to fully simulate event 
EventListenerService.emit('resize', /* [event object] */);
```

## As universal EventListener API

```javascript

// Set internal implementation for registering event listeners

EventListenerService.setImplementation({
    addListener: /* (eventName: string, listener: (event?: any) => void, ...additional: any[]) => void */
    removeListener: /* (eventName: string, listener: (event?: any) => void, ...additional: any[]) => void */
});

// And than use addListener and removeListner

EventListnerService.addListener(eventName: string, listener: (event?: any) => void, ...additional: any[]);

EventListnerService.removeListener(eventName: string, listener: (event?: any) => void, ...additional: any[]);
```

# Testing

1. `npm install`

2. `npm test`

# Contributing

1. `npm install`

2. Make changes

3. If necessary add some tests to `__tests__`

4. `npm test`

5. Make a Pull Request
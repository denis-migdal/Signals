# Signals
Lightweight signal libs used as dependancies for my projects.

## Signals

## Events

```ts
import Event from "./?"

const ev = new Event("name"); // name is used for debug.
ev.listen( () => {...} ); // unlisten to stop listening
ev.trigger();
```

### (Un)subscribe(To|From)

- TODO...

### EventListener

Recommanded to listen events :
```ts
import Event from "./?"
import EventListener from "./?"

const ev = new Event("name");
const l  = new EventListener(ev, () => {});

// called twice.
ev.trigger();
ev.trigger();
```

```ts
import Event from "./?"
import EventListener from "./?"

const ev = new Event("name");
const l  = new EventListener(ev, () => {}, {once: true});

// called once.
ev.trigger();
ev.trigger();
```

```ts
import Event from "./?"
import EventListener from "./?"

const ev = new Event("name");
const l  = new EventListener(ev, () => {}, {ack: true});

// called twice.
ev.trigger();
ev.trigger(); // not called.
l.ack();
ev.trigger();
ev.trigger(); // not called.
```
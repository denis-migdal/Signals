// (b) => (b.start() / b.end() for critical section.)

import Event         from "../src/Event";
import EventListener from "../src/EventListener";

import L_Event         from "../src/legacy/SignalEvent";
import L_EventListener from "../src/legacy/SignalEventListener";

Deno.bench("Signal",
          { group: "EventChain (setup)", baseline: true },
          async () => {
  
  const chain = new Array(10);
  chain[0] = new Event();
  for(let i = 1; i < chain.length; ++i)
    chain[i] = new Event(chain[i-1]);

  let triggered = false;
  const l  = new EventListener(chain[chain.length-1], () => triggered = true);
});

Deno.bench("LISS",
          { group: "EventChain (setup)", baseline: true },
          async () => {
  
  const chain = new Array(10);
  for(let i = 0; i < chain.length; ++i)
    chain[i] = new L_Event();

  for(let i = chain.length - 1; i > 0; --i) {
    new L_EventListener(chain[i-1], () => chain[i].trigger());
  }

  let triggered = false;
  const l  = new L_EventListener(chain[chain.length-1], () => triggered = true);
});

{
  const chain = new Array(10);
    chain[0] = new Event();
    for(let i = 1; i < chain.length; ++i)
      chain[i] = new Event(chain[i-1]);

    let triggered = false;
    const l  = new EventListener(chain[chain.length-1], () => triggered = true);


  Deno.bench("Signal",
            { group: "EventChain (trigger)", baseline: true },
            async (b) => {
    
    chain[0].trigger();
  });
}
{
  const chain = new Array(10);
  for(let i = 0; i < chain.length; ++i)
    chain[i] = new L_Event();

  for(let i = chain.length - 1; i > 0; --i) {
    new L_EventListener(chain[i-1], () => chain[i].trigger());
  }

  let triggered = false;
  const l  = new EventListener(chain[chain.length-1], () => triggered = true);

  Deno.bench("LISS",
            { group: "EventChain (trigger)", baseline: true },
            async (b) => {
    chain[0].trigger();
  });
}
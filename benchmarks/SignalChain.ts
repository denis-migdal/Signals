import S_Signal  from "../src/Signal";
import L_Signal  from "../src/legacy/Signal";

// simple setup
    // -> 1.13x faster
    // -> 1.26x faster
// Setup       : 1.09x (reversed is 1.26x faster).
// Trigger+read: x7.38
//         prev/nextCallbacks ~15x [le + important]
// Valeur      : 2.35x (access from .value : 3.12x slower).

const N = 40;

function chainS_Signal<T>(n: number) {

    const first = new S_Signal<T>();
    let last = first;

    for(let i = 1; i < n; ++i) {
        let s = new S_Signal<T>();
        s.inputSource = last;
        last = s;
    }

    return {
        first,
        last,
    }
}

function chainRS_Signal<T>(n: number) {

    const last = new S_Signal<T>();
    let first = last;

    for(let i = 1; i < n; ++i) {
        let s = new S_Signal<T>();
        first.inputSource = s;
        first = s;
    }

    return {
        first,
        last,
    }
}

function chainL_Signal<T>(n: number) {

    const first = new L_Signal<T>();
    let last = first;

    for(let i = 1; i < n; ++i) {
        let s = new L_Signal<T>();
        s.source = last;
        last = s;
    }

    return {
        first,
        last,
    }
}

Deno.bench("Signal (reversed)",
          { group: "chain signal (setup)" },
          async () => {
  
    let count = 0;

    const {first, last} = chainRS_Signal<number>(N);

    last.listen( () => ++count );
});
Deno.bench("Signal",
          { group: "chain signal (setup)", baseline: true },
          async () => {
  
    let count = 0;

    const {first, last} = chainS_Signal<number>(N);

    last.listen( () => ++count );
});
Deno.bench("LISS",
          { group: "chain signal (setup)" },
          async () => {
  
    let count = 0;

    const {first, last} = chainL_Signal(N);

    last.listen( () => ++count );
});

{
    let value: number = 0;

    const {first, last} = chainS_Signal<number>(N);

    last.listen( (s) => value += s.value! );

    let count = 0;

    Deno.bench("Signal",
            { group: "chain signal (trigger)", baseline: true },
            async () => {
        first.inputValue = ++count;
    });
}
{
    let value: number = 0;

    const {first, last} = chainL_Signal<number>(N);

    last.listen( () => value += last.value! );

    let count = 0;

    Deno.bench("LISS",
            { group: "chain signal (trigger)" },
            async () => {
        first.value = ++count;
    });
}


{
    let value: number = 0;

    const {first, last} = chainS_Signal<number>(N);
    first.inputValue = 1;

    Deno.bench("Signal Last",
            { group: "chain signal (access value)" },
            async () => {
        value += last.value!;
    });
}
{
    let value: number = 0;

    const {first, last} = chainS_Signal<number>(N);
    first.inputValue = 1;

    Deno.bench("Signal",
            { group: "chain signal (access value)", baseline: true },
            async () => {
        value += first.value!; // first would be given by the callback
    });
}
{
    let value: number = 0;

    const {first, last} = chainL_Signal<number>(N);
    first.value = 1;

    Deno.bench("LISS",
            { group: "chain signal (access value)" },
            async () => {
        value += last.value!;
    });
}
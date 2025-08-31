import S_Signal  from "../src/Signal";
import L_Signal  from "../src/legacy/Signal";

Deno.bench("Signal",
          { group: "Simple signal (setup)", baseline: true },
          async () => {
  
    let count = 0;
    const s = new S_Signal();
    s.listen( () => ++count );
});


Deno.bench("LISS",
          { group: "Simple signal (setup)" },
          async () => {
  
    let count = 0;
    const s = new L_Signal();
    s.listen( () => ++count );
});

{
    let value: number|null = 0;
    const s = new S_Signal<number>();
    s.listen( () => value = s.value );

    let count = 0;

    Deno.bench("Signal",
            { group: "Simple signal (trigger)", baseline: true },
            async () => {
        s.inputValue = ++count;
    });
}
{
    let value: number|null = 0;
    const s = new L_Signal<number>();
    s.listen( () => value = s.value );

    let count = 0;

    Deno.bench("LISS",
            { group: "Simple signal (trigger)" },
            async () => {
        s.value = ++count;
    });
}
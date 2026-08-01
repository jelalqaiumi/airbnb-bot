"use client";

import { useRef, useState } from "react";

/** Ett meddelande i chatten. */
interface Meddelande {
  roll: "gäst" | "bot";
  text: string;
}

export default function ChatPage() {
  const [meddelanden, setMeddelanden] = useState<Meddelande[]>([]);
  const [fraga, setFraga] = useState("");
  const [laddar, setLaddar] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);

  function scrollaNer() {
    // Vänta tills DOM uppdaterats innan vi scrollar.
    requestAnimationFrame(() => {
      listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight });
    });
  }

  async function skicka(e: React.FormEvent) {
    e.preventDefault();
    const text = fraga.trim();
    if (!text || laddar) return;

    // Bygg den nya historiken inklusive gästens fråga och skicka hela.
    const nyHistorik: Meddelande[] = [...meddelanden, { roll: "gäst", text }];
    setMeddelanden(nyHistorik);
    setFraga("");
    setLaddar(true);
    scrollaNer();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meddelanden: nyHistorik }),
      });
      const data = await res.json();
      const svar = res.ok
        ? data.svar
        : data.fel ?? "Något gick fel. Försök igen.";
      setMeddelanden((m) => [...m, { roll: "bot", text: svar }]);
    } catch {
      setMeddelanden((m) => [
        ...m,
        { roll: "bot", text: "Kunde inte nå servern. Kontrollera din anslutning." },
      ]);
    } finally {
      setLaddar(false);
      scrollaNer();
    }
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Fråga om boendet
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Ställ en fråga om incheckning, wifi, parkering och annat praktiskt.
          </p>
        </header>

        <div
          ref={listaRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
        >
          {meddelanden.length === 0 && (
            <p className="py-8 text-center text-zinc-400">
              Skriv din fråga nedan för att börja.
            </p>
          )}
          {meddelanden.map((m, i) => (
            <div
              key={i}
              className={m.roll === "gäst" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.roll === "gäst"
                    ? "max-w-[80%] whitespace-pre-wrap rounded-2xl bg-black px-4 py-2 text-white dark:bg-zinc-50 dark:text-black"
                    : "max-w-[80%] whitespace-pre-wrap rounded-2xl bg-zinc-100 px-4 py-2 text-black dark:bg-zinc-800 dark:text-zinc-100"
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {laddar && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-zinc-500 dark:bg-zinc-800">
                Skriver…
              </div>
            </div>
          )}
        </div>

        <form onSubmit={skicka} className="mt-4 flex gap-2">
          <input
            type="text"
            value={fraga}
            onChange={(e) => setFraga(e.target.value)}
            placeholder="Skriv en fråga…"
            className="flex-1 rounded-full border border-black/[.12] bg-white px-4 py-2 text-black outline-none focus:border-black dark:border-white/[.2] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
          />
          <button
            type="submit"
            disabled={laddar || !fraga.trim()}
            className="rounded-full bg-black px-5 py-2 font-medium text-white transition-opacity disabled:opacity-40 dark:bg-zinc-50 dark:text-black"
          >
            Skicka
          </button>
        </form>
      </main>
    </div>
  );
}

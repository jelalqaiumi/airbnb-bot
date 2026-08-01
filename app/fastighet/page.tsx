import type { Metadata } from "next";
import { fastighet } from "@/lib/fastighet";

export const metadata: Metadata = {
  title: `Gästinformation – ${fastighet.namn}`,
  description: "Praktisk information för dig som gäst under din vistelse.",
};

/** Återanvändbart kort med rubrik och innehåll. */
function Kort({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
      <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
        {titel}
      </h2>
      <div className="text-zinc-600 dark:text-zinc-400">{children}</div>
    </section>
  );
}

/** En rad med etikett och värde, t.ex. "Tid: 15:00". */
function Rad({ etikett, varde }: { etikett: string; varde: string }) {
  return (
    <p className="leading-7">
      <span className="font-medium text-black dark:text-zinc-200">
        {etikett}:
      </span>{" "}
      {varde}
    </p>
  );
}

export default function FastighetPage() {
  const {
    namn,
    adress,
    incheckning,
    utcheckning,
    wifi,
    parkering,
    husregler,
    kontaktVidProblem,
    vanligaFragor,
  } = fastighet;

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {namn}
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {adress}
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <Kort titel="Incheckning">
            <Rad etikett="Tid" varde={incheckning.tid} />
            <p className="mt-2 leading-7">{incheckning.instruktioner}</p>
          </Kort>

          <Kort titel="Utcheckning">
            <Rad etikett="Tid" varde={utcheckning.tid} />
            <p className="mt-2 leading-7">{utcheckning.instruktioner}</p>
          </Kort>

          <Kort titel="Wifi">
            <Rad etikett="Nätverk" varde={wifi.natverk} />
            <Rad etikett="Lösenord" varde={wifi.losenord} />
          </Kort>

          <Kort titel="Parkering">
            <Rad
              etikett="Tillgänglig"
              varde={parkering.tillganglig ? "Ja" : "Nej"}
            />
            <p className="mt-2 leading-7">{parkering.beskrivning}</p>
          </Kort>

          <Kort titel="Husregler">
            <ul className="list-disc space-y-1 pl-5 leading-7">
              {husregler.map((regel) => (
                <li key={regel}>{regel}</li>
              ))}
            </ul>
          </Kort>

          <Kort titel="Kontakt vid problem">
            <Rad etikett="Namn" varde={kontaktVidProblem.namn} />
            <p className="leading-7">
              <span className="font-medium text-black dark:text-zinc-200">
                Telefon:
              </span>{" "}
              <a
                href={`tel:${kontaktVidProblem.telefon.replace(/\s/g, "")}`}
                className="underline underline-offset-2"
              >
                {kontaktVidProblem.telefon}
              </a>
            </p>
            <p className="leading-7">
              <span className="font-medium text-black dark:text-zinc-200">
                E-post:
              </span>{" "}
              <a
                href={`mailto:${kontaktVidProblem.epost}`}
                className="underline underline-offset-2"
              >
                {kontaktVidProblem.epost}
              </a>
            </p>
          </Kort>

          <Kort titel="Vanliga frågor">
            <div className="flex flex-col gap-4">
              {vanligaFragor.map((f) => (
                <div key={f.fraga}>
                  <p className="font-medium text-black dark:text-zinc-200">
                    {f.fraga}
                  </p>
                  <p className="mt-1 leading-7">{f.svar}</p>
                </div>
              ))}
            </div>
          </Kort>
        </div>
      </main>
    </div>
  );
}

import Anthropic from "@anthropic-ai/sdk";
import { fastighet } from "@/lib/fastighet";

// Skapa klienten en gång. Nyckeln läses automatiskt från miljövariabeln
// ANTHROPIC_API_KEY (definierad i .env.local och laddad av Next på servern).
const anthropic = new Anthropic();

/** Bygger en textrepresentation av fastigheten till systemprompten. */
function byggFastighetsKontext(): string {
  const f = fastighet;
  return [
    `Namn: ${f.namn}`,
    `Adress: ${f.adress}`,
    `Incheckning: ${f.incheckning.tid} – ${f.incheckning.instruktioner}`,
    `Utcheckning: ${f.utcheckning.tid} – ${f.utcheckning.instruktioner}`,
    `Wifi-nätverk: ${f.wifi.natverk}`,
    `Wifi-lösenord: ${f.wifi.losenord}`,
    `Parkering: ${f.parkering.tillganglig ? "Ja" : "Nej"} – ${f.parkering.beskrivning}`,
    `Husregler:\n${f.husregler.map((r) => `- ${r}`).join("\n")}`,
    `Kontakt vid problem: ${f.kontaktVidProblem.namn}, tel ${f.kontaktVidProblem.telefon}, e-post ${f.kontaktVidProblem.epost}`,
    `Vanliga frågor:\n${f.vanligaFragor
      .map((v) => `- Fråga: ${v.fraga}\n  Svar: ${v.svar}`)
      .join("\n")}`,
  ].join("\n");
}

const SYSTEM_PROMPT = `Du är en vänlig assistent för Airbnb-gäster på fastigheten nedan. \
Svara på svenska, kortfattat och hjälpsamt.

Viktiga regler:
- Svara ENBART utifrån informationen om fastigheten nedan.
- Om svaret inte finns i informationen, säg vänligt att du inte har den uppgiften \
och hänvisa gästen till att kontakta värden på ${fastighet.kontaktVidProblem.telefon}.
- Hitta aldrig på fakta, priser, koder eller uppgifter som inte står nedan.

FASTIGHETSINFORMATION:
${byggFastighetsKontext()}`;

/** Ett meddelande i konversationen, som det skickas från klienten. */
interface InkommandeMeddelande {
  roll?: unknown;
  text?: unknown;
}

/** En begäran från klienten med hela konversationshistoriken. */
interface ChattBegaran {
  meddelanden?: unknown;
}

export async function POST(request: Request) {
  let data: ChattBegaran;
  try {
    data = await request.json();
  } catch {
    return Response.json({ fel: "Ogiltig begäran." }, { status: 400 });
  }

  if (!Array.isArray(data.meddelanden) || data.meddelanden.length === 0) {
    return Response.json({ fel: "Ingen konversation angavs." }, { status: 400 });
  }

  // Översätt klientens meddelanden till Anthropics format (user/assistant).
  const messages: Anthropic.MessageParam[] = [];
  for (const m of data.meddelanden as InkommandeMeddelande[]) {
    const text = typeof m.text === "string" ? m.text.trim() : "";
    if (!text) continue;
    if (m.roll === "gäst") {
      messages.push({ role: "user", content: text });
    } else if (m.roll === "bot") {
      messages.push({ role: "assistant", content: text });
    }
  }

  // API:et kräver att konversationen börjar och slutar med ett gästmeddelande.
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ fel: "Ingen giltig fråga angavs." }, { status: 400 });
  }

  try {
    const svar = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = svar.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return Response.json({ svar: text });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { fel: "API-nyckeln saknas eller är ogiltig. Kontrollera ANTHROPIC_API_KEY i .env.local." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { fel: "För många förfrågningar just nu. Försök igen om en stund." },
        { status: 429 },
      );
    }
    const meddelande =
      error instanceof Anthropic.APIError ? error.message : "Okänt fel.";
    return Response.json({ fel: `Något gick fel: ${meddelande}` }, { status: 500 });
  }
}

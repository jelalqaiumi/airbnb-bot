/**
 * Strukturerad information om en fastighet som visas för Airbnb-gäster.
 *
 * Fyll i platshållartexten nedan med uppgifter för din specifika fastighet.
 * All text är på svenska och tänkt att kunna visas direkt för gästen.
 */

/** In- och utcheckningstider samt eventuella instruktioner. */
export interface Incheckning {
  /** Tidigast tillåtna incheckningstid, t.ex. "15:00". */
  tid: string;
  /** Instruktioner för hur gästen tar sig in, t.ex. kodlås eller nyckelskåp. */
  instruktioner: string;
}

export interface Utcheckning {
  /** Senast tillåtna utcheckningstid, t.ex. "11:00". */
  tid: string;
  /** Vad gästen ska göra innan avresa, t.ex. lämna nycklar, släcka lampor. */
  instruktioner: string;
}

/** Uppgifter för att ansluta till fastighetens trådlösa nätverk. */
export interface Wifi {
  /** Nätverkets namn (SSID). */
  natverk: string;
  /** Lösenord till nätverket. */
  losenord: string;
}

/** Information om var och hur gästen kan parkera. */
export interface Parkering {
  /** Finns parkering tillgänglig? */
  tillganglig: boolean;
  /** Beskrivning av parkeringsmöjligheter och eventuella avgifter. */
  beskrivning: string;
}

/** En kontaktperson som gästen kan nå vid problem. */
export interface Kontakt {
  /** Namn på kontaktpersonen. */
  namn: string;
  /** Telefonnummer, gärna i internationellt format (+46 …). */
  telefon: string;
  /** E-postadress. */
  epost: string;
}

/** En enskild fråga och tillhörande svar i FAQ-listan. */
export interface VanligFraga {
  /** Själva frågan, formulerad ur gästens perspektiv. */
  fraga: string;
  /** Svaret på frågan. */
  svar: string;
}

/** Den kompletta datamodellen för en fastighet. */
export interface Fastighet {
  /** Fastighetens namn eller titel på annonsen. */
  namn: string;
  /** Fullständig adress till fastigheten. */
  adress: string;
  incheckning: Incheckning;
  utcheckning: Utcheckning;
  wifi: Wifi;
  parkering: Parkering;
  /** Lista med husregler som gästen förväntas följa. */
  husregler: string[];
  /** Kontaktuppgifter att använda om något går fel under vistelsen. */
  kontaktVidProblem: Kontakt;
  /** Vanliga frågor och svar. */
  vanligaFragor: VanligFraga[];
}

/**
 * Platshållardata. Byt ut varje fält mot riktiga uppgifter för din fastighet
 * innan informationen visas för gäster.
 */
export const fastighet: Fastighet = {
  namn: "[Fastighetens namn]",
  adress: "[Gatuadress], [Postnummer] [Ort]",

  incheckning: {
    tid: "15:00",
    instruktioner:
      "Incheckning sker med kodlås vid ytterdörren. Koden är [XXXX] och skickas " +
      "även via meddelande dagen före ankomst. Kontakta oss om du blir försenad.",
  },

  utcheckning: {
    tid: "11:00",
    instruktioner:
      "Lämna nycklarna i nyckelskåpet, släck alla lampor och stäng fönstren. " +
      "Diska eller starta diskmaskinen och ta med dig soporna till [sopstation].",
  },

  wifi: {
    natverk: "[Namn på wifi-nätverk]",
    losenord: "[Wifi-lösenord]",
  },

  parkering: {
    tillganglig: true,
    beskrivning:
      "Gratis parkering finns på gården/parkeringsplats nr [X]. Alternativt " +
      "finns gatuparkering på [gatunamn], avgift [pris] per timme mellan kl. [tid].",
  },

  husregler: [
    "Rökning är inte tillåten inomhus.",
    "Inga husdjur utan överenskommelse i förväg.",
    "Inga fester eller evenemang.",
    "Var vänlig och respektera grannarna, tystnad gäller mellan kl. 22:00 och 07:00.",
    "Max [antal] gäster får övernatta i bostaden.",
  ],

  kontaktVidProblem: {
    namn: "[Värdens namn]",
    telefon: "+46 [XX XXX XX XX]",
    epost: "[din-epost@exempel.se]",
  },

  vanligaFragor: [
    {
      fraga: "Hur ansluter jag till wifi?",
      svar:
        "Välj nätverket [Namn på wifi-nätverk] i dina inställningar och ange " +
        "lösenordet [Wifi-lösenord].",
    },
    {
      fraga: "Var finns närmaste matbutik?",
      svar:
        "Närmaste livsmedelsbutik är [butiksnamn] på [gatunamn], cirka [X] " +
        "minuters promenad från bostaden.",
    },
    {
      fraga: "Kan jag checka in tidigare eller checka ut senare?",
      svar:
        "Hör av dig till oss så försöker vi lösa det i mån av tillgänglighet. " +
        "Det kan tillkomma en avgift.",
    },
    {
      fraga: "Vad gör jag om något går sönder eller slutar fungera?",
      svar:
        "Kontakta oss så snart som möjligt på telefon +46 [XX XXX XX XX] så " +
        "hjälper vi dig. Vid akuta situationer, ring 112.",
    },
  ],
};

export default fastighet;

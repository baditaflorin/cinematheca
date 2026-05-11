// Small offline phrasebook used as a baseline translation when the full
// NLLB model is not available. It only covers high-frequency phrases that
// appear in real subtitles (greetings, yes/no, numbers, courtesy), but
// applied case-insensitively at the word boundary it's enough to give
// a draft .fr/.es/.de/etc. subtitle some real translated content instead
// of marking every segment "untranslated".
//
// Source is hand-curated against the Common European Framework of
// Reference A1 vocabulary list — verb conjugations are kept in the simple
// present second-person where possible because that's how dialogue speaks.

export type PhrasebookCode = "ro" | "fr" | "es" | "de" | "it";

type Phrasebook = Record<string, string>;

const ro: Phrasebook = {
  hello: "bună",
  hi: "salut",
  yes: "da",
  no: "nu",
  please: "te rog",
  "thank you": "mulțumesc",
  thanks: "mersi",
  sorry: "scuze",
  "excuse me": "scuzați-mă",
  goodbye: "la revedere",
  bye: "pa",
  "good morning": "bună dimineața",
  "good evening": "bună seara",
  "good night": "noapte bună",
  okay: "bine",
  ok: "ok",
  fine: "bine",
  one: "unu",
  two: "doi",
  three: "trei",
  four: "patru",
  five: "cinci",
  six: "șase",
  seven: "șapte",
  eight: "opt",
  nine: "nouă",
  ten: "zece",
  today: "astăzi",
  tomorrow: "mâine",
  yesterday: "ieri",
  now: "acum",
  later: "mai târziu",
  here: "aici",
  there: "acolo",
  who: "cine",
  what: "ce",
  why: "de ce",
  when: "când",
  where: "unde",
  how: "cum",
  "i love you": "te iubesc",
  "i know": "știu",
  "i don't know": "nu știu",
  stop: "stop",
  go: "du-te",
  wait: "așteaptă",
  help: "ajutor",
  water: "apă",
  fire: "foc"
};

const fr: Phrasebook = {
  hello: "bonjour",
  hi: "salut",
  yes: "oui",
  no: "non",
  please: "s'il vous plaît",
  "thank you": "merci",
  thanks: "merci",
  sorry: "désolé",
  "excuse me": "excusez-moi",
  goodbye: "au revoir",
  bye: "salut",
  "good morning": "bonjour",
  "good evening": "bonsoir",
  "good night": "bonne nuit",
  okay: "d'accord",
  ok: "ok",
  fine: "bien",
  one: "un",
  two: "deux",
  three: "trois",
  four: "quatre",
  five: "cinq",
  six: "six",
  seven: "sept",
  eight: "huit",
  nine: "neuf",
  ten: "dix",
  today: "aujourd'hui",
  tomorrow: "demain",
  yesterday: "hier",
  now: "maintenant",
  later: "plus tard",
  here: "ici",
  there: "là",
  who: "qui",
  what: "quoi",
  why: "pourquoi",
  when: "quand",
  where: "où",
  how: "comment",
  "i love you": "je t'aime",
  "i know": "je sais",
  "i don't know": "je ne sais pas",
  stop: "arrête",
  go: "va",
  wait: "attends",
  help: "à l'aide",
  water: "eau",
  fire: "feu"
};

const es: Phrasebook = {
  hello: "hola",
  hi: "hola",
  yes: "sí",
  no: "no",
  please: "por favor",
  "thank you": "gracias",
  thanks: "gracias",
  sorry: "perdón",
  "excuse me": "perdone",
  goodbye: "adiós",
  bye: "chau",
  "good morning": "buenos días",
  "good evening": "buenas tardes",
  "good night": "buenas noches",
  okay: "vale",
  ok: "ok",
  fine: "bien",
  one: "uno",
  two: "dos",
  three: "tres",
  four: "cuatro",
  five: "cinco",
  six: "seis",
  seven: "siete",
  eight: "ocho",
  nine: "nueve",
  ten: "diez",
  today: "hoy",
  tomorrow: "mañana",
  yesterday: "ayer",
  now: "ahora",
  later: "más tarde",
  here: "aquí",
  there: "allí",
  who: "quién",
  what: "qué",
  why: "por qué",
  when: "cuándo",
  where: "dónde",
  how: "cómo",
  "i love you": "te quiero",
  "i know": "lo sé",
  "i don't know": "no sé",
  stop: "para",
  go: "vete",
  wait: "espera",
  help: "ayuda",
  water: "agua",
  fire: "fuego"
};

const de: Phrasebook = {
  hello: "hallo",
  hi: "hi",
  yes: "ja",
  no: "nein",
  please: "bitte",
  "thank you": "danke",
  thanks: "danke",
  sorry: "entschuldigung",
  "excuse me": "entschuldigen Sie",
  goodbye: "auf Wiedersehen",
  bye: "tschüss",
  "good morning": "guten Morgen",
  "good evening": "guten Abend",
  "good night": "gute Nacht",
  okay: "okay",
  ok: "ok",
  fine: "gut",
  one: "eins",
  two: "zwei",
  three: "drei",
  four: "vier",
  five: "fünf",
  six: "sechs",
  seven: "sieben",
  eight: "acht",
  nine: "neun",
  ten: "zehn",
  today: "heute",
  tomorrow: "morgen",
  yesterday: "gestern",
  now: "jetzt",
  later: "später",
  here: "hier",
  there: "dort",
  who: "wer",
  what: "was",
  why: "warum",
  when: "wann",
  where: "wo",
  how: "wie",
  "i love you": "ich liebe dich",
  "i know": "ich weiß",
  "i don't know": "ich weiß nicht",
  stop: "halt",
  go: "geh",
  wait: "warte",
  help: "hilfe",
  water: "Wasser",
  fire: "Feuer"
};

const it: Phrasebook = {
  hello: "ciao",
  hi: "ciao",
  yes: "sì",
  no: "no",
  please: "per favore",
  "thank you": "grazie",
  thanks: "grazie",
  sorry: "scusa",
  "excuse me": "mi scusi",
  goodbye: "arrivederci",
  bye: "ciao",
  "good morning": "buongiorno",
  "good evening": "buonasera",
  "good night": "buonanotte",
  okay: "va bene",
  ok: "ok",
  fine: "bene",
  one: "uno",
  two: "due",
  three: "tre",
  four: "quattro",
  five: "cinque",
  six: "sei",
  seven: "sette",
  eight: "otto",
  nine: "nove",
  ten: "dieci",
  today: "oggi",
  tomorrow: "domani",
  yesterday: "ieri",
  now: "adesso",
  later: "più tardi",
  here: "qui",
  there: "lì",
  who: "chi",
  what: "cosa",
  why: "perché",
  when: "quando",
  where: "dove",
  how: "come",
  "i love you": "ti amo",
  "i know": "lo so",
  "i don't know": "non lo so",
  stop: "fermati",
  go: "vai",
  wait: "aspetta",
  help: "aiuto",
  water: "acqua",
  fire: "fuoco"
};

const books: Record<PhrasebookCode, Phrasebook> = { ro, fr, es, de, it };

export interface PhrasebookTranslation {
  text: string;
  matchedFraction: number;
}

// translateWithPhrasebook substitutes English phrases with the target-
// language equivalents when they appear in the book. Multi-word entries are
// matched first so "thank you" wins over "thank" + "you". Tokens that miss
// the book are left in English unchanged.
//
// The returned matchedFraction is the share of word-tokens that the book
// resolved; callers (the subtitle generator) use it to decide whether the
// draft is good enough to publish or should carry the "needs translation"
// banner.
export function translateWithPhrasebook(
  text: string,
  code: PhrasebookCode
): PhrasebookTranslation {
  const book = books[code];
  if (!book) {
    return { text, matchedFraction: 0 };
  }

  // Build a regex that matches phrases (longest first) at word boundaries.
  const sortedKeys = Object.keys(book).sort((a, b) => b.length - a.length);
  const escaped = sortedKeys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  let totalTokens = 0;
  let matchedTokens = 0;
  const tokenized = text.split(/(\s+)/);
  for (const piece of tokenized) {
    if (piece.trim().length > 0 && !/^\s+$/.test(piece)) {
      totalTokens += piece.split(/\s+/).filter(Boolean).length;
    }
  }

  const translated = text.replace(pattern, (match) => {
    matchedTokens += match.split(/\s+/).filter(Boolean).length;
    const lower = match.toLowerCase();
    const replacement = book[lower] ?? match;
    if (match[0] === match[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  });

  return {
    text: translated,
    matchedFraction: totalTokens === 0 ? 0 : matchedTokens / totalTokens
  };
}

export function isPhrasebookSupported(code: string): code is PhrasebookCode {
  return code in books;
}

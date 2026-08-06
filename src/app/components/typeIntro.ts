// Tipográfiai betöltési intro — a cím rosszul szedve jelenik meg, és a
// betöltés végére áll helyre. Nem dekoráció: a hibák pontosan azok, amiket a
// design language tilt, tehát a gesztus a stúdió saját mércéjéről szól.
//
// A fő tengely az opsz. A Fraunces optikai méret tengelye 9–144; a címre a
// rendszer 144-et pinnel (vékony, magas kontrasztú display-vágás). A 9-es
// érték display fokozatra nagyítva zömök, alacsony kontrasztú, "felfújt"
// betűket ad — ez a leglátványosabb szedési hiba, amit egy variábilis
// betűvel elő lehet állítani, és nem kerül plusz bájtba, mert az opsz
// tengely amúgy is be van töltve.
//
// Mellé három finomabb hiba jön karakterenként: sorvonal-eltérés, hibás
// karaktertáv és ingadozó vastagság. Ezek a --r/--r2/--r3 custom propokon
// ülnek, a CSS keveri őket az --intro-p (0 = hibás, 1 = kész) értékkel.

// Determinisztikus ál-véletlen: ugyanaz minden futáskor és minden gépen,
// tehát a "hiba" karaktere stabil, nem lottózik látogatásonként.
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // [-1, 1)
}

// Egy szó karaktereinek természetes, ALÁVÁGOTT előtolásai. Range-dzsel mérjük
// az eredeti szövegcsomóponton, még bontás előtt, mert utána már nincs kerning.
function naturalAdvances(word: HTMLElement): number[] {
  const node = word.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return [];
  const text = node.textContent ?? "";
  const range = document.createRange();
  const lefts: number[] = [];
  for (let i = 0; i < text.length; i++) {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    lefts.push(range.getBoundingClientRect().left);
  }
  const right = word.getBoundingClientRect().right;
  return lefts.map((l, i) => (i < lefts.length - 1 ? lefts[i + 1] : right) - l);
}

// A szavakat karakter-spanekre bontja. Csak az intro idejére: a visszaadott
// függvény visszaállítja az eredeti szövegcsomópontot, mert az egymás melletti
// inline-block spanek megszüntetik az alávágást (kerning), és a kész címnek
// tökéletesen szedettnek kell lennie.
//
// Az alávágás-veszteséget karakterenként egyenlítjük ki: minden span jobb
// margója a természetes előtolás és a saját dobozszélessége különbsége. Így
// nemcsak a cím teljes szélessége, hanem MINDEN egyes glifa pozíciója is
// pontosan annyi, mint a kész szedésben — a visszaállítás emiatt nem látszik.
// (Egyenletes letter-spacing korrekció erre nem elég: a valódi kerning
// párfüggő, egy átlagolt érték mellett a glifák külön-külön elugranak.)
//
// A hívó felelőssége, hogy a mérés a KÉSZ állapotban történjen: az intro
// keverőjét (--intro-p) 1-re kell állítani a hívás idejére.
export function splitWords(
  words: HTMLElement[],
  charClass: string
): () => void {
  const originals = words.map((w) => w.textContent ?? "");
  const advances = words.map(naturalAdvances);
  let n = 0;

  words.forEach((word) => {
    const frag = document.createDocumentFragment();
    for (const ch of word.textContent ?? "") {
      const span = document.createElement("span");
      span.className = charClass;
      span.textContent = ch;
      span.style.setProperty("--r", jitter(n).toFixed(3));
      span.style.setProperty("--r2", jitter(n + 101).toFixed(3));
      span.style.setProperty("--r3", jitter(n + 977).toFixed(3));
      frag.appendChild(span);
      n++;
    }
    word.replaceChildren(frag);
  });

  // A korrekció külön menetben, hogy minden span már a helyén legyen, amikor
  // a dobozszélességeket mérjük.
  words.forEach((word, wi) => {
    const spans = Array.from(word.children) as HTMLElement[];
    spans.forEach((span, i) => {
      const advance = advances[wi][i];
      if (advance == null) return;
      const boxWidth = span.getBoundingClientRect().width;
      span.style.marginRight = `${(advance - boxWidth).toFixed(4)}px`;
    });
  });

  return () => {
    words.forEach((word, i) => {
      word.textContent = originals[i];
    });
  };
}

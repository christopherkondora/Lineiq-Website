import { COMPANY, HOST } from "../company";
import type { Fact, LegalTexts } from "./types";

// The binding text. Every change starts here, then goes into en.ts and de.ts
// block for block, then LEGAL_VERSIONS moves on (see ./index).

const company: readonly Fact[] = [
  ["Cégnév", COMPANY.legalName],
  ["Rövidített cégnév", COMPANY.name],
  ["Székhely", COMPANY.seat],
  ["Cégjegyzékszám", COMPANY.registrationNumber],
  ["Nyilvántartó cégbíróság", COMPANY.registryCourt],
  ["Adószám", COMPANY.taxNumber],
  ["Képviseli", "Kondora Kristóf Máté és Sütő Áron ügyvezetők, önállóan"],
  ["E-mail", COMPANY.email],
];

const hu: LegalTexts = {
  chrome: {
    label: "Jogi információk",
    languageNote:
      "Ez a dokumentum kötelező erejű, magyar nyelvű szövege. Angol és német fordítása tájékoztató jellegű.",
    original: null,
    versionLine: "{version}. változat · hatályos: {date}",
  },

  terms: {
    title: "Felhasználási feltételek",
    sections: [
      {
        heading: "A szolgáltató adatai",
        blocks: [
          "A www.lineiqgroup.com weboldalt (a továbbiakban: weboldal) az alábbi társaság üzemelteti (a továbbiakban: LineiQ vagy mi):",
          { facts: company },
          "A weboldal tárhelyszolgáltatója:",
          {
            facts: [
              ["Név", HOST.name],
              ["Cím", HOST.address],
              ["E-mail", HOST.email],
            ],
          },
          "Ezeket az adatokat az elektronikus kereskedelmi szolgáltatások, valamint az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény (a továbbiakban: Eker. tv.) 4. §-a alapján tesszük közzé.",
        ],
      },
      {
        heading: "A feltételek hatálya",
        blocks: [
          "Ezek a feltételek a weboldal minden látogatójára és a weboldal minden nyelvi változatára vonatkoznak. A weboldal használatával Ön elfogadja őket; ha nem ért egyet velük, kérjük, ne használja a weboldalt.",
          "A feltételek a weboldal használatát szabályozzák. Szolgáltatásainkat kizárólag külön, írásban kötött szerződés alapján nyújtjuk, és az ilyen együttműködésre a szerződés rendelkezései irányadók.",
        ],
      },
      {
        heading: "A weboldal tartalma nem ajánlat",
        blocks: [
          "A weboldalon olvasható leírások, folyamatok, példák és költségkeretek tájékoztató jellegűek. Nem minősülnek ajánlatnak, és szerződést nem hoznak létre. Ajánlatot csak az Önnel folytatott egyeztetés után, írásban teszünk.",
          "A weboldalon keresztül terméket vagy szolgáltatást megrendelni vagy megvásárolni nem lehet, így a használata fizetési kötelezettséget sem keletkeztet.",
        ],
      },
      {
        heading: "A kapcsolatfelvételi űrlap",
        blocks: [
          {
            list: [
              "Az űrlap elküldése megkeresés, nem megrendelés: szerződés nem jön létre vele, és Önnek kötelezettséget nem keletkeztet.",
              "Minden megkeresést ember olvas el, és e-mailben válaszolunk rá. Fenntartjuk a jogot, hogy egy megkeresés alapján ne vállaljunk munkát.",
              "Kérjük, valós adatokat adjon meg, és az űrlapon ne küldjön bizalmas üzleti információt, sem más személy adatait az érintett hozzájárulása nélkül.",
              "Az űrlapon megadott adatok kezelését az Adatkezelési tájékoztató írja le.",
            ],
          },
        ],
      },
      {
        heading: "Szellemi tulajdon",
        blocks: [
          "A weboldal teljes tartalma (szövegek, grafikák, képek, animációk, a weboldal arculata és forráskódja, a LineiQ név és logó) a szerzői jogról szóló 1999. évi LXXVI. törvény és más jogszabályok védelme alatt áll. A jogok a LineiQ-t vagy a tartalom egyéb jogosultját illetik.",
          "A tartalmat saját, nem kereskedelmi célú tájékozódásra megtekintheti, és a jogszabályban megengedett mértékben, a forrás megjelölésével idézheti. Minden egyéb felhasználáshoz, így különösen a többszörözéshez, az átdolgozáshoz, a nyilvánossághoz közvetítéshez és a kereskedelmi célú felhasználáshoz előzetes írásbeli engedélyünk szükséges.",
          "A weboldalon említett ügyfelek és partnerek neve és jelzése az adott jogosult tulajdona; említésük nem jelent jogátruházást.",
        ],
      },
      {
        heading: "A weboldal használata",
        blocks: [
          "Tilos a weboldalt jogszabályba ütköző módon, vagy a működését veszélyeztető módon használni. Ilyen különösen a weboldal vagy a mögötte álló rendszerek feltörése vagy túlterhelése, kártékony kód elhelyezése, valamint kéretlen vagy automatizált üzenetek küldése az űrlapon keresztül.",
        ],
      },
      {
        heading: "Felelősség",
        blocks: [
          "Törekszünk arra, hogy a weboldal tartalma pontos és naprakész legyen, és hogy a weboldal folyamatosan elérhető legyen, ezt azonban nem tudjuk garantálni. A tartalom általános tájékoztatás, nem minősül egyedi szakmai tanácsnak.",
          "A jogszabályok által megengedett legteljesebb mértékben kizárjuk felelősségünket a weboldal használatából, elérhetetlenségéből vagy a tartalmára alapított döntésekből eredő károkért. Ez nem vonatkozik a szándékosan okozott kárért, valamint az emberi életet, testi épséget vagy egészséget megkárosító szerződésszegésért való felelősségre, amelyet a Polgári Törvénykönyvről szóló 2013. évi V. törvény (a továbbiakban: Ptk.) 6:152. §-a szerint nem lehet kizárni.",
          "A külső weboldalakra mutató hivatkozások esetén az ott közzétett tartalomért és az ott folyó adatkezelésért az adott weboldal üzemeltetője felel.",
        ],
      },
      {
        heading: "Irányadó jog és jogviták",
        blocks: [
          "A feltételekre a magyar jog, különösen a Ptk. és az Eker. tv. rendelkezései irányadók. Ha Ön fogyasztó, ez nem fosztja meg a szokásos tartózkodási helye szerinti ország jogának azon védelmétől, amelytől szerződéssel nem lehet eltérni.",
          "Vitás kérdéseket elsősorban egyeztetéssel rendezünk; ehhez kérjük, írjon nekünk a hello@lineiqgroup.com címre. Ha az egyeztetés nem vezet eredményre, a jogvitára a magyar bíróságok rendelkeznek joghatósággal, a fogyasztókat megillető kötelező joghatósági szabályok sérelme nélkül.",
        ],
      },
      {
        heading: "Nyelv",
        blocks: [
          "Ezek a feltételek magyar nyelven készültek. Angol és német fordításuk tájékoztató jellegű; eltérés esetén a magyar szöveg az irányadó.",
        ],
      },
      {
        heading: "A feltételek módosítása",
        blocks: [
          "A feltételeket módosíthatjuk; a módosítás a weboldalon való közzététellel lép hatályba. A mindenkor hatályos változat ezen az oldalon olvasható, a tetején a változat számával és a hatálybalépés napjával.",
          "Kérdés esetén írjon nekünk: hello@lineiqgroup.com.",
        ],
      },
    ],
  },

  privacy: {
    title: "Adatkezelési tájékoztató",
    sections: [
      {
        heading: "Az adatkezelő",
        blocks: [
          "Az e tájékoztatóban ismertetett személyes adatok adatkezelője (a továbbiakban: LineiQ vagy mi):",
          { facts: company },
          "Adatai kezelésével kapcsolatban itt érhet el minket: **contact@lineiqgroup.com**. Adatvédelmi tisztviselő kijelölésére nem vagyunk kötelesek, ezért ilyet nem jelöltünk ki.",
        ],
      },
      {
        heading: "A tájékoztató hatálya",
        blocks: [
          "Ez a tájékoztató az (EU) 2016/679 rendelet (általános adatvédelmi rendelet, a továbbiakban: GDPR) 13. és 14. cikke, valamint az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (a továbbiakban: Infotv.) alapján ismerteti, hogy adatkezelőként milyen személyes adatokat kezelünk, honnan származnak, milyen célból, milyen jogalapon és mennyi ideig kezeljük őket, kik kapják meg, és milyen jogok illetik meg Önt. A tájékoztató Önre vonatkozik, ha Ön:",
          {
            list: [
              "felkeresi a www.lineiqgroup.com weboldalt, vagy annak űrlapján vagy e-mailben ír nekünk;",
              "egy olyan vállalkozásnál dolgozik, amelyet mi találtunk meg, és amelyet megkereshetünk (potenciális ügyfél);",
              "közösségimédia-felületen kapcsolatba lép velünk, vagy mi lépünk kapcsolatba Önnel;",
              "partnerünknél dolgozik, vagy szerződést ír alá velünk;",
              "számlát kap tőlünk vagy számlát küld nekünk.",
            ],
          },
          "Nem vonatkozik a tájékoztató a partnereink saját ügyfeleinek, érdeklődőinek és munkatársainak azon személyes adataira, amelyeket egy projekt során a partner utasítására kezelünk. Ezeknek az adatoknak a partner az adatkezelője, és a partner saját adatkezelési tájékoztatója az irányadó; a mi szerepünket a partnerrel kötött adatfeldolgozási szerződés rögzíti.",
        ],
      },
      {
        heading: "Röviden",
        blocks: [
          {
            list: [
              "Üzleti elérhetőségeket és azt kezeljük, amit Ön elmond nekünk, mást nem.",
              "A potenciális ügyfelekről csak nyilvános információt használunk, és legkésőbb az első üzenetünkben tájékoztatjuk őket.",
              "Adatait nem adjuk el, és senkinek nem adjuk át az ő marketingcéljaira.",
              "Önről automatizált döntés nem születik.",
              "A weboldal nem használ analitikát vagy követést, és csak akkor állít be egy sütit, ha Ön nyelvet választ.",
            ],
          },
        ],
      },
      {
        heading: "Megkeresések a weboldalon és e-mailben",
        blocks: [
          "A Kapcsolat oldal űrlapján ajánlatot kérhet, vagy együttműködést kezdeményezhet. Ha e-mailben ír nekünk, ugyanez érvényes.",
          {
            facts: [
              [
                "Kezelt adatok",
                "A cég neve, az e-mail-cím, az űrlap kérdéseire adott válaszok (a vállalkozás helyzete, az igényelt szolgáltatás, a költségkeret sávja), a nem kötelező megjegyzés, az oldal nyelve; illetve az e-mail tartalma. A cégnév és az e-mail-cím akkor személyes adat, ha természetes személyt azonosít, például egyéni vállalkozó nevét vagy névre szóló e-mail-címet.",
              ],
              [
                "Cél",
                "A megkeresés megválaszolása, annak felmérése, hogy szolgáltatásaink megfelelnek-e, és a szerződés előtti egyeztetés.",
              ],
              [
                "Jogalap",
                "A GDPR 6. cikk (1) bekezdés b) pontja: az Ön kérésére, a szerződés megkötését megelőzően tett lépések. Ha cég képviselőjeként vagy munkatársaként ír: a GDPR 6. cikk (1) bekezdés f) pontja, jogos érdekünk az üzleti megkeresések megválaszolása.",
              ],
              [
                "Időtartam",
                "Ha nem jön létre szerződés, az utolsó üzenettől számított 12 hónap. Ha létrejön, a 6. pont az irányadó.",
              ],
              [
                "Kötelező-e megadni?",
                "Nem. A cégnév és az e-mail-cím nélkül nem tudunk válaszolni, ezért ezek nélkül az űrlap nem küldhető el.",
              ],
            ],
          },
          "Az űrlap adatait a weboldal nem tárolja adatbázisban: e-mailként érkeznek a postafiókunkba. A kéretlen, automatizált beküldések kiszűrésére az űrlap egy rejtett mezőt és a kitöltés időtartamát vizsgálja; ezekből személyes adatot nem állapítunk meg és nem tárolunk.",
        ],
      },
      {
        heading: "Potenciális ügyfelek: az általunk felkutatott vállalkozások",
        blocks: [
          "Olyan vállalkozásokat keresünk, amelyeknek szolgáltatásaink hasznosak lehetnek, és megkeressük a vezetőiket.",
          {
            facts: [
              [
                "Kezelt adatok",
                "Név, beosztás, üzleti e-mail-cím és üzleti telefonszám, a cég, nyilvános üzleti profilok linkjei, az információ forrása, rövid jegyzeteink arról, hogy szolgáltatásaink illenek-e a vállalkozáshoz, valamint az Önnel váltott üzeneteink.",
              ],
              [
                "Az adatok forrása",
                "Kizárólag nyilvános források: a cég weboldala, nyilvános üzleti profilok és oldalak (például LinkedIn, Instagram, Facebook, YouTube, TikTok, Substack), cégnyilvántartások, sajtó, valamint Önt ismerő személyek ajánlása.",
              ],
              [
                "Cél",
                "Olyan vállalkozások felkutatása, amelyeknek segíthetünk, és megkeresésük az együttműködés lehetőségével.",
              ],
              [
                "Jogalap",
                "A GDPR 6. cikk (1) bekezdés f) pontja: jogos érdekünk, hogy vállalkozásunk számára ügyfeleket találjunk. Ezt az érdeket az Ön érdekeivel szemben mérlegeltük, és a mérlegelést írásban rögzítettük; a contact@lineiqgroup.com címen elkérheti.",
              ],
              [
                "Mikor tájékoztatjuk",
                "Legkésőbb az Önnek küldött első üzenetünkben, de minden esetben az adatai megszerzésétől számított egy hónapon belül. Ha úgy döntünk, hogy nem keressük meg, ezen a hónapon belül töröljük az adatait, és csak a cég nevét és döntésünk okát őrizzük meg.",
              ],
              [
                "Időtartam",
                "Ha nem jön létre együttműködés, az utolsó üzenetváltástól számított 12 hónap, ezt követően töröljük adatait. Ha jelzi, hogy nem érdekli, azonnal abbahagyjuk (lásd a 15. pontot).",
              ],
              [
                "Kötelező-e megadni?",
                "Ön nem ad meg nekünk semmit; mi találtuk meg.",
              ],
            ],
          },
          "**Ez ellen bármikor, indokolás nélkül tiltakozhat: ekkor nem keressük többet, és töröljük adatait** (GDPR 21. cikk (2) és (3) bekezdés). Elég, ha bármelyik üzenetünkre ezt válaszolja, vagy ír a contact@lineiqgroup.com címre.",
        ],
      },
      {
        heading: "Partnereink kapcsolattartói",
        blocks: [
          "Amikor egy vállalkozással dolgozunk, kezeljük azoknak az adatait, akikkel ott együtt dolgozunk.",
          {
            facts: [
              [
                "Kezelt adatok",
                "Név, beosztás, üzleti e-mail-cím és telefonszám, levelezésünk és megbeszéléseink jegyzetei.",
              ],
              [
                "Cél",
                "A partnerrel kötött szerződés előkészítése, teljesítése és lezárása.",
              ],
              [
                "Jogalap",
                "A GDPR 6. cikk (1) bekezdés b) pontja, ha Ön a szerződő fél (például egyéni vállalkozó). Egyébként a GDPR 6. cikk (1) bekezdés f) pontja: jogos érdekünk, hogy az Ön által képviselt vállalkozással együtt dolgozzunk.",
              ],
              [
                "Időtartam",
                "Az együttműködés ideje és azt követően 5 év, a Ptk. 6:22. § szerinti általános elévülési idő.",
              ],
              [
                "Kötelező-e megadni?",
                "Az együttműködéshez szükséges; kapcsolattartó nélkül nem tudjuk a munkát elvégezni.",
              ],
            ],
          },
          "**A Starting Brief.** Az együttműködés elején a partner tulajdonosa és jóváhagyója a Tally-ban kitölt egy űrlapot: elérhetőségeit és a vállalkozásról adott válaszait. A cél és a jogalap a fentiekkel azonos. A válaszokat titkosított tárhelyünkre exportáljuk, és 30 napon belül töröljük a Tally-ból; az exportot ezt követően a fenti ideig őrizzük.",
        ],
      },
      {
        heading: "Szerződések aláírása",
        blocks: [
          "A szerződéseket elektronikusan, az Adobe Acrobat Sign szolgáltatással írjuk alá.",
          {
            facts: [
              [
                "Kezelt adatok",
                "Az aláírók neve, üzleti e-mail-címe és aláírása, valamint az aláírás naplója (az aláírás időpontjai és eseményei). IP-címet nem rögzítünk.",
              ],
              [
                "Cél",
                "A szerződés megkötése és bizonyíthatósága.",
              ],
              [
                "Jogalap",
                "A GDPR 6. cikk (1) bekezdés b) pontja, ha szerződő félként ír alá; a GDPR 6. cikk (1) bekezdés f) pontja, jogos érdekünk a bizonyítható aláírás, ha cég nevében ír alá.",
              ],
              [
                "Időtartam",
                "Az aláírt példány és naplója: az együttműködés ideje és azt követően 5 év. Az Acrobat Sign-ban lévő példányt töröljük, miután saját tárhelyünkre mentettük.",
              ],
              [
                "Kötelező-e megadni?",
                "Aláírás nélkül a szerződés nem jön létre.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Számlázás és könyvelés",
        blocks: [
          {
            facts: [
              [
                "Kezelt adatok",
                "Név, számlázási cím, adószám, a számla adatai.",
              ],
              [
                "Cél",
                "Számlázás, valamint számviteli és adózási kötelezettségeink teljesítése.",
              ],
              [
                "Jogalap",
                "A GDPR 6. cikk (1) bekezdés c) pontja: jogi kötelezettség, az általános forgalmi adóról szóló 2007. évi CXXVII. törvény (a számla tartalma) és a számvitelről szóló 2000. évi C. törvény (a megőrzés) alapján.",
              ],
              [
                "Időtartam",
                "8 év, ahogy a számviteli törvény 169. §-a előírja.",
              ],
              [
                "Kötelező-e megadni?",
                "Igen, jogszabály írja elő; nélküle nem tudunk szabályos számlát kiállítani.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Közösségi média",
        blocks: [
          "Mi, illetve alapítóink a LineiQ céljaira használt fiókjaikon az Instagramon, a LinkedInen, a YouTube-on, a Facebookon, a TikTokon és a Substacken megkereshetik Önt vagy beszélgethetnek Önnel. Amit ezekből a beszélgetésekből feljegyzünk, azt az 5. vagy a 6. pont szerint kezeljük. Maga a platform a saját feltételei szerint, önálló adatkezelőként kezeli az Ön adatait; erre nincs ráhatásunk.",
          "A Facebookon és az Instagramon (Meta), valamint a LinkedInen a platform statisztikát ad az oldal tulajdonosának az oldal látogatóiról (Page Insights). E statisztikák tekintetében mi és a platform közös adatkezelők vagyunk; a feladatok megosztását a platform kiegészítő megállapodása rögzíti, és az ezekkel kapcsolatos kérelmeit a platform intézi: [a Meta Page Insights kiegészítése](https://www.facebook.com/legal/terms/page_controller_addendum), [a LinkedIn Page Insights kiegészítése](https://legal.linkedin.com/pages-joint-controller-addendum). Mi csak összesített statisztikát látunk, azt nem, hogy Ön kicsoda.",
        ],
      },
      {
        heading: "A nyelvválasztó süti",
        blocks: [
          "A weboldal egyetlen sütit (cookie-t) használ. A süti egy kis szöveges fájl, amelyet a böngésző az Ön eszközén tárol.",
          {
            facts: [
              [
                "Neve",
                "lineiq-locale",
              ],
              [
                "Beállítja",
                "A weboldal maga (első féltől származó süti), kizárólag akkor, ha Ön a nyelvválasztóban nyelvet választ. Ha nem választ, nem kap sütit.",
              ],
              [
                "Tartalma",
                "Kizárólag a választott nyelv kódja (en, hu vagy de). Azonosítót és személyes adatot nem tartalmaz.",
              ],
              [
                "Célja",
                "Kizárólag funkcionális: a weboldal egyszerű címe (például /about) a választott nyelven nyílik meg. Semmit nem követ, nem elemez és nem oszt meg.",
              ],
              [
                "Élettartama",
                "1 év, amely minden újabb nyelvválasztással megújul.",
              ],
              [
                "Jellemzői",
                "Path=/, SameSite=Lax, https-kapcsolaton Secure. Nem HttpOnly, mert a nyelvválasztó a böngészőben írja.",
              ],
            ],
          },
          "Ez a süti az Ön által kifejezetten kért szolgáltatás nyújtásához feltétlenül szükséges, ezért az elektronikus hírközlésről szóló 2003. évi C. törvény 155. § (4) bekezdése, illetve a 2002/58/EK irányelv 5. cikk (3) bekezdése alapján nem kell hozzá hozzájárulás. A sütit bármikor törölheti a böngészője beállításaiban; ezt követően a weboldal egyszerű címei angolul nyílnak meg. A weboldal más sütit nem használ, analitikai vagy követőkódot nem tölt be, és a betűtípusokat a saját tárhelyéről szolgálja ki.",
        ],
      },
      {
        heading: "Szervernaplók",
        blocks: [
          "A weboldal oldalainak letöltésekor a tárhelyszolgáltató rendszere rögzíti az IP-címet, a kérés időpontját, a kért oldal címét és a böngésző azonosító adatait (user agent).",
          {
            facts: [
              [
                "Cél",
                "A weboldal biztonságos és megbízható működése, a hibák és a visszaélések felderítése.",
              ],
              [
                "Jogalap",
                "A GDPR 6. cikk (1) bekezdés f) pontja: jogos érdekünk a weboldal biztonságos üzemeltetése.",
              ],
              [
                "Időtartam",
                "A működéshez szükséges rövid ideig, ezt követően a tárhelyszolgáltató rendszere automatikusan törli. Ezeket az adatokat nem kapcsoljuk össze más adattal, és nem azonosítjuk velük a látogatókat.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Kik kapják meg az adatait",
        blocks: [
          "A LineiQ két ügyvezetőjén kívül csak az alábbiak kapnak személyes adatot, és csak a feladatukhoz szükséges mértékben.",
          "**Adatfeldolgozóink** (adatfeldolgozási szerződés alapján, a mi utasításunkra járnak el):",
          {
            facts: [
              [
                "Proton AG (Svájc)",
                "E-mail (contact@lineiqgroup.com), titkosított fájltárolás, jelszókezelő. Az adatok helye: Svájc. Továbbítás az EU/EGT-n kívülre: Svájcra az Európai Bizottság megfelelőségi határozata vonatkozik.",
              ],
              [
                "Supabase Pte. Ltd. (Szingapúr)",
                "Belső munkafelületünk (Kontrast): a potenciális ügyfelek és a partnerek adatai. Az adatok helye: EU (Frankfurt). Továbbítás az EU/EGT-n kívülre: Szingapúrra nem vonatkozik az Európai Bizottság megfelelőségi határozata; a Supabase adatfeldolgozási szerződésében foglalt általános adatvédelmi kikötések.",
              ],
              [
                "Tally BV (Belgium)",
                "A Starting Brief űrlap. Az adatok helye: EU. Továbbítás az EU/EGT-n kívülre: Nincs.",
              ],
              [
                "Adobe (Acrobat Sign)",
                "Elektronikus aláírás. Az adatok helye: EU (Németország, Írország). Továbbítás az EU/EGT-n kívülre: Az Adobe Inc. (USA) tanúsított az EU–USA adatvédelmi keretrendszer szerint; szerződése tartalmazza az általános adatvédelmi kikötéseket.",
              ],
              [
                "Vercel Inc. (USA)",
                "A weboldal tárhelye, szervernaplók. Az adatok helye: USA. Továbbítás az EU/EGT-n kívülre: EU–USA adatvédelmi keretrendszer; általános adatvédelmi kikötések.",
              ],
              [
                "Plus Five Five, Inc., a Resend üzemeltetője (USA)",
                "A weboldal űrlapján küldött üzenet kézbesítése e-mailben. Az adatok helye: USA. Továbbítás az EU/EGT-n kívülre: EU–USA adatvédelmi keretrendszer; általános adatvédelmi kikötések.",
              ],
              [
                "GitHub B.V. (Hollandia) és GitHub, Inc. (USA)",
                "Az a privát tárhely, amelyben a potenciális ügyfelekről és a partnerekről szóló munkajegyzeteinket tartjuk. Az adatok helye: USA. Továbbítás az EU/EGT-n kívülre: A GitHub tanúsított az EU–USA adatvédelmi keretrendszer szerint.",
              ],
              [
                "Anthropic Ireland, Limited (Írország)",
                "A Claude MI-asszisztens (Team csomag, céges fiók): kutatásra, szövegtervezésre és rendszerezésre használjuk, ami magában foglalja a potenciális ügyfelekről és a partnerekről szóló munkajegyzeteink olvasását is. Az Anthropic az adatokat nem használhatja modelljei tanítására. Az adatok helye: Az Anthropic erre a csomagra nem adja meg; az USA-t feltételezzük. Továbbítás az EU/EGT-n kívülre: Az Anthropic uniós társaság; a további továbbítás az adatfeldolgozási szerződésében foglalt általános adatvédelmi kikötések szerint történik.",
              ],
            ],
          },
          "**További címzettek:**",
          {
            list: [
              "**A közösségimédia-platformok** (9. pont), mindegyik a saját feltételei szerint.",
              "**Könyvelőnk és az adóhatóság** a számlázási adatok tekintetében, a jogszabályok szerint.",
            ],
          },
          "Az EU–USA adatvédelmi keretrendszerről szóló megfelelőségi határozat az Európai Bizottság 2023. július 10-i határozata (GDPR 45. cikk); az általános adatvédelmi kikötések a Bizottság által elfogadott kikötések (GDPR 46. cikk). Személyes adatot nem adunk el. Hatóságnak csak jogszabályban előírt esetben és mértékben adunk ki adatot.",
        ],
      },
      {
        heading: "Nincs automatizált döntéshozatal",
        blocks: [
          "Önről automatizált eszközökkel döntés nem születik, és profilt nem alkotunk Önről (GDPR 22. cikk). Egy MI-asszisztens segíthet nyilvános információk felkutatásában, de azt minden esetben ember olvassa el, és ember dönt.",
        ],
      },
      {
        heading: "Adatbiztonság",
        blocks: [
          "A személyes adatokat megfelelő technikai és szervezési intézkedésekkel védjük: jelszókezelőből származó egyedi jelszavak és kétlépcsős azonosítás, titkosított tárolás, a feladathoz szükséges legszűkebb hozzáférés, titkosított és frissített eszközök, és titoktartás mindenkinek, aki hozzáfér. A weboldal kizárólag titkosított (HTTPS) kapcsolaton érhető el. Ha adatvédelmi incidens történik, a GDPR 33. és 34. cikke szerint járunk el: bejelentjük a hatóságnak, és ha az incidens Önre nézve magas kockázattal jár, Önt is tájékoztatjuk.",
        ],
      },
      {
        heading: "Az Ön jogai",
        blocks: [
          {
            list: [
              "**Hozzáférés** (15. cikk): tájékoztatást kérhet arról, hogy kezelünk-e Önre vonatkozó adatot, és másolatot kaphat róla.",
              "**Helyesbítés** (16. cikk): kérheti a pontatlan adatok javítását és a hiányosak kiegészítését.",
              "**Törlés** (17. cikk): kérheti adatai törlését, ha már nincs rájuk szükség, ha tiltakozott, vagy ha az adatkezelés jogellenes.",
              "**Az adatkezelés korlátozása** (18. cikk): kérheti, hogy adatait meghatározott ideig csak tároljuk, például amíg pontosságukat ellenőrizzük.",
              "**Adathordozhatóság** (20. cikk): a szerződés vagy a szerződés előtti lépések céljából megadott adatait géppel olvasható formában megkaphatja, vagy kérheti, hogy egy másik adatkezelőnek továbbítsuk őket.",
              "**Tiltakozás** (21. cikk): a jogos érdekünkön alapuló adatkezelés ellen a saját helyzetével kapcsolatos okból bármikor tiltakozhat. **Ha szolgáltatásainkkal kapcsolatban keressük meg, bármikor, indokolás nélkül tiltakozhat, és abbahagyjuk.**",
            ],
          },
          "Kérelmét a contact@lineiqgroup.com címre küldheti. Indokolatlan késedelem nélkül, legfeljebb egy hónapon belül válaszolunk; ez a határidő indokolt esetben további két hónappal meghosszabbítható, amiről az első hónapon belül értesítjük. A tájékoztatás és az intézkedés díjmentes. Ha a kérelmező személyazonossága kétséges, a megerősítéséhez további adatokat kérhetünk. Kérelmét és válaszunkat 5 évig megőrizzük, hogy igazolni tudjuk a teljesítését (GDPR 6. cikk (1) bekezdés f) pont: ehhez fűződő jogos érdekünk, a Ptk. 6:22. §-a szerinti ötéves elévülési időn belül).",
        ],
      },
      {
        heading: "Jogorvoslat",
        blocks: [
          "Ha úgy véli, hogy adatainak kezelése jogszabályt sért, kérjük, először forduljon hozzánk, hogy a problémát orvosolhassuk. Panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH) is:",
          {
            facts: [
              [
                "Székhely",
                "1055 Budapest, Falk Miksa utca 9–11.",
              ],
              [
                "Postacím",
                "1363 Budapest, Pf. 9.",
              ],
              [
                "Telefon",
                "+36 1 391 1400",
              ],
              [
                "E-mail",
                "ugyfelszolgalat@naih.hu",
              ],
              [
                "Honlap",
                "www.naih.hu",
              ],
            ],
          },
          "Bírósághoz is fordulhat (GDPR 79. cikk, Infotv. 23. §). A per elbírálása a törvényszék hatáskörébe tartozik, és a pert választása szerint a lakóhelye vagy a tartózkodási helye szerinti törvényszék előtt is megindíthatja. Ha szokásos tartózkodási helye az Európai Unió egy másik tagállamában van, az ottani felügyeleti hatóságnál is panaszt tehet.",
        ],
      },
      {
        heading: "Gyermekek",
        blocks: [
          "Szolgáltatásaink vállalkozásoknak szólnak. 16 év alatti személyek adatait tudatosan nem kezeljük.",
        ],
      },
      {
        heading: "A tájékoztató módosítása",
        blocks: [
          "A tájékoztatót módosítjuk, ha működésünk vagy a jogszabályok változnak. A mindenkor hatályos változat a lineiqgroup.com/privacy oldalon olvasható, a változat számával és a hatálybalépés napjával. Ez a tájékoztató magyar nyelven készült. Angol és német fordítása tájékoztató jellegű; eltérés esetén a magyar szöveg az irányadó.",
        ],
      },
    ],
  },
};

export default hu;

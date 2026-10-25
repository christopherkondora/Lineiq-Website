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
  ["Képviseli", "Kondora Kristóf és Sütő Áron ügyvezetők"],
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
          "A www.lineiqgroup.com weboldalon (a továbbiakban: weboldal) keresztül megadott személyes adatok adatkezelője (a továbbiakban: LineiQ vagy mi):",
          { facts: company },
          "Adatvédelmi tisztviselő kijelölésére nem vagyunk kötelesek, ezért ilyet nem jelöltünk ki. Adatkezeléssel kapcsolatos kérdéseivel a fenti e-mail-címen fordulhat hozzánk.",
        ],
      },
      {
        heading: "A tájékoztató célja és hatálya",
        blocks: [
          "Ez a tájékoztató az Európai Parlament és a Tanács (EU) 2016/679 rendelete (általános adatvédelmi rendelet, a továbbiakban: GDPR) 13. cikke, valamint az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (a továbbiakban: Infotv.) alapján ismerteti, hogy a weboldal használata során milyen személyes adatokat, milyen célból, milyen jogalapon és mennyi ideig kezelünk, kik férhetnek hozzájuk, és milyen jogok illetik meg Önt.",
          "A tájékoztató a weboldal minden nyelvi változatára kiterjed. Partnereink adatait az együttműködés során a szerződés és az ahhoz tartozó külön tájékoztató szerint kezeljük.",
        ],
      },
      {
        heading: "Röviden",
        blocks: [
          {
            list: [
              "Csak azokat az adatokat kezeljük, amelyeket Ön a kapcsolatfelvételi űrlapon vagy e-mailben megad nekünk, valamint a tárhelyszolgáltató szervernaplóit.",
              "Nem használunk analitikát, követőkódot, hirdetési vagy közösségimédia-sütit.",
              "Egyetlen sütit állítunk be, és csak akkor, ha Ön nyelvet választ: ez a választott nyelvet jegyzi meg.",
              "Adatait nem adjuk el, és marketingcélra senkinek nem adjuk át.",
            ],
          },
        ],
      },
      {
        heading: "A kapcsolatfelvételi űrlap",
        blocks: [
          "A Kapcsolat oldal űrlapján ajánlatkérés vagy együttműködés céljából veheti fel velünk a kapcsolatot.",
          {
            facts: [
              [
                "Kezelt adatok",
                "a cég neve, az e-mail-cím, az űrlap kérdéseire adott válaszok (a vállalkozás jelenlegi helyzete, az igényelt szolgáltatás, a költségkeret sávja), a nem kötelező megjegyzés, valamint annak az oldalnak a nyelve, amelyen az űrlapot kitöltötte. A cégnév és az e-mail-cím akkor személyes adat, ha természetes személyt azonosít, például egyéni vállalkozó nevét vagy névre szóló e-mail-címet.",
              ],
              [
                "Cél",
                "a megkeresés megválaszolása, annak felmérése, hogy szolgáltatásaink megfelelnek-e az Ön igényeinek, és a szerződés előtti egyeztetés.",
              ],
              [
                "Jogalap",
                "a GDPR 6. cikk (1) bekezdés b) pontja: az Ön kérésére, a szerződés megkötését megelőzően tett lépések. Ha Ön egy cég képviselőjeként vagy munkatársaként keres meg minket, a jogalap a GDPR 6. cikk (1) bekezdés f) pontja: jogos érdekünk, hogy az üzleti megkeresésekre válaszoljunk.",
              ],
              [
                "Időtartam",
                "ha a megkeresésből nem jön létre szerződés, az utolsó levélváltástól számított 12 hónap, ezt követően töröljük. Ha szerződés jön létre, a levelezést a szerződés megszűnésétől számított 5 évig, a Ptk. szerinti általános elévülési ideig őrizzük meg.",
              ],
              [
                "Az adatszolgáltatás",
                "önkéntes. A cégnév és az e-mail-cím nélkül nem tudunk válaszolni, ezért ezek megadása az űrlap elküldésének feltétele.",
              ],
            ],
          },
          "Az űrlap adatait a weboldal nem tárolja adatbázisban: elküldéskor e-mailként érkeznek a postafiókunkba, és ott kezeljük őket. Ha az űrlap helyett közvetlenül e-mailt ír nekünk, az abban megadott adatokat ugyanezen célból, jogalapon és ideig kezeljük.",
          "Minden megkeresést ember olvas el és válaszol meg. Az űrlap válaszai alapján automatizált döntéshozatal vagy profilalkotás nem történik.",
          "A kéretlen, automatizált beküldések kiszűrésére az űrlap egy rejtett mezőt és a kitöltés időtartamát vizsgálja. Ezekből személyes adatot nem állapítunk meg és nem tárolunk.",
        ],
      },
      {
        heading: "A nyelvválasztó süti",
        blocks: [
          "A weboldal egyetlen sütit (cookie-t) használ. A süti egy kis szöveges fájl, amelyet a böngésző az Ön eszközén tárol.",
          {
            facts: [
              ["Neve", "lineiq-locale"],
              [
                "Beállítja",
                "a weboldal maga (első féltől származó süti), kizárólag akkor, ha Ön a nyelvválasztóban nyelvet választ. Ha nem választ, nem kap sütit.",
              ],
              [
                "Tartalma",
                "kizárólag a választott nyelv kódja (en, hu vagy de). Azonosítót és személyes adatot nem tartalmaz.",
              ],
              [
                "Célja",
                "kizárólag funkcionális: a weboldal egyszerű címe (például /about) a választott nyelven nyílik meg. Semmit nem követ, nem elemez és nem oszt meg.",
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
          "Ez a süti az Ön által kifejezetten kért szolgáltatás nyújtásához feltétlenül szükséges, ezért az elektronikus hírközlésről szóló 2003. évi C. törvény 155. § (4) bekezdése, illetve a 2002/58/EK irányelv 5. cikk (3) bekezdése alapján nem kell hozzá hozzájárulás. A sütit bármikor törölheti a böngészője beállításaiban; ezt követően a weboldal egyszerű címei angolul nyílnak meg.",
          "A weboldal más sütit nem használ, analitikai vagy követőkódot nem tölt be, és a betűtípusokat is a saját tárhelyéről szolgálja ki, így a betűtípusok miatt sem kerül adat harmadik félhez.",
        ],
      },
      {
        heading: "Szervernaplók",
        blocks: [
          "A weboldalt a tárhelyszolgáltatónk üzemelteti (lásd a következő pontot). Az oldalak letöltésekor a szolgáltató rendszere műszaki adatokat rögzít: az IP-címet, a kérés időpontját, a kért oldal címét és a böngésző azonosító adatait (user agent).",
          {
            facts: [
              [
                "Cél",
                "a weboldal biztonságos és megbízható működése, a hibák és a visszaélések felderítése.",
              ],
              [
                "Jogalap",
                "a GDPR 6. cikk (1) bekezdés f) pontja: jogos érdekünk a weboldal biztonságos üzemeltetése.",
              ],
              [
                "Időtartam",
                "a tárhelyszolgáltató rendszere a működéshez szükséges rövid ideig őrzi, majd automatikusan törli. Ezeket az adatokat nem kapcsoljuk össze más adattal, és nem azonosítjuk velük a látogatókat.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Adatfeldolgozók és adattovábbítás",
        blocks: [
          "Az adatokhoz rajtunk kívül csak azok a szolgáltatók férnek hozzá, amelyek adatfeldolgozóként a weboldal működtetésében közreműködnek, és csak az ehhez szükséges mértékben:",
          {
            list: [
              "Vercel Inc. (440 N Barranca Avenue #4133, Covina, CA 91723, Amerikai Egyesült Államok; privacy@vercel.com): tárhelyszolgáltatás és szervernaplók.",
              "Plus Five Five, Inc., a Resend üzemeltetője (2261 Market Street #5039, San Francisco, CA 94114, Amerikai Egyesült Államok; support@resend.com): az űrlap üzenetének kézbesítése e-mailben.",
              "Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Írország): e-mail-szolgáltatás (Google Workspace), amelyben a megkereséseket fogadjuk és megválaszoljuk.",
            ],
          },
          "A Vercel és a Resend az Amerikai Egyesült Államokban kezeli az adatokat, a Google egyes adatokat az Európai Unión kívül is kezelhet. Az adattovábbítás alapja az Európai Bizottság 2023. július 10-i megfelelőségi határozata az EU–USA adatvédelmi keretrendszerről (GDPR 45. cikk), amelyhez a szolgáltatók csatlakoztak, valamint a Bizottság által elfogadott általános adatvédelmi kikötések (GDPR 46. cikk).",
          "Személyes adatot nem adunk el, és marketingcélra senkinek nem adunk át. Hatóságnak csak jogszabályban előírt esetben és mértékben adunk ki adatot.",
        ],
      },
      {
        heading: "Adatbiztonság",
        blocks: [
          "A weboldal kizárólag titkosított (HTTPS) kapcsolaton érhető el. A megkeresésekhez csak a LineiQ ügyvezetői férnek hozzá. Megfelelő technikai és szervezési intézkedésekkel védjük az adatokat a jogosulatlan hozzáférés, módosítás, továbbítás, nyilvánosságra hozatal, törlés és megsemmisülés ellen.",
          "Ha adatvédelmi incidens történik, a GDPR 33. és 34. cikke szerint járunk el: bejelentjük a hatóságnak, és ha az incidens Önre nézve magas kockázattal jár, Önt is tájékoztatjuk.",
        ],
      },
      {
        heading: "Az Ön jogai",
        blocks: [
          "A GDPR alapján az adatkezeléssel kapcsolatban a következő jogok illetik meg:",
          {
            list: [
              "Hozzáférés (15. cikk): tájékoztatást kérhet arról, hogy kezelünk-e Önre vonatkozó adatot, és ha igen, másolatot kérhet róla.",
              "Helyesbítés (16. cikk): kérheti a pontatlan adatok javítását és a hiányosak kiegészítését.",
              "Törlés (17. cikk): kérheti adatai törlését, ha kezelésükre már nincs szükség, vagy ha az adatkezelés jogellenes.",
              "Az adatkezelés korlátozása (18. cikk): kérheti, hogy adatait meghatározott ideig csak tároljuk, például amíg pontosságukat ellenőrizzük.",
              "Adathordozhatóság (20. cikk): a szerződés előtti lépések jogalapján kezelt adatait tagolt, géppel olvasható formában megkaphatja, vagy kérheti, hogy egy másik adatkezelőnek továbbítsuk őket.",
              "Tiltakozás (21. cikk): a jogos érdekünkön alapuló adatkezelés ellen a saját helyzetével kapcsolatos okból bármikor tiltakozhat.",
            ],
          },
          "Kérelmét a hello@lineiqgroup.com címre küldheti. Indokolatlan késedelem nélkül, legfeljebb egy hónapon belül válaszolunk; ez a határidő indokolt esetben további két hónappal meghosszabbítható, amiről egy hónapon belül értesítjük. A tájékoztatás és az intézkedés díjmentes. Ha a kérelmező személyazonossága kétséges, a megerősítéséhez további adatokat kérhetünk.",
        ],
      },
      {
        heading: "Jogorvoslat",
        blocks: [
          "Ha úgy véli, hogy adatainak kezelése jogszabályt sért, kérjük, először forduljon hozzánk, hogy a problémát közvetlenül orvosolhassuk. Panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH) is:",
          {
            facts: [
              ["Székhely", "1055 Budapest, Falk Miksa utca 9–11."],
              ["Postacím", "1363 Budapest, Pf. 9."],
              ["Telefon", "+36 1 391 1400"],
              ["E-mail", "ugyfelszolgalat@naih.hu"],
              ["Honlap", "www.naih.hu"],
            ],
          },
          "Jogai megsértése esetén bírósághoz is fordulhat (GDPR 79. cikk, Infotv. 23. §). A per elbírálása a törvényszék hatáskörébe tartozik, és a pert választása szerint a lakóhelye vagy a tartózkodási helye szerinti törvényszék előtt is megindíthatja. Ha szokásos tartózkodási helye az Európai Unió egy másik tagállamában van, az ottani adatvédelmi felügyeleti hatóságnál is panaszt tehet.",
        ],
      },
      {
        heading: "Gyermekek",
        blocks: [
          "A weboldal vállalkozásoknak szól. 16 év alatti személyektől tudatosan nem gyűjtünk adatot.",
        ],
      },
      {
        heading: "A tájékoztató módosítása",
        blocks: [
          "A tájékoztatót módosítjuk, ha a weboldal működése vagy a jogszabályok változnak. A mindenkor hatályos változat ezen az oldalon olvasható, a tetején a változat számával és a hatálybalépés napjával.",
          "Ez a tájékoztató magyar nyelven készült. Angol és német fordítása tájékoztató jellegű; eltérés esetén a magyar szöveg az irányadó.",
        ],
      },
    ],
  },
};

export default hu;

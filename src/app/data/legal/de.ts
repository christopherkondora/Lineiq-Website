import { COMPANY, HOST } from "../company";
import type { Fact, LegalTexts } from "./types";

// A translation of ./hu, block for block. The Hungarian binds; where this
// says something different, this is what changes.

const company: readonly Fact[] = [
  ["Firma", COMPANY.legalName],
  ["Kurzfirma", COMPANY.name],
  ["Sitz", COMPANY.seat],
  ["Firmenbuchnummer", COMPANY.registrationNumber],
  ["Registergericht", COMPANY.registryCourt],
  ["Steuernummer", COMPANY.taxNumber],
  ["Vertreten durch", "Kristóf Kondora und Áron Sütő, Geschäftsführer"],
  ["E-Mail", COMPANY.email],
];

const de: LegalTexts = {
  chrome: {
    label: "Rechtliches",
    languageNote:
      "Dies ist eine deutsche Übersetzung zu Informationszwecken. Verbindlich ist der ungarische Text; bei Abweichungen geht er vor.",
    original: "Zum ungarischen Original",
    versionLine: "Version {version} · gültig ab {date}",
  },

  terms: {
    title: "Nutzungsbedingungen",
    sections: [
      {
        heading: "Anbieter",
        blocks: [
          "Die Website www.lineiqgroup.com (die Website) wird von folgender Gesellschaft betrieben (LineiQ oder wir):",
          { facts: company },
          "Hosting-Anbieter der Website:",
          {
            facts: [
              ["Name", HOST.name],
              ["Anschrift", HOST.address],
              ["E-Mail", HOST.email],
            ],
          },
          "Diese Angaben veröffentlichen wir gemäß § 4 des ungarischen Gesetzes CVIII von 2001 über Dienste des elektronischen Geschäftsverkehrs und Dienste der Informationsgesellschaft (Eker. tv.).",
        ],
      },
      {
        heading: "Geltungsbereich",
        blocks: [
          "Diese Bedingungen gelten für alle Besucher der Website und für alle ihre Sprachfassungen. Mit der Nutzung der Website erkennen Sie sie an; wenn Sie nicht einverstanden sind, nutzen Sie die Website bitte nicht.",
          "Diese Bedingungen regeln die Nutzung der Website. Unsere Leistungen erbringen wir ausschließlich auf Grundlage eines gesonderten, schriftlich geschlossenen Vertrags; für eine solche Zusammenarbeit ist dieser Vertrag maßgeblich.",
        ],
      },
      {
        heading: "Die Website ist kein Angebot",
        blocks: [
          "Die Beschreibungen, Abläufe, Beispiele und Budgetrahmen auf der Website dienen der Information. Sie sind kein Angebot und begründen keinen Vertrag. Ein Angebot machen wir nur schriftlich, nach einem Gespräch mit Ihnen.",
          "Über die Website kann nichts bestellt oder gekauft werden; ihre Nutzung begründet daher auch keine Zahlungspflicht.",
        ],
      },
      {
        heading: "Das Kontaktformular",
        blocks: [
          {
            list: [
              "Das Absenden des Formulars ist eine Anfrage, keine Bestellung: Es kommt kein Vertrag zustande, und für Sie entsteht keine Verpflichtung.",
              "Jede Anfrage wird von einem Menschen gelesen und per E-Mail beantwortet. Wir behalten uns vor, auf eine Anfrage hin keinen Auftrag anzunehmen.",
              "Bitte machen Sie zutreffende Angaben und senden Sie über das Formular keine vertraulichen Geschäftsinformationen und keine personenbezogenen Daten Dritter ohne deren Einwilligung.",
              "Wie wir die Angaben aus dem Formular verarbeiten, beschreibt die Datenschutzerklärung.",
            ],
          },
        ],
      },
      {
        heading: "Geistiges Eigentum",
        blocks: [
          "Sämtliche Inhalte der Website (Texte, Grafiken, Bilder, Animationen, Gestaltung und Quellcode der Website, Name und Logo LineiQ) sind durch das ungarische Urheberrechtsgesetz LXXVI von 1999 und weitere Gesetze geschützt. Die Rechte liegen bei LineiQ oder beim jeweiligen sonstigen Rechteinhaber.",
          "Sie dürfen die Inhalte zu Ihrer eigenen, nicht kommerziellen Information ansehen und im gesetzlich zulässigen Umfang unter Angabe der Quelle zitieren. Jede andere Nutzung, insbesondere Vervielfältigung, Bearbeitung, öffentliche Wiedergabe und kommerzielle Nutzung, bedarf unserer vorherigen schriftlichen Zustimmung.",
          "Namen und Kennzeichen der auf der Website genannten Kunden und Partner gehören ihren Inhabern; ihre Nennung überträgt keine Rechte.",
        ],
      },
      {
        heading: "Nutzung der Website",
        blocks: [
          "Die Website darf nicht rechtswidrig oder in einer Weise genutzt werden, die ihren Betrieb gefährdet. Dazu gehören insbesondere das Eindringen in die Website oder die dahinterliegenden Systeme oder deren Überlastung, das Einschleusen von Schadcode sowie das Versenden unerwünschter oder automatisierter Nachrichten über das Formular.",
        ],
      },
      {
        heading: "Haftung",
        blocks: [
          "Wir bemühen uns, die Inhalte der Website korrekt und aktuell und die Website jederzeit erreichbar zu halten, können beides aber nicht garantieren. Die Inhalte sind allgemeine Informationen und keine individuelle fachliche Beratung.",
          "Soweit gesetzlich zulässig, schließen wir die Haftung für Schäden aus, die aus der Nutzung der Website, ihrer Nichterreichbarkeit oder aus Entscheidungen auf Grundlage ihrer Inhalte entstehen. Dies gilt nicht für die Haftung für vorsätzlich verursachte Schäden sowie für Vertragsverletzungen, die das Leben, die körperliche Unversehrtheit oder die Gesundheit eines Menschen verletzen; diese kann nach § 6:152 des ungarischen Bürgerlichen Gesetzbuchs (Gesetz V von 2013, Ptk.) nicht ausgeschlossen werden.",
          "Verlinkt die Website auf andere Websites, ist für deren Inhalte und die dortige Datenverarbeitung der jeweilige Betreiber verantwortlich.",
        ],
      },
      {
        heading: "Anwendbares Recht und Streitigkeiten",
        blocks: [
          "Für diese Bedingungen gilt ungarisches Recht, insbesondere das Ptk. und das Eker. tv. Sind Sie Verbraucher, wird Ihnen dadurch nicht der Schutz der zwingenden Bestimmungen des Rechts des Staates entzogen, in dem Sie Ihren gewöhnlichen Aufenthalt haben.",
          "Meinungsverschiedenheiten klären wir zuerst im Gespräch; schreiben Sie uns dazu an hello@lineiqgroup.com. Führt das nicht zu einer Lösung, sind für den Rechtsstreit die ungarischen Gerichte zuständig, unbeschadet der zwingenden Zuständigkeitsvorschriften zum Schutz von Verbrauchern.",
        ],
      },
      {
        heading: "Sprache",
        blocks: [
          "Diese Bedingungen wurden auf Ungarisch verfasst. Ihre englische und deutsche Übersetzung dient der Information; bei Abweichungen geht der ungarische Text vor.",
        ],
      },
      {
        heading: "Änderungen",
        blocks: [
          "Wir können diese Bedingungen ändern; eine Änderung wird mit ihrer Veröffentlichung auf der Website wirksam. Die jeweils geltende Fassung steht immer auf dieser Seite, oben mit Versionsnummer und dem Datum, ab dem sie gilt.",
          "Fragen beantworten wir gern: hello@lineiqgroup.com.",
        ],
      },
    ],
  },

  privacy: {
    title: "Datenschutzerklärung",
    sections: [
      {
        heading: "Verantwortlicher",
        blocks: [
          "Verantwortlicher für die über die Website www.lineiqgroup.com (die Website) angegebenen personenbezogenen Daten ist (LineiQ oder wir):",
          { facts: company },
          "Wir sind nicht verpflichtet, einen Datenschutzbeauftragten zu benennen, und haben keinen benannt. Fragen zur Datenverarbeitung richten Sie bitte an die obige E-Mail-Adresse.",
        ],
      },
      {
        heading: "Zweck und Geltungsbereich",
        blocks: [
          "Diese Erklärung informiert gemäß Artikel 13 der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates (Datenschutz-Grundverordnung, DSGVO) und dem ungarischen Gesetz CXII von 2011 über das informationelle Selbstbestimmungsrecht und die Informationsfreiheit (Infotv.) darüber, welche personenbezogenen Daten wir bei der Nutzung der Website zu welchem Zweck, auf welcher Rechtsgrundlage und wie lange verarbeiten, wer Zugriff darauf hat und welche Rechte Sie haben.",
          "Diese Erklärung gilt für alle Sprachfassungen der Website. Die Daten unserer Partner verarbeiten wir während einer Zusammenarbeit nach dem Vertrag und der dazugehörigen gesonderten Information.",
        ],
      },
      {
        heading: "Kurz gesagt",
        blocks: [
          {
            list: [
              "Wir verarbeiten nur die Angaben, die Sie uns im Kontaktformular oder per E-Mail machen, sowie die Serverprotokolle unseres Hosting-Anbieters.",
              "Wir verwenden keine Analyse, keinen Tracking-Code und keine Werbe- oder Social-Media-Cookies.",
              "Wir setzen ein einziges Cookie, und nur dann, wenn Sie eine Sprache wählen: Es merkt sich die gewählte Sprache.",
              "Wir verkaufen Ihre Daten nicht und geben sie niemandem zu Werbezwecken weiter.",
            ],
          },
        ],
      },
      {
        heading: "Das Kontaktformular",
        blocks: [
          "Über das Formular auf der Kontaktseite können Sie mit uns Kontakt aufnehmen, um ein Angebot anzufragen oder eine Zusammenarbeit zu besprechen.",
          {
            facts: [
              [
                "Verarbeitete Daten",
                "der Firmenname, die E-Mail-Adresse, Ihre Antworten auf die Fragen des Formulars (wo das Unternehmen heute steht, die gewünschte Leistung, der Budgetrahmen), die freiwillige Anmerkung sowie die Sprache der Seite, auf der Sie das Formular ausgefüllt haben. Firmenname und E-Mail-Adresse sind personenbezogene Daten, wenn sie eine natürliche Person identifizieren, etwa der Name eines Einzelunternehmers oder eine persönliche E-Mail-Adresse.",
              ],
              [
                "Zweck",
                "Ihre Anfrage zu beantworten, einzuschätzen, ob unsere Leistungen zu Ihrem Bedarf passen, und Gespräche vor einem Vertragsschluss.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe b DSGVO: Maßnahmen auf Ihre Anfrage vor Abschluss eines Vertrags. Wenden Sie sich als Vertreter oder Mitarbeiter eines Unternehmens an uns, ist die Rechtsgrundlage Artikel 6 Absatz 1 Buchstabe f DSGVO: unser berechtigtes Interesse, geschäftliche Anfragen zu beantworten.",
              ],
              [
                "Speicherdauer",
                "Kommt kein Vertrag zustande, 12 Monate ab dem letzten Nachrichtenwechsel; danach löschen wir die Daten. Kommt ein Vertrag zustande, bewahren wir die Korrespondenz 5 Jahre ab Vertragsende auf, die allgemeine Verjährungsfrist nach dem Ptk.",
              ],
              [
                "Bereitstellung",
                "freiwillig. Ohne Firmenname und E-Mail-Adresse können wir nicht antworten; ohne sie lässt sich das Formular daher nicht absenden.",
              ],
            ],
          },
          "Die Website speichert die Formulardaten nicht in einer Datenbank: Beim Absenden gehen sie als E-Mail in unserem Postfach ein und werden dort verarbeitet. Schreiben Sie uns statt über das Formular direkt per E-Mail, verarbeiten wir Ihre Angaben zum selben Zweck, auf derselben Grundlage und für dieselbe Dauer.",
          "Jede Anfrage wird von einem Menschen gelesen und beantwortet. Ihre Antworten im Formular werden nicht für automatisierte Entscheidungen oder Profiling verwendet.",
          "Um unerwünschte, automatisierte Einsendungen herauszufiltern, prüft das Formular ein verborgenes Feld und die Ausfülldauer. Daraus leiten wir keine personenbezogenen Daten ab und speichern keine.",
        ],
      },
      {
        heading: "Das Sprach-Cookie",
        blocks: [
          "Die Website verwendet ein einziges Cookie. Ein Cookie ist eine kleine Textdatei, die Ihr Browser auf Ihrem Gerät speichert.",
          {
            facts: [
              ["Name", "lineiq-locale"],
              [
                "Gesetzt von",
                "der Website selbst (Erstanbieter-Cookie), und nur, wenn Sie im Sprachwähler eine Sprache wählen. Wählen Sie keine, erhalten Sie kein Cookie.",
              ],
              [
                "Inhalt",
                "nur der Code der gewählten Sprache (en, hu oder de). Es enthält keine Kennung und keine personenbezogenen Daten.",
              ],
              [
                "Zweck",
                "rein funktional: Eine einfache Adresse (etwa /about) öffnet sich in der gewählten Sprache. Nichts wird verfolgt, ausgewertet oder weitergegeben.",
              ],
              [
                "Laufzeit",
                "1 Jahr, verlängert bei jeder erneuten Sprachwahl.",
              ],
              [
                "Attribute",
                "Path=/, SameSite=Lax, über https Secure. Nicht HttpOnly, weil der Sprachwähler es im Browser schreibt.",
              ],
            ],
          },
          "Dieses Cookie ist für einen von Ihnen ausdrücklich gewünschten Dienst unbedingt erforderlich und bedarf daher nach § 155 Absatz 4 des ungarischen Gesetzes C von 2003 über die elektronische Kommunikation und Artikel 5 Absatz 3 der Richtlinie 2002/58/EG keiner Einwilligung. Sie können es jederzeit in Ihren Browsereinstellungen löschen; die einfachen Adressen der Website öffnen sich dann auf Englisch.",
          "Die Website verwendet kein weiteres Cookie, lädt keinen Analyse- oder Tracking-Code und liefert ihre Schriften vom eigenen Hosting aus, sodass auch durch die Schriften keine Daten an Dritte gelangen.",
        ],
      },
      {
        heading: "Serverprotokolle",
        blocks: [
          "Die Website wird von unserem Hosting-Anbieter betrieben (siehe nächster Abschnitt). Beim Laden der Seiten erfasst dessen System technische Daten: die IP-Adresse, den Zeitpunkt der Anfrage, die Adresse der aufgerufenen Seite und die Kennung des Browsers (User-Agent).",
          {
            facts: [
              [
                "Zweck",
                "der sichere und zuverlässige Betrieb der Website sowie das Erkennen von Fehlern und Missbrauch.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe f DSGVO: unser berechtigtes Interesse am sicheren Betrieb der Website.",
              ],
              [
                "Speicherdauer",
                "Das System des Hosting-Anbieters bewahrt sie nur so kurz auf, wie der Betrieb es erfordert, und löscht sie dann automatisch. Wir verknüpfen diese Daten nicht mit anderen Daten und identifizieren damit keine Besucher.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Auftragsverarbeiter und Übermittlungen",
        blocks: [
          "Außer uns haben nur die Anbieter Zugriff auf die Daten, die als Auftragsverarbeiter am Betrieb der Website mitwirken, und nur soweit dies dafür erforderlich ist:",
          {
            list: [
              "Vercel Inc. (440 N Barranca Avenue #4133, Covina, CA 91723, Vereinigte Staaten; privacy@vercel.com): Hosting und Serverprotokolle.",
              "Plus Five Five, Inc., Betreiber von Resend (2261 Market Street #5039, San Francisco, CA 94114, Vereinigte Staaten; support@resend.com): Zustellung der Formularnachricht per E-Mail.",
              "Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland): der E-Mail-Dienst (Google Workspace), in dem wir Anfragen empfangen und beantworten.",
            ],
          },
          "Vercel und Resend verarbeiten Daten in den Vereinigten Staaten, Google kann einzelne Daten auch außerhalb der Europäischen Union verarbeiten. Grundlage dieser Übermittlungen ist der Angemessenheitsbeschluss der Europäischen Kommission vom 10. Juli 2023 zum EU-US-Datenschutzrahmen (Artikel 45 DSGVO), dem die Anbieter beigetreten sind, sowie die von der Kommission erlassenen Standarddatenschutzklauseln (Artikel 46 DSGVO).",
          "Wir verkaufen keine personenbezogenen Daten und geben sie niemandem zu Werbezwecken weiter. An Behörden geben wir Daten nur heraus, wo und soweit das Gesetz es vorschreibt.",
        ],
      },
      {
        heading: "Datensicherheit",
        blocks: [
          "Die Website ist nur über eine verschlüsselte (HTTPS-)Verbindung erreichbar. Zugriff auf Anfragen haben nur die Geschäftsführer von LineiQ. Wir schützen die Daten durch geeignete technische und organisatorische Maßnahmen vor unbefugtem Zugriff, Veränderung, Übermittlung, Offenlegung, Löschung und Vernichtung.",
          "Kommt es zu einer Verletzung des Schutzes personenbezogener Daten, handeln wir nach Artikel 33 und 34 DSGVO: Wir melden sie der Behörde und informieren auch Sie, wenn sie voraussichtlich ein hohes Risiko für Sie mit sich bringt.",
        ],
      },
      {
        heading: "Ihre Rechte",
        blocks: [
          "Nach der DSGVO haben Sie in Bezug auf die Verarbeitung folgende Rechte:",
          {
            list: [
              "Auskunft (Artikel 15): Sie können erfragen, ob wir Daten über Sie verarbeiten, und wenn ja, eine Kopie verlangen.",
              "Berichtigung (Artikel 16): Sie können verlangen, dass wir unrichtige Daten berichtigen und unvollständige vervollständigen.",
              "Löschung (Artikel 17): Sie können die Löschung Ihrer Daten verlangen, wenn sie nicht mehr benötigt werden oder die Verarbeitung unrechtmäßig ist.",
              "Einschränkung (Artikel 18): Sie können verlangen, dass wir Ihre Daten eine Zeit lang nur speichern, etwa solange wir ihre Richtigkeit prüfen.",
              "Datenübertragbarkeit (Artikel 20): Sie können die Daten, die wir auf Grundlage vorvertraglicher Maßnahmen verarbeiten, in einem strukturierten, maschinenlesbaren Format erhalten oder ihre Übermittlung an einen anderen Verantwortlichen verlangen.",
              "Widerspruch (Artikel 21): Sie können einer auf unser berechtigtes Interesse gestützten Verarbeitung aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.",
            ],
          },
          "Richten Sie Ihren Antrag an hello@lineiqgroup.com. Wir antworten unverzüglich, spätestens innerhalb eines Monats; diese Frist kann in begründeten Fällen um weitere zwei Monate verlängert werden, worüber wir Sie innerhalb des ersten Monats informieren. Auskunft und Maßnahmen sind kostenlos. Haben wir Zweifel an der Identität der antragstellenden Person, können wir zusätzliche Angaben zu ihrer Bestätigung anfordern.",
        ],
      },
      {
        heading: "Rechtsbehelfe",
        blocks: [
          "Wenn Sie meinen, dass Ihre Daten rechtswidrig verarbeitet werden, wenden Sie sich bitte zuerst an uns, damit wir das direkt beheben können. Sie können sich auch bei der ungarischen Nationalen Behörde für Datenschutz und Informationsfreiheit (NAIH) beschweren:",
          {
            facts: [
              ["Sitz", "1055 Budapest, Falk Miksa utca 9–11., Ungarn"],
              ["Postanschrift", "1363 Budapest, Pf. 9., Ungarn"],
              ["Telefon", "+36 1 391 1400"],
              ["E-Mail", "ugyfelszolgalat@naih.hu"],
              ["Website", "www.naih.hu"],
            ],
          },
          "Werden Ihre Rechte verletzt, können Sie auch ein Gericht anrufen (Artikel 79 DSGVO, § 23 Infotv.). Zuständig ist der Gerichtshof (törvényszék); Sie können die Klage nach Ihrer Wahl auch vor dem Gerichtshof Ihres Wohn- oder Aufenthaltsorts erheben. Haben Sie Ihren gewöhnlichen Aufenthalt in einem anderen Mitgliedstaat der Europäischen Union, können Sie sich auch bei der dortigen Datenschutzaufsichtsbehörde beschweren.",
        ],
      },
      {
        heading: "Kinder",
        blocks: [
          "Die Website richtet sich an Unternehmen. Von Personen unter 16 Jahren erheben wir wissentlich keine Daten.",
        ],
      },
      {
        heading: "Änderungen dieser Erklärung",
        blocks: [
          "Wir ändern diese Erklärung, wenn sich die Funktionsweise der Website oder die Rechtslage ändert. Die jeweils geltende Fassung steht immer auf dieser Seite, oben mit Versionsnummer und dem Datum, ab dem sie gilt.",
          "Diese Erklärung wurde auf Ungarisch verfasst. Ihre englische und deutsche Übersetzung dient der Information; bei Abweichungen geht der ungarische Text vor.",
        ],
      },
    ],
  },
};

export default de;

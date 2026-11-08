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
  [
    "Vertreten durch",
    "Kristóf Máté Kondora und Áron Sütő, Geschäftsführer, jeweils einzeln",
  ],
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
        heading: "Der Verantwortliche",
        blocks: [
          "Verantwortlicher für die in dieser Erklärung beschriebenen personenbezogenen Daten ist (LineiQ oder wir):",
          { facts: company },
          "Bei allen Fragen zu Ihren Daten erreichen Sie uns unter: **contact@lineiqgroup.com**. Wir sind nicht verpflichtet, einen Datenschutzbeauftragten zu benennen, und haben keinen benannt.",
        ],
      },
      {
        heading: "Geltungsbereich dieser Erklärung",
        blocks: [
          "Diese Erklärung informiert gemäß den Artikeln 13 und 14 der Verordnung (EU) 2016/679 (Datenschutz-Grundverordnung, DSGVO) und dem ungarischen Gesetz CXII von 2011 über das informationelle Selbstbestimmungsrecht und die Informationsfreiheit (Infotv.) darüber, welche personenbezogenen Daten wir als Verantwortlicher verarbeiten, woher sie stammen, zu welchem Zweck, auf welcher Rechtsgrundlage und wie lange wir sie verarbeiten, wer sie erhält und welche Rechte Sie haben. Sie gilt für Sie, wenn Sie:",
          {
            list: [
              "die Website www.lineiqgroup.com besuchen oder uns über deren Formular oder per E-Mail schreiben;",
              "bei einem Unternehmen arbeiten, das wir gefunden haben und das wir ansprechen dürfen (ein potenzieller Kunde);",
              "auf einer Social-Media-Plattform mit uns in Kontakt treten oder wir mit Ihnen;",
              "bei einem Partner von uns arbeiten oder einen Vertrag mit uns unterzeichnen;",
              "eine Rechnung von uns erhalten oder uns eine Rechnung stellen.",
            ],
          },
          "Sie gilt nicht für die personenbezogenen Daten der eigenen Kunden, Interessenten und Mitarbeiter eines Partners, die wir bei einem Projekt auf Weisung des Partners verarbeiten. Für diese Daten ist der Partner der Verantwortliche, und es gilt seine eigene Datenschutzerklärung; unsere Rolle regelt der Auftragsverarbeitungsvertrag mit dem Partner.",
        ],
      },
      {
        heading: "Kurz gesagt",
        blocks: [
          {
            list: [
              "Wir verarbeiten geschäftliche Kontaktdaten und das, was Sie uns mitteilen, sonst nichts.",
              "Über potenzielle Kunden nutzen wir nur öffentliche Informationen, und wir informieren sie spätestens in unserer ersten Nachricht.",
              "Wir verkaufen Ihre Daten nicht und geben sie niemandem für dessen Werbezwecke weiter.",
              "Über Sie wird keine automatisierte Entscheidung getroffen.",
              "Die Website verwendet weder Analyse noch Tracking und setzt nur dann ein Cookie, wenn Sie eine Sprache wählen.",
            ],
          },
        ],
      },
      {
        heading: "Anfragen über die Website und per E-Mail",
        blocks: [
          "Über das Formular auf der Kontaktseite können Sie ein Angebot anfragen oder eine Zusammenarbeit anstoßen. Schreiben Sie uns per E-Mail, gilt dasselbe.",
          {
            facts: [
              [
                "Verarbeitete Daten",
                "Der Firmenname, die E-Mail-Adresse, Ihre Antworten auf die Fragen des Formulars (wo das Unternehmen heute steht, die gewünschte Leistung, der Budgetrahmen), die freiwillige Anmerkung, die Sprache der Seite; oder der Inhalt Ihrer E-Mail. Firmenname und E-Mail-Adresse sind personenbezogene Daten, wenn sie eine natürliche Person identifizieren, etwa der Name eines Einzelunternehmers oder eine E-Mail-Adresse mit dem Namen einer Person.",
              ],
              [
                "Zweck",
                "Ihre Anfrage zu beantworten, einzuschätzen, ob unsere Leistungen passen, und Gespräche vor einem Vertragsschluss.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe b DSGVO: Maßnahmen auf Ihre Anfrage vor Abschluss eines Vertrags. Schreiben Sie als Vertreter oder Mitarbeiter eines Unternehmens: Artikel 6 Absatz 1 Buchstabe f DSGVO, unser berechtigtes Interesse, geschäftliche Anfragen zu beantworten.",
              ],
              [
                "Speicherdauer",
                "12 Monate ab der letzten Nachricht, wenn kein Vertrag zustande kommt. Kommt einer zustande, gilt Abschnitt 6.",
              ],
              [
                "Bereitstellung",
                "Nicht verpflichtend. Ohne Firmennamen und E-Mail-Adresse können wir nicht antworten, deshalb lässt sich das Formular ohne sie nicht absenden.",
              ],
            ],
          },
          "Die Website speichert das Formular nicht in einer Datenbank: Es erreicht unser Postfach als E-Mail. Um unerwünschte automatisierte Einsendungen auszufiltern, prüft das Formular ein verstecktes Feld und die Dauer des Ausfüllens; daraus leiten wir keine personenbezogenen Daten ab und speichern keine.",
        ],
      },
      {
        heading: "Potenzielle Kunden: Unternehmen, die wir selbst finden",
        blocks: [
          "Wir suchen Unternehmen, denen unsere Leistungen nützen können, und sprechen die Personen an, die sie leiten.",
          {
            facts: [
              [
                "Verarbeitete Daten",
                "Name, Position, geschäftliche E-Mail-Adresse und geschäftliche Telefonnummer, das Unternehmen, Links zu öffentlichen Geschäftsprofilen, die Quelle der Information, unsere kurzen Notizen dazu, ob unsere Leistungen zum Unternehmen passen könnten, sowie unser Nachrichtenwechsel mit Ihnen.",
              ],
              [
                "Herkunft der Daten",
                "Ausschließlich öffentliche Quellen: die Website des Unternehmens, öffentliche Geschäftsprofile und -seiten (zum Beispiel LinkedIn, Instagram, Facebook, YouTube, TikTok, Substack), Handelsregister, Presse sowie Empfehlungen von Personen, die Sie kennen.",
              ],
              [
                "Zweck",
                "Unternehmen zu finden, denen wir helfen können, und sie wegen einer Zusammenarbeit anzusprechen.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe f DSGVO: unser berechtigtes Interesse, Kunden für unser Unternehmen zu finden. Wir haben es gegen Ihre Interessen abgewogen und die Abwägung schriftlich festgehalten; Sie können sie unter contact@lineiqgroup.com anfordern.",
              ],
              [
                "Wann wir informieren",
                "Spätestens in unserer ersten Nachricht an Sie, in jedem Fall innerhalb eines Monats nach Erhalt Ihrer Daten. Entscheiden wir uns, Sie nicht anzusprechen, löschen wir Ihre Daten innerhalb dieses Monats und behalten nur den Namen des Unternehmens und den Grund unserer Entscheidung.",
              ],
              [
                "Speicherdauer",
                "12 Monate ab dem letzten Nachrichtenwechsel, wenn keine Zusammenarbeit zustande kommt; danach löschen wir Ihre Daten. Teilen Sie uns mit, dass Sie kein Interesse haben, hören wir sofort auf (siehe Abschnitt 15).",
              ],
              [
                "Bereitstellung",
                "Sie geben uns nichts; wir haben es gefunden.",
              ],
            ],
          },
          "**Dem können Sie jederzeit ohne Angabe von Gründen widersprechen: Dann sprechen wir Sie nicht mehr an und löschen Ihre Daten** (Artikel 21 Absätze 2 und 3 DSGVO). Es genügt, auf eine unserer Nachrichten entsprechend zu antworten oder an contact@lineiqgroup.com zu schreiben.",
        ],
      },
      {
        heading: "Ansprechpartner bei unseren Partnern",
        blocks: [
          "Wenn wir mit einem Unternehmen zusammenarbeiten, verarbeiten wir die Daten der Menschen, mit denen wir dort arbeiten.",
          {
            facts: [
              [
                "Verarbeitete Daten",
                "Name, Position, geschäftliche E-Mail-Adresse und Telefonnummer, unser Schriftverkehr und die Notizen zu Besprechungen.",
              ],
              [
                "Zweck",
                "Den Vertrag mit dem Partner vorzubereiten, zu erfüllen und abzuschließen.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe b DSGVO, wenn Sie selbst Vertragspartei sind (zum Beispiel als Einzelunternehmer). Sonst Artikel 6 Absatz 1 Buchstabe f DSGVO: unser berechtigtes Interesse, mit dem von Ihnen vertretenen Unternehmen zusammenzuarbeiten.",
              ],
              [
                "Speicherdauer",
                "Die Dauer der Zusammenarbeit und danach 5 Jahre, die allgemeine Verjährungsfrist nach § 6:22 des Bürgerlichen Gesetzbuchs (Ptk.).",
              ],
              [
                "Bereitstellung",
                "Für die Zusammenarbeit erforderlich; ohne Ansprechpartner können wir die Arbeit nicht ausführen.",
              ],
            ],
          },
          "**Das Starting Brief.** Zu Beginn der Zusammenarbeit füllen Inhaber und Freigeber des Partners in Tally ein Formular aus: ihre Kontaktdaten und ihre Antworten zum Unternehmen. Zweck und Rechtsgrundlage sind dieselben wie oben. Wir exportieren die Antworten in unseren verschlüsselten Speicher und löschen sie innerhalb von 30 Tagen in Tally; den Export bewahren wir anschließend für die oben genannte Dauer auf.",
        ],
      },
      {
        heading: "Unterzeichnung von Verträgen",
        blocks: [
          "Wir unterzeichnen Verträge elektronisch mit Adobe Acrobat Sign.",
          {
            facts: [
              [
                "Verarbeitete Daten",
                "Name, geschäftliche E-Mail-Adresse und Unterschrift der Unterzeichner sowie das Signaturprotokoll (die Zeitpunkte und Ereignisse der Unterzeichnung). IP-Adressen erfassen wir nicht.",
              ],
              [
                "Zweck",
                "Den Vertrag zu schließen und beweisen zu können.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe b DSGVO, wenn Sie als Vertragspartei unterzeichnen; Artikel 6 Absatz 1 Buchstabe f DSGVO, unser berechtigtes Interesse an einer nachweisbaren Unterschrift, wenn Sie für ein Unternehmen unterzeichnen.",
              ],
              [
                "Speicherdauer",
                "Die unterzeichnete Ausfertigung und ihr Protokoll: die Dauer der Zusammenarbeit und danach 5 Jahre. Die Ausfertigung in Acrobat Sign löschen wir, sobald wir sie in unserem Speicher abgelegt haben.",
              ],
              [
                "Bereitstellung",
                "Ohne Unterschrift kommt der Vertrag nicht zustande.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Rechnungsstellung und Buchhaltung",
        blocks: [
          {
            facts: [
              [
                "Verarbeitete Daten",
                "Name, Rechnungsadresse, Steuernummer, Rechnungsdaten.",
              ],
              [
                "Zweck",
                "Rechnungen zu stellen und unsere Buchführungs- und Steuerpflichten zu erfüllen.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe c DSGVO: rechtliche Verpflichtung nach dem ungarischen Gesetz CXXVII von 2007 über die Mehrwertsteuer (Inhalt der Rechnung) und dem Gesetz C von 2000 über die Rechnungslegung (Aufbewahrung).",
              ],
              [
                "Speicherdauer",
                "8 Jahre, wie § 169 des Rechnungslegungsgesetzes es vorschreibt.",
              ],
              [
                "Bereitstellung",
                "Ja, das Gesetz verlangt es; ohne sie können wir keine ordnungsgemäße Rechnung ausstellen.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Soziale Medien",
        blocks: [
          "Wir und unsere Gründer können Sie mit den Konten, die sie für LineiQ nutzen, auf Instagram, LinkedIn, YouTube, Facebook, TikTok und Substack ansprechen oder mit Ihnen sprechen. Was wir aus diesen Gesprächen festhalten, behandeln wir wie in Abschnitt 5 oder 6. Die Plattform selbst verarbeitet Ihre Daten nach ihren eigenen Bedingungen als eigener Verantwortlicher; darauf haben wir keinen Einfluss.",
          "Auf Facebook und Instagram (Meta) sowie LinkedIn stellt die Plattform den Seiteninhabern Statistiken über die Besucher der Seite zur Verfügung (Page Insights). Für diese Statistiken sind wir und die Plattform gemeinsam Verantwortliche; die Aufgabenverteilung regelt die Zusatzvereinbarung der Plattform, und Ihre Anliegen dazu bearbeitet die Plattform: [Meta Page Insights-Zusatz](https://www.facebook.com/legal/terms/page_controller_addendum), [LinkedIn Page Insights-Zusatz](https://legal.linkedin.com/pages-joint-controller-addendum). Wir sehen nur aggregierte Statistiken, nicht, wer Sie sind.",
        ],
      },
      {
        heading: "Das Sprach-Cookie",
        blocks: [
          "Die Website verwendet ein einziges Cookie. Ein Cookie ist eine kleine Textdatei, die Ihr Browser auf Ihrem Gerät speichert.",
          {
            facts: [
              [
                "Name",
                "lineiq-locale",
              ],
              [
                "Gesetzt von",
                "Der Website selbst (Erstanbieter-Cookie), und nur dann, wenn Sie im Sprachumschalter eine Sprache wählen. Wählen Sie keine, erhalten Sie kein Cookie.",
              ],
              [
                "Inhalt",
                "Ausschließlich der Code der gewählten Sprache (en, hu oder de). Keine Kennung und keine personenbezogenen Daten.",
              ],
              [
                "Zweck",
                "Rein funktional: Eine einfache Adresse (etwa /about) öffnet sich in der gewählten Sprache. Nichts wird verfolgt, ausgewertet oder weitergegeben.",
              ],
              [
                "Lebensdauer",
                "1 Jahr, das sich mit jeder erneuten Sprachwahl verlängert.",
              ],
              [
                "Eigenschaften",
                "Path=/, SameSite=Lax, Secure bei https. Nicht HttpOnly, weil der Sprachumschalter es im Browser schreibt.",
              ],
            ],
          },
          "Dieses Cookie ist für einen von Ihnen ausdrücklich gewünschten Dienst unbedingt erforderlich; nach § 155 Absatz 4 des ungarischen Gesetzes C von 2003 über die elektronische Kommunikation und Artikel 5 Absatz 3 der Richtlinie 2002/58/EG ist dafür keine Einwilligung nötig. Sie können es jederzeit in den Einstellungen Ihres Browsers löschen; die einfachen Adressen öffnen sich dann auf Englisch. Die Website verwendet kein anderes Cookie, lädt keinen Analyse- oder Tracking-Code und liefert ihre Schriftarten von ihrem eigenen Host aus.",
        ],
      },
      {
        heading: "Serverprotokolle",
        blocks: [
          "Wenn Seiten der Website geladen werden, erfasst das System unseres Hosting-Anbieters die IP-Adresse, den Zeitpunkt der Anfrage, die angeforderte Seite und die Kennungen des Browsers (User-Agent).",
          {
            facts: [
              [
                "Zweck",
                "Der sichere und zuverlässige Betrieb der Website; das Erkennen von Fehlern und Missbrauch.",
              ],
              [
                "Rechtsgrundlage",
                "Artikel 6 Absatz 1 Buchstabe f DSGVO: unser berechtigtes Interesse am sicheren Betrieb der Website.",
              ],
              [
                "Speicherdauer",
                "Die kurze Zeit, die der Betrieb erfordert; danach löscht das System des Hosting-Anbieters sie automatisch. Wir verknüpfen diese Daten nicht mit anderen Daten und identifizieren damit keine Besucher.",
              ],
            ],
          },
        ],
      },
      {
        heading: "Wer Ihre Daten erhält",
        blocks: [
          "Außer den beiden Geschäftsführern von LineiQ erhalten nur die folgenden personenbezogene Daten, und nur soweit ihre Aufgabe es erfordert.",
          "**Unsere Auftragsverarbeiter** (sie handeln auf unsere Weisung auf Grundlage eines Auftragsverarbeitungsvertrags):",
          {
            facts: [
              [
                "Proton AG (Schweiz)",
                "E-Mail (contact@lineiqgroup.com), verschlüsselte Dateiablage, Passwortmanager. Ort der Daten: Schweiz. Übermittlung außerhalb der EU/des EWR: Für die Schweiz gibt es einen Angemessenheitsbeschluss der Europäischen Kommission.",
              ],
              [
                "Supabase Pte. Ltd. (Singapur)",
                "Unser internes Arbeitssystem (Kontrast): die Daten potenzieller Kunden und Partner. Ort der Daten: EU (Frankfurt). Übermittlung außerhalb der EU/des EWR: Für Singapur gibt es keinen Angemessenheitsbeschluss der Europäischen Kommission; die Standardvertragsklauseln im Auftragsverarbeitungsvertrag von Supabase.",
              ],
              [
                "Tally BV (Belgien)",
                "Das Formular des Starting Brief. Ort der Daten: EU. Übermittlung außerhalb der EU/des EWR: Keine.",
              ],
              [
                "Adobe (Acrobat Sign)",
                "Elektronische Unterzeichnung. Ort der Daten: EU (Deutschland, Irland). Übermittlung außerhalb der EU/des EWR: Adobe Inc. (USA) ist nach dem EU-US-Datenschutzrahmen zertifiziert; ihr Vertrag enthält die Standardvertragsklauseln.",
              ],
              [
                "Vercel Inc. (USA)",
                "Hosting der Website, Serverprotokolle. Ort der Daten: USA. Übermittlung außerhalb der EU/des EWR: EU-US-Datenschutzrahmen; Standardvertragsklauseln.",
              ],
              [
                "Plus Five Five, Inc., Betreiberin von Resend (USA)",
                "Zustellung der über das Formular der Website gesendeten Nachricht per E-Mail. Ort der Daten: USA. Übermittlung außerhalb der EU/des EWR: EU-US-Datenschutzrahmen; Standardvertragsklauseln.",
              ],
              [
                "GitHub B.V. (Niederlande) und GitHub, Inc. (USA)",
                "Das private Repository, in dem wir unsere Arbeitsnotizen zu potenziellen Kunden und Partnern führen. Ort der Daten: USA. Übermittlung außerhalb der EU/des EWR: GitHub ist nach dem EU-US-Datenschutzrahmen zertifiziert.",
              ],
              [
                "Anthropic Ireland, Limited (Irland)",
                "Der KI-Assistent Claude (Team-Tarif, Firmenkonto): Wir nutzen ihn zum Recherchieren, Entwerfen und Ordnen, wozu auch das Lesen unserer Arbeitsnotizen zu potenziellen Kunden und Partnern gehört. Anthropic darf seine Modelle nicht mit diesen Daten trainieren. Ort der Daten: Für diesen Tarif nicht von Anthropic angegeben; wir gehen von den USA aus. Übermittlung außerhalb der EU/des EWR: Anthropic ist ein EU-Unternehmen; jede Weiterübermittlung erfolgt nach den Standardvertragsklauseln in seinem Auftragsverarbeitungsvertrag.",
              ],
            ],
          },
          "**Weitere Empfänger:**",
          {
            list: [
              "**Die Social-Media-Plattformen** (Abschnitt 9), jede nach ihren eigenen Bedingungen.",
              "**Unser Steuerberater und die Steuerbehörde** für die Rechnungsdaten, wie es das Gesetz verlangt.",
            ],
          },
          "Der Angemessenheitsbeschluss zum EU-US-Datenschutzrahmen ist der Beschluss der Europäischen Kommission vom 10. Juli 2023 (Artikel 45 DSGVO); die Standardvertragsklauseln sind die von der Kommission angenommenen (Artikel 46 DSGVO). Wir verkaufen keine personenbezogenen Daten. Daten geben wir an eine Behörde nur heraus, wo und soweit das Gesetz es verlangt.",
        ],
      },
      {
        heading: "Keine automatisierte Entscheidungsfindung",
        blocks: [
          "Über Sie wird keine Entscheidung mit automatisierten Mitteln getroffen, und wir erstellen kein Profil von Ihnen (Artikel 22 DSGVO). Ein KI-Assistent kann uns beim Recherchieren öffentlicher Informationen helfen, aber ein Mensch liest das Ergebnis und entscheidet jedes Mal.",
        ],
      },
      {
        heading: "Datensicherheit",
        blocks: [
          "Wir schützen personenbezogene Daten mit angemessenen technischen und organisatorischen Maßnahmen: einzelne Passwörter aus einem Passwortmanager und Zwei-Faktor-Authentifizierung, verschlüsselte Speicherung, so wenig Zugriff wie die Aufgabe erfordert, verschlüsselte und aktuell gehaltene Geräte sowie Vertraulichkeit für jeden mit Zugriff. Die Website ist ausschließlich über eine verschlüsselte (HTTPS-)Verbindung erreichbar. Kommt es zu einer Verletzung des Schutzes personenbezogener Daten, gehen wir nach den Artikeln 33 und 34 DSGVO vor: Wir melden sie der Behörde und informieren auch Sie, wenn die Verletzung voraussichtlich ein hohes Risiko für Sie mit sich bringt.",
        ],
      },
      {
        heading: "Ihre Rechte",
        blocks: [
          {
            list: [
              "**Auskunft** (Artikel 15): Sie können erfragen, ob wir Daten über Sie verarbeiten, und eine Kopie erhalten.",
              "**Berichtigung** (Artikel 16): Sie können unrichtige Daten berichtigen und unvollständige vervollständigen lassen.",
              "**Löschung** (Artikel 17): Sie können Ihre Daten löschen lassen, wenn sie nicht mehr benötigt werden, wenn Sie widersprochen haben oder wenn die Verarbeitung unrechtmäßig ist.",
              "**Einschränkung der Verarbeitung** (Artikel 18): Sie können verlangen, dass wir Ihre Daten nur für eine bestimmte Zeit speichern, zum Beispiel solange ihre Richtigkeit geprüft wird.",
              "**Datenübertragbarkeit** (Artikel 20): Die Daten, die Sie uns für einen Vertrag oder für vorvertragliche Schritte gegeben haben, können Sie in einem maschinenlesbaren Format erhalten oder an einen anderen Verantwortlichen übermitteln lassen.",
              "**Widerspruch** (Artikel 21): Sie können jederzeit aus Gründen, die sich aus Ihrer besonderen Situation ergeben, der Verarbeitung widersprechen, die auf unserem berechtigten Interesse beruht. **Wenn wir Sie wegen unserer Leistungen ansprechen, können Sie jederzeit ohne Angabe von Gründen widersprechen, und wir hören auf.**",
            ],
          },
          "Senden Sie Ihr Anliegen an contact@lineiqgroup.com. Wir antworten unverzüglich, spätestens innerhalb eines Monats; in begründeten Fällen kann diese Frist um weitere zwei Monate verlängert werden, worüber wir Sie innerhalb des ersten Monats informieren. Die Information und die Maßnahme sind kostenlos. Haben wir Zweifel an der Identität der anfragenden Person, können wir weitere Angaben zu ihrer Bestätigung verlangen. Ihr Anliegen und unsere Antwort bewahren wir 5 Jahre auf, um die Erledigung nachweisen zu können (Artikel 6 Absatz 1 Buchstabe f DSGVO: unser berechtigtes Interesse daran, innerhalb der fünfjährigen Verjährungsfrist nach § 6:22 Ptk.).",
        ],
      },
      {
        heading: "Rechtsbehelfe",
        blocks: [
          "Wenn Sie glauben, dass Ihre Daten rechtswidrig verarbeitet werden, wenden Sie sich bitte zuerst an uns, damit wir das Problem beheben können. Sie können sich auch bei der ungarischen Nationalen Behörde für Datenschutz und Informationsfreiheit (NAIH) beschweren:",
          {
            facts: [
              [
                "Sitz",
                "1055 Budapest, Falk Miksa utca 9–11., Ungarn",
              ],
              [
                "Postanschrift",
                "1363 Budapest, Pf. 9., Ungarn",
              ],
              [
                "Telefon",
                "+36 1 391 1400",
              ],
              [
                "E-Mail",
                "ugyfelszolgalat@naih.hu",
              ],
              [
                "Website",
                "www.naih.hu",
              ],
            ],
          },
          "Sie können auch ein Gericht anrufen (Artikel 79 DSGVO, § 23 Infotv.). Zuständig sind die Landgerichte (törvényszék), und Sie können Ihre Klage wahlweise beim Gericht Ihres Wohnsitzes oder Ihres Aufenthaltsorts erheben. Haben Sie Ihren gewöhnlichen Aufenthalt in einem anderen EU-Mitgliedstaat, können Sie sich auch bei der dortigen Aufsichtsbehörde beschweren.",
        ],
      },
      {
        heading: "Kinder",
        blocks: [
          "Unsere Leistungen richten sich an Unternehmen. Daten von Personen unter 16 Jahren verarbeiten wir nicht wissentlich.",
        ],
      },
      {
        heading: "Änderungen dieser Erklärung",
        blocks: [
          "Wir ändern diese Erklärung, wenn sich unsere Arbeitsweise oder die Rechtslage ändert. Die jeweils geltende Fassung steht immer unter lineiqgroup.com/privacy, mit Versionsnummer und dem Datum, ab dem sie gilt. Diese Erklärung wurde auf Ungarisch verfasst. Ihre englische und deutsche Übersetzung dient der Information; bei Abweichungen geht der ungarische Text vor.",
        ],
      },
    ],
  },
};

export default de;

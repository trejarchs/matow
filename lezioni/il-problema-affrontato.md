# Il problema affrontato

L’obiettivo perseguito in questo progetto è la realizzazione di un Framework lightweight per la creazione di siti web statici e responsive.

Il sito web generato deve avere un aspetto accattivante sia su desktop che su dispositivo mobile.

Il fine è quello di presentare diversi tipi di contenuto, da lezioni con scopo didattico a documentazione di sistemi software, evitando però di lavorare su HTML, CSS o JavaScript, ma fornendo esclusivamente file Markdown dei testi che si ha intenzione di pubblicare.

## Perchè Markdown?

E' importante capire la motivazione che sta alla base della scelta di Markdown per questo progetto, infatti ci si potrebbe chiedere: "perché non usare un qualsiasi altro metodo per scrivere documentazione, per esempio un editor come Microsoft Word?".

La risposta a questa domanda è che Markdown, a differenza dei cosiddetti *WYSIWYG* editor (*what you see is what you get*) come appunto Microsoft Word, è:

- **Portatile**: files che contengono testo formattato in Markdown possono essere aperti usando praticamente qualsiasi applicazione. Usando Microsoft Word il contenuto è "locked" in un formato di file proprietario.
- **Platform independent**: si può scrivere testo in Markdown su qualsiasi sistema operativo.
- **Future proof**: anche nel caso l'applicazione o editor che si sta usando per scrivere testo Markdown dovesse smettere di esistere, il testo rimarrebbe comunque visionabile in un qualsiasi altro editor. Questo punto è particolarmente importante quando si parla di libri, tesi universitarie o altri importanti documenti.

## Elenco dei requisiti funzionali

Un sistema che si pone questi obiettivi deve quindi avere determinate caratteristiche che possono essere riassunte brevemente di seguito:

- Interfaccia grafica semplice ed intuitiva
- Tempi di caricamento minimali
- Necessità della scrittura dei soli file Markdown
- Presenza di una barra di navigazione a sinistra
- Possibilità di mostrare o no la barra di navigazione
- Possibilità di cambiare tema (dark o light)
- Riconoscimento del tema preferito dell’utente al primo avvio
- Possibilità di ricercare lezioni attraverso parole chiave
- Possibilità di navigare velocemente alla lezione precedente o successiva
- Presenza di un indice dei contenuti
- Syntax Highlighting degli snippet di codice presenti nel documento

## Elenco dei requisiti non funzionali

- Lavorare esclusivamente lato client
- Implementazione del Client-Side Routing per navigare tra le lezioni
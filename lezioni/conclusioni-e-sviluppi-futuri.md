# Conclusioni e Sviluppi futuri

## Conclusioni

Nell'introduzione si è discusso di come la diffusione di internet, e in seguito dello smartphone, abbia causato un radicale cambiamento in come la popolazione ricerca e consuma informazioni e di come si possano sfruttare le potenzialità del Web per produrre corsi, tutorial o documentazione software in modo efficiente.

Abbiamo quindi illustrato quali sono state le motivazioni che hanno spinto allo sviluppo del framework MATOW sfruttando le potenzialità offerte dal linguaggio Markdown, indicando anche l'insieme di funzionalità e requisiti necessari affinchè il sistema software sviluppato risponda concretamente alle esigenze richieste.

Allora è stata descritta nel dettaglio la struttura del framework, spiegando come è stato implementato il meccanismo di routing lato Client, e in seguito la struttura del sito web illustrandone la presentazione grafica e alcune funzioni principali. Infine è stato presentato il workflow del framework attraverso un esempio di utilizzo.

Il progetto si era prefissato come obiettivo principale quello di facilitare e rendere il più accessibile possibile la condivisione di informazioni di qualsiasi tipo, dalla documentazione di sistemi software a materiale didattico.

Il framework MATOW sviluppato si è allora dimostrato in grado di rispondere a tutte le funzionalità richieste e a soddisfare gli obiettivi preposti: infatti attraverso una struttura di progetto ben definita ed un workflow minimale, è stato possibile rendere estremamente semplice la pubblicazione di testi scritti, anche grazie all'utilizzo di Markdown; e attraverso l'implementazione di un Responsive Web Design (RWD) e di un Client-Side Routing è stato possibile rendere il più piacevole e flessibile possibile la navigazione all'interno del sito web da parte dell'utente finale.

## Sviluppi futuri

Ciò nonostante, non si può ancora dire che siano assenti aspetti da migliorare e funzionalità da aggiungere.

In primo luogo si potrebbe implementare una command-line interface (CLI) per permettere la creazione della struttura base e l'inserimento delle lezioni, rendendo ancora più user-friendly l'utilizzo del framework. Infatti durante l'attuale fase di sviluppo è ancora necessario modificare il file data.js per far sì che il file Markdown sia correttamente visualizzato nel sito web, invece l'utilizzo di un'interfaccia nel terminale permetterebbe l'automatizzazione di questo passaggio.

Inoltre si potrebbe permettere all'utilizzatore del framework di personalizzare ulteriormente l'aspetto del sito: attualmente è limitato al layout predefinito, invece sempre utilizzando l'interfaccia a riga di comando potrebbe scegliere tra varie opzioni, per esempio la scelta del logo da visualizzare, dove posizionare la barra laterale oppure i colori principali del sito.
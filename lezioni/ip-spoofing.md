# IP-Spoofing

Da Wikipedia: 

"una tecnica di attacco informatico che utilizza un pacchetto IP nel quale viene falsificato l'indirizzo IP del mittente."

Utilizziamo questo attacco per testare le nostre configurazioni e come possiamo impostare i firewall per combatterli.

## Configurazione di rete:

![](./pics/r2c.png)

In questo caso C1 invia pacchetti a C2 fingendosi un altro nodo per trickare C2 in un comportamento non desiderato.
C1 e C2 sono in due reti diverse (separate dal router R) per simulare un attacco dalla rete, con una semplificazione:
- assumiamo che C1 conosca già l'indirizzo IP di C2

Se non fosse così avremmo una prima fase di Information Gathering per capire quali Ip usa la rete a cui appartiene C2.

## Client 1

Per creare i pacchetti che simulano l'attacco si utilizza una libreria di python che si installa con i seguenti comandi:
```bash
sudo apt update
sudo apt upgrade
sudo apt install python3.11
sudo apt install pipenv
sudo pip install --pre scapy[basic]
```

A questo punto si può lanciare `scapy`:
```bash
sudo scapy -H
```

Questo apre un editor da linea di comando per scrivere script python
```python
>>> from scapy.all import IP,Ether,TCP,UDP,send,ICMP
>>> pkt=IP(src="3.3.3.3", dst="<IP di C2>", ttl=43)/TCP(sport=4444, dport=44)
>>> ls(pkt)
>>> send(pkt)
```

In questo modo simuliamo una risposta inviata da un server remoto (il 3.3.3.3, qualcosa di Amazon) verso C2 sulla porta 44, che risponderà di conseguenza.

Per vedere se i pacchetti che stiamo forgiando funzionano, utilizziamo `tcpdump` per monitorare le interfacce:
```bash
sudo tcpdump -i 1 tcp
```

`-i` specifica l'interfaccia da monitorare, `1` specifica l'interfaccia, possiamo anche indicare il nome della interfaccia per essere più chiari.

Possiamo monitorare con tcpdump sia C1, C2 e il Router per vedere tutto il percorso del pacchetto e l'eventuale risposta generata da C2.

## Firewall

Come possiamo fermare questo tipo di attacco? Si utilizza iptables nel router per implementare regole di firewalling
```bash
sudo iptables -P FORWARD DROP
sudo iptables -A FORWARD -s 10.10.10.0/24 -p tcp --dport = 80 -j ACCEPT
sudo iptables -A FORWARD -p tcp --sport 80 -j ACCEPT
sudo iptables -A FORWARD -s 10.10.10.0/24 -p tcp --dport = 443 -j ACCEPT
sudo iptables -A FORWARD -p tcp --sport 443 -j ACCEPT
sudo iptables -A FORWARD -s 10.10.10.0/24 -p udp --dport = 53 -j ACCEPT
sudo iptables -A FORWARD -p udp --sport 53 -j ACCEPT
```

Con la prima regola blocchiamo tutto il traffico, poi creiamo delle regole che selettivamente fanno passare il traffico.

Nelle regole in cui compare la flag `-s` indichiamo che vogliamo accettare solo traffico proveniente dall'interno della rete, perciò gli indirizzi devono essere quelli appartenenti alla sottorete utilizzata dal servizio DHCP.

Vogliamo comunque permettere ai client all'interno della rete di navigare in internet senza che si accorgano del firewalling, perciò abilitiamo il traffico tcp con destination port la 80 e la 443, le porte usate da HTTP e HTTPS.

Le regole senza la flag `-s` servono per permettere alle risposte dei server web di arrivare ai client (traffico nel verso opposto), perciò saranno pacchetti tcp provieneti dalle porte 80 e 443.
Se non specificassi il source ip per considerare solo la mia sottorete, non risolvo nulla

Le regole che riguardano la porta 53 sono invece utilizzati dal DNS.

In questo modo il paccheto pkt creato in scapy viene droppato dal firewall, dato che l'indirizzo ip non appartiene al blocco `10.10.10.0/24`.

Chiaramente le regole vanno fatte in base a quali sono gli indirizzi Ip utilizzati nelle varie sotto-reti, usando `10.10.10.0/24` blocco lo spoofing su C1.

Per bloccare lo spoofing di C2 dovrei usare indirizzi Ip della sua sottorete, che nel nostro caso sono gli indirizzi Ip del laboratorio dato che C2 è bridgiato

## Esempio con switch virtuale

Se passiamo alla configurazione con lo switch virtuale, cambia qualcosa?

![](./pics/rs2c.png)

In realtà no, possiamo utilizzare sia le regole iptables nel router che nello switch, abbiamo la possibilità di scegliere Firewalling "Classico" o Trasparente.
Per far funzionare le regole scritte sopra, caricare il modulo:
```bash
sudo modprobe br netfilter
```

Un ulteriore passaggio che possiamo fare è bloccare l' r2l, Remote to Local (un pò improprio ma vabe), ovvero evitare che dall'esterno sia possibile accedere ai nodi interni alla rete.
Questo aiuta sia a prevenire lo spoofing che altri attacchi.

In questo caso vogliamo evitare che C2 sia in grado di contattare C1 autonomamente, vogliamo che C2 possa parlare con C1 SOLO se C1 ha cominciato la conversazione.
Il Natting da solo non basta, aiuta a mascherare gli Ip della rete interna ma non blocca questo attacco.

Affinchè C2 sia in grado di contattare C1(assumiamo che ne conosca l'Ip privato), va aggiunta alla tabella di routing una entry specifica per indicare dove rilanciare i pacchetti:
```bash
sudo ip route add 10.10.10.0/24 via <ip dell'interfaccia del router che sta nella stessa rete con C2>
```

In questo caso passiamo al **STATEFUL FIREWALLING**, il firewalling visto prima è stateless, ci sono delle regole statiche e si vede quali matchano i pacchetti.
Nel firewalling Stateful creiamo delle entry per le varie connessioni, specificandolo nelle regole iptables:
```bash
sudo iptables -P FORWARD DROP
sudo iptables -A FORWARD -s 10.10.10.0/24 -m state --state NEW,RELATED,ESTABLISHED -p tcp --dport = 80 -j ACCEPT
sudo iptables -A FORWARD -m state --state RELATED, ESTABLISHED -p tcp --sport 80 -j ACCEPT
sudo iptables -A FORWARD -s 10.10.10.0/24 -m state --state NEW,RELATED,ESTABLISHED -p tcp --dport = 443 -j ACCEPT
sudo iptables -A FORWARD -m state --state RELATED, ESTABLISHED -p tcp --sport 443 -j ACCEPT
sudo iptables -A FORWARD -s 10.10.10.0/24 -m state --state NEW, RELATED, ESTABLISHED -p udp --dport = 53 -j ACCEPT
sudo iptables -A FORWARD -m state --state RELATED, ESTABLISHED -p udp --sport 53 -j ACCEPT
```

Vogliamo che le entry siano generate solo se dai client interni alla rete, mentre dall'esterno accettiamo pacchetti solo legati a dei flussi già esistenti.
Nel caso di r2l però dobbiamo distiguere il caso in cui il Nat sia presente e quello in cui non sia presente, in quanto c'è da considerare l'effetto della trasformazione degli indirizzi Ip

# IPTables

Un po' di esempi di regole iptables usate in più occasioni:
```bash
sudo iptables -P <CATENA> <TARGET>
```

serve ad impostare la regola di default della catena, quello che facciamo di solito è partire da un DROP come regola di default.

```bash
sudo iptables -A INPUT -p icmp -j ACCEPT/DROP                #abilita/blocca traffico icmp(ping)
sudo iptables -A INPUT -p tcp --sport=80 -j ACCEPT/DROP      #abilita/blocca traffico tcp sulla porta 80(http)
sudo iptables -A INPUT -p udp --sport=53 -j ACCEPT/DROP      #abilita/blocca traffico udp sulla porta 53(DNS)
```
    
In particolare va guardato il funzionamento delle tables e delle chain, perchè abilitare/bloccare la chain di INPUT è solo metà della questione, va poi considerata la chain di FORWARD, ad esempio nel caso dei ping, se blocco solo chain input non accetto ping, ma li posso ancora creare ed inviare ad altri.

### Abilitare la funzionalità di Natting:

```bash
sudo iptables -t nat -A POSTROUTING -o <interface> -j MASQUERADE 
```
l'interfaccia serve a specificare dove effettuare la traduzione degli indirizzi, senza la flag -o il Natting è bidirezionale

### Cancellare regole:
```bash
sudo iptables <-t TABLE> -D <CATENA> <numero regola>
```

### Vedere le regole:
```bash
sudo iptables <-t TABLE> -L -v -x -n
```

### Logging:
```bash
sudo iptables -A FORWARD -p icmp -s <sottorete da monitorare> -j LOG 
```
i log sono salvati nel file `/var/log/syslog`

### PortMirroring:
```bash
sudo iptables -t mangle -A PREROUTING -j TEE --gateway <Ip del dispotivo a cui inviare il traffico>
```

### Esportazione statische Netflow:
```bash
sudo iptables -I FORWARD 1 -j NETFLOW
```
quando viene caricato il modulo viene specificato l'indirizzo Ip del collettore Netflow (`sudo modprobe ipt_NETFLOW destination=<Ip collettore>:2055`)
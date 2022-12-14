# Come creare uno Switch in Ubuntu 22.04

## Installazione VM in VirtualBox:

Anche in questo caso non servono grandi specifiche hardware, perciò basta assegnare 1GB di RAM e 1/2 core

In questo caso le schede di rete devono essere configurate come segue:
- una scheda di rete privata legata alla rete "**lab**", sarà l'interfaccia *enp0s3*
- una scheda di rete privata legata alla rete "**lab-int**", sarà l'interfaccia *enp0s8*

la rete "lab-int" sappresenta il collegamento tra switch e il nostro client, mentre "lab" è il collegamento tra switch e router

## CONFIG

Per poter creare lo switch si utilizza il pacchetto `bridge-utils`, che si installa tramite il comando:

```bash
sudo apt install bridge-utils
```

Dopo aver installato il pacchetto possiamo creare il bridge da linea di comando come segue:

```bash
sudo brctl addbr br0
sudo brctl addif br0 enp0s3 enp0s8
```

oppure possiamo modificare il file `/etc/netplan/00-installer-config.yaml` come segue:
```yaml
enp0s3:
    dhcp4: false
enp0s8:
    dhcp4: false
bridges:
    br0:
        dhcp4: false
        interfaces:
            - enp0s3
            - enp0s8
```

in questo modo lo switch viene caricato direttamente quando la macchina viene accesa
per evitare problemi, si disabilita il dhcp in tutte le porte, anche se non dovrebbe creare conflitti.

Se la VM è stata creata clonando ISN-Router, si deve disabilitare il server dhcp con il comando:

```bash
sudo service isc-dhcp-server stop
```
o andando a modificare il file `/etc/dhcp/dhcpd.conf` e commentando praticamente tutto.

Per vedere se tutto funziona, serve lanciare sia la VM Router (configurata come specificato nel file Router.txt) che un VM Client.
Il client deve avere una singola interfaccia di rete collegata alla rete privata lab-int e dovremmo vedere:
- l'unica interfaccia del client configurata con un indirizzo ip ottenuto dal server dhcp che gira sul VM Router
- il client riesce a navigare in rete

## Transparent Firewall

Per rendere lo switch un firewall trasparente, è necessario caricare un modulo che permetta ai pacchetti strato 2 di "salire" nella pila protocollare per interagire con iptables:

1. riconfigurare lo switch per far si che si connetta ad internet:

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```
- commentare tutte le voci che riguardano il bridge
- abilitare dhcp su enp0s3
- `sudo poweroff`
- da VirtualBox, bridgare l'interfaccia enp0s3, quindi quella legata alla rete privata "lab"
- riaccendere la macchina

2. installare i pacchetti ebtables con il comando:
```bash
sudo apt-get install ebtables
```

ebtables permette di mantere della tables nel kernel Linux che lavorano con le trame ethernet

3. a questo punto riandare nel file `/etc/netplan/00-installer-config.yaml` e rimettere tutto come prima praticamente

4. `sudo poweroff`

5. rimodificare l'interfaccia rete da bridged a rete privata su "lab"

6. Ora, caricare il modulo con il comando:
```bash
sudo modprobe br_netfilter
```

## Esempi

The bridge-netfilter code enables the following functionality:

>{Ip,Ip6,Arp} tables can filter bridged IPv4/IPv6/ARP packets, even when encapsulated in an 802.1Q VLAN or PPPoE header. This enables the functionality of a stateful transparent firewall.
>All filtering, logging and NAT features of the 3 tools can therefore be used on bridged frames.
>Combined with ebtables, the bridge-nf code therefore makes Linux a very powerful transparent firewall.
>This enables, f.e., the creation of a transparent masquerading machine (i.e. all local hosts think they are directly connected to the Internet).
>Letting {ip,ip6,arp}tables see bridged traffic can be disabled or enabled using the appropriate proc entries, located in `/proc/sys/net/bridge/`:
```
bridge-nf-call-arptables
bridge-nf-call-iptables
bridge-nf-call-ip6tables
```
>Also, letting the aforementioned firewall tools see bridged 802.1Q VLAN and PPPoE encapsulated packets can be disabled or enabled with a proc entry in the same directory:
```
bridge-nf-filter-vlan-tagged
bridge-nf-filter-pppoe-tagged
```
>These proc entries are just regular files. Writing '1' to the file (echo 1 > file) enables the specific functionality, while writing a '0' to the file disables it. 

## Regole con ebtables

Si possono creare le regole iptables utilizzando ebtables per filtrare traffico ethernet, saranno regole più semplici rispetto a quello di iptables perchè ci sono meno opzioni disponibili, ma il funzionamento è lo stesso, se una trama ethernet matcha una regola viene fatto quanto specificato.

Alcuni esempi (da https://ebtables.netfilter.org/documentation/bridge-nf.html):

**Basic Config**:
```bash
ebtables -P FORWARD DROP
ebtables -A FORWARD -p IPv4 -j ACCEPT
ebtables -A FORWARD -p ARP -j ACCEPT
ebtables -A FORWARD -p LENGTH -j ACCEPT
ebtables -A FORWARD --log-level info --log-ip --log-prefix EBFW
ebtables -P INPUT DROP
ebtables -A INPUT -p IPv4 -j ACCEPT
ebtables -A INPUT -p ARP -j ACCEPT
ebtables -A INPUT -p LENGTH -j ACCEPT
ebtables -A INPUT --log-level info --log-ip --log-prefix EBFW
ebtables -P OUTPUT DROP
ebtables -A OUTPUT -p IPv4 -j ACCEPT
ebtables -A OUTPUT -p ARP -j ACCEPT
ebtables -A OUTPUT -p LENGTH -j ACCEPT
ebtables -A OUTPUT --log-level info --log-ip --log-arp --log-prefix EBFW -j DROP
```

**Anti-spoofing rules**:
```bash
ebtables -A FORWARD -p IPv4 --ip-src 172.16.1.4 -s ! 00:11:22:33:44:55 -j DROP
```

This is an anti-spoofing filter rule. It says that the computer using IP address 172.16.1.4 has to be the one that uses ethernet card 00:11:22:33:44:55 to send this traffic.

Note: this can also be done using iptables. In iptables it would look like this:
```bash
iptables -A FORWARD -s 172.16.1.4 -m mac ! --mac-source 00:11:22:33:44:55 -j DROP
```
The difference is that the frame will be dropped earlier if the ebtables rule is used, because ebtables inspects the frame before iptables does. Also note the subtle difference in what is considered the default type for a source address: an IP address in iptables, a MAC address in ebtables.

If you have many such rules, you can also use the among match to speed up the filtering.
```bash
ebtables -N MATCHING-MAC-IP-PAIR
ebtables -A FORWARD -p IPv4 --among-dst 00:11:22:33:44:55=172.16.1.4,00:11:33:44:22:55=172.16.1.5 \ -j MATCHING-MAC-IP-PAIR
```

We first make a new user-defined chain MATCHING-MAC-IP-PAIR and we send all traffic with matching MAC-IP source address pair to that chain, using the among match. The filtering in the MATCHING-MAC-IP-PAIR chain can then assume that the MAC-IP source address pairs are correct.


Per capire se funziona tutto basta vedere se il filtraggio delle trame layer 2 ha effetto sulla navigazione del client
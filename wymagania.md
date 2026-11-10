Zasady:

Technologia: dowolna rozsądna. Nie przesadzaj ze stackiem — nie potrzebujemy np. React + Node + Drizzle; im prostszy projekt, tym lepiej. Projekt ma dać się uruchomić na każdym komputerze, a instrukcję uruchomienia opisz w README.
Praca z AI: pracuj z AI tak, jak pracujesz na co dzień. Zachowaj całą rozmowę (najlepiej w JSON-ie lub innym formacie, który da się wyeksportować), razem z informacją o automatycznie wybranych skillach, pluginach i serwerach MCP. Przed wysłaniem usuń z niej sekrety (klucze API, hasła, tokeny) oraz niezwiązane z zadaniem dane osobowe.
Termin: 7 dni od otrzymania tej wiadomości.
Odpowiedź: odpisz na tego maila z linkiem do repozytorium albo dysku w chmurze, albo z archiwum — w dowolny wygodny dla Ciebie sposób. Dołącz kod, pełną rozmowę z AI i instrukcję uruchomienia oraz upewnij się, że mamy uprawnienia dostępu.

Komentarze do projektu

01. Zasady ogólne
· Krótkie interakcje (hover): 200-250 ms; większe ruchy:
500-800 ms

· Jeden easing wszędzie: ease-in-out (cubic-bezier(0.4,
0, 0.2, 1)), ease-out dla powiększeń

· Animuj tylko transform i opacity

02.  Menu
Na hover w menu, zmiana tła na czyste białe tło + zmiana kolorów elementów na czarne, dla zachowania kontrastu

· Tło nagłówka: przezroczyste - #FFFFFF, 250 ms, ease-in-out
· Kolor tekstu, ikon i logo: biały - czarny, 250 ms, ease-in-out (ten sam timing co tło, żeby zmiana była jednoczesna)
· Powrót po zjechaniu kursorem: 250 ms, ease-in-out

03. Lampy w Hero
Pokaż swoją kreatywność w animacji

np.
włączanie lampy po wciśnięciu na nią, ruszające się lampy
przy ruszaniu kursorem

04. Slider
Automatyczny slider ze zmianą obrazu, delay 3s

· Autoplay co 3 s, crossfade między slajdami: 600 ms,
ease-in-out
· Lekki scale obrazu 1.05 - 1.0 w trakcie przejścia (800
ms, ease-out)
· Pasek postępu (żółty) wypełnia się liniowo przez 3 s,
reset po zmianie slajdu

05. Kafelki
Na hover, gdy najeżdzamy na pojedynczy kafelek:

· animacja powiększania obrazu +10%
· zmiana koloru czarnego przycisku na szary

· Obraz: scale 1 -> 1.1, 500 ms, ease-out (overflow hidden
na kafelku)
. Przycisk: tło czarny > szary (#4A4A4A), 200 ms, ease-
in-out

06. Sekcja shader
Dodanie animacji typu shader

Uwagi:
Przesłany przykład to gif, w którym animacja się ucina.
Docelowo animacja ma działać bez zacięcia, w ciągłej
płynności

· Płynna pętla bez cięć, animacja ciągła (nieskończony
loop, bez widocznego początku/końca)
· Wolne tempo, ok. 20-30 s na cykl, ruch falujący (ease-
in-out / noise-based)
· Realizacja jako WebGL/shader w czasie rzeczywistym,
nie GIF/wideo, żeby uniknąć zacięcia na pętli
· Tekst i przycisk statyczne, nad animacją
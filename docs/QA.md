# Weryfikacja

Sprawdzenia wykonano 9 listopada 2026 w przeglądarce Chromium dostępnej w aplikacji Codex, na lokalnym serwerze Python. Nie przeprowadzono testu na fizycznym telefonie ani oddzielnych sesji Safari/Firefox. Automatyczna przeglądarka zezwala tylko na HTTP/HTTPS i zablokowała protokół `file://`, więc bezpośrednie uruchomienie pliku nie zostało zweryfikowane tym narzędziem; strona korzysta ze zwykłych lokalnych zasobów i skryptów (bez modułów, fetch i routingu serwerowego).

## Wykonane sprawdzenia

- JavaScript: `node --check app.js` i `node --check shader.js` — poprawna składnia.
- Lokalny serwer zwraca HTTP 200; grafiki i font są dostępne lokalnie.
- Oględziny desktopu przy 1920 × 1080 i 1440 × 900; porównanie pełnej strony z referencją.
- Oględziny przy 768 × 1024, 390 × 844 i 320 × 720. Brak poziomego przewijania dokumentu w tych rozmiarach.
- Wszystkie obrazy po załadowaniu mają poprawne wymiary; brak nieudanych zasobów w końcowym sprawdzeniu.
- Brak ostrzeżeń i błędów w konsoli podczas sprawdzonych interakcji.
- Nagłówek przechodzi na białe tło i ciemne napisy przy fokusie; przełączenie kolorów korzysta z dwóch warstw o zmienianej opacity.
- Menu mobilne otwiera się i zamyka; przycisk aktualizuje `aria-expanded`.
- Rozwijana kategoria „Lampy” pokazuje odnośniki. Escape zamyka kategorię, kolejne Escape zamyka menu.
- Slider przełącza obrazy automatycznie; ręczne strzałki, paginacja, pauza i klawisze ←/→ zmieniają odpowiedni stan.
- Kliknięcie piaskowej lampy włącza światło, aktualizuje `aria-pressed` i etykietę; ponowne kliknięcie je wyłącza.
- Shader WebGL uruchamia się i wyświetla światło. W kodzie okres 26 s jest oparty na sin/cos; zatem początek i koniec cyklu są ciągłe.
- Dialog ustawień ciasteczek otwiera się i zamyka; nie zapisuje danych.

## Dodatkowy przegląd kodu

- Czasy interakcji: menu 250 ms, crossfade 600 ms, zoom slajdu 800 ms, kafelki 500 ms, przycisk 200 ms.
- Animacje CSS zmieniają jedynie transform i opacity.
- `prefers-reduced-motion`: bez autoplay/parallax i bez ruchu shadera; ręczna paginacja pozostaje dostępna. Ta ścieżka została przejrzana w kodzie, bez zmieniania globalnych ustawień systemowych użytkownika.
- Pauza po ukryciu karty/sekcji i po fokusie w treści slajdu; inaktywne slajdy są ukryte przed technologiami asystującymi oraz wyłączone z tabulacji.
- Brak WebGL / utrata kontekstu: tło CSS pozostaje dostępne. Ścieżka awaryjna została przejrzana w kodzie, nie wymuszano awarii GPU.
- Linki, etykiety i teksty są w HTML, niezależnie od działania animacji. Formularz wyszukiwania korzysta z natywnego GET do sklepu.
- Materiały graficzne nie są pobierane w czasie działania strony. Linki zewnętrzne nie są testowane przez składanie zamówień ani logowanie.

## Scenariusz odbioru

1. Otwórz `index.html`. Porównaj stronę desktopową z `reference/landing-page.png`.
2. Najedź na menu, potem przenieś kursor na hero. Sprawdź równoczesną zmianę tła i koloru elementów.
3. Wstrzymaj slider przyciskiem obok paginacji. Kliknij powierzchnię świecącą każdej z trzech lamp; przesuń kursor po banerze.
4. Wznów slider. Sprawdź dwie zmiany co około 3 sekundy, pasek postępu i płynne przenikanie.
5. Najedź na każdy kafelek. Powiększa się wyłącznie obraz, tekst pozostaje nieruchomy, a przycisk szarzeje.
6. Zatrzymaj widok na sekcji światła przez co najmniej 30 sekund. Nie powinien pojawić się skok na granicy cyklu.
7. Zmień szerokość na telefon. Sprawdź menu, teksty, kafelki oraz przewijanie.
8. Włącz ograniczenie animacji w swoim systemie/przeglądarce. Strona powinna być statyczna, z działającymi przyciskami slajdów.

Wartości cen, oceny i obietnic zakupowych są tekstem z makiety. Nie były przedmiotem weryfikacji oferty handlowej.

## Aktualizacja — 10 listopada 2026

- Hero używa trzech oddzielnych PNG dostarczonych przez użytkownika.
- Porównano ułożenie nowych warstw na desktopie 1440 px i telefonie 390 px.
- Ruch myszy nadaje różne przesunięcia i rotacje każdej lampie; potwierdzono różne wartości transformacji dla wszystkich trzech elementów.
- Światło porusza się razem z właściwym obrazem; kliknięcie beżowej lampy zmienia stan i rozświetla jej klosz.
- Tło i skała pozostają nieruchome. Oryginalne lampy są poza maską skały i nie pojawiają się pod przesuwanymi PNG.
- Wersja mobilna zachowuje kadr, a obszary przycisków czerwonej i zielonej lampy mają środki wewnątrz widocznego ekranu.
- Potwierdzono kliknięcie czerwonej i zielonej lampy na telefonie oraz ich wyłączenie klawiszem Enter.
- Zmiana slajdu nadal działa i ukrywa nieaktywny slajd przed technologiami asystującymi. Brak błędów lub ostrzeżeń w konsoli.
- Test integracyjny finalizatora eksportu na tymczasowym dzienniku potwierdził zapis odpowiedzi `phase: final_answer` do JSON i archiwum ZIP.
- Aktualne zrzuty interakcji: `previews/lamps-desktop.jpg` oraz `previews/lamps-mobile.jpg`.

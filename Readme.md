# SOLLUX — zadanie rekrutacyjne

Responsywna strona prezentacyjna marki oświetleniowej SOLLUX, przygotowana na podstawie materiałów referencyjnych. Projekt wykorzystuje HTML, CSS, JavaScript i WebGL, bez frameworków, instalowania zależności i procesu budowania.

To demonstracja interfejsu, a nie kompletny sklep internetowy. Wyszukiwarka wysyła zapytanie do zewnętrznego sklepu, a linki zakupowe, konto, koszyk i konfigurator prowadzą do serwisów marki. Ceny, ocena i komunikaty handlowe są treścią makiety. Okno ciasteczek jest informacyjne i nie zapisuje preferencji.

## Uruchomienie

Pobierz cały projekt, zachowując strukturę katalogów. Do działania strony potrzebna jest współczesna przeglądarka; animowane tło wymaga dostępnego WebGL. W razie jego braku pozostaje statyczne tło CSS.

### Bez instalacji

Otwórz `index.html` w przeglądarce. Kod korzysta z lokalnych zasobów i klasycznych skryptów, bez modułów oraz żądań `fetch`. Ten sposób wynika ze struktury kodu; nie został ponownie przetestowany w ramach poniższego przeglądu. Linki do strony głównej (`./`) mogą przy protokole `file://` otwierać katalog zamiast strony — do pełnego podglądu zalecany jest HTTP.

### Lokalny serwer HTTP

Jeżeli masz Python 3, uruchom terminal w katalogu projektu:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Na Windows można użyć `py` zamiast `python`, a na macOS/Linux `python3`. Otwórz [lokalny podgląd](http://127.0.0.1:8000). Serwer zatrzymasz skrótem `Ctrl+C`.

Node.js nie jest wymagany do działania strony. Python służy wyłącznie opcjonalnemu serwerowi i narzędziom pomocniczym. Wyświetlanie lokalnych grafik i fontu nie wymaga internetu; zewnętrzne linki i wyszukiwarka wymagają połączenia.

## Funkcje i architektura

- Nagłówek zmienia tło i wygląd elementów przy najechaniu oraz fokusie. Menu ma rozwijane kategorie i wariant mobilny.
- Hero zawiera dwa slajdy, strzałki, paginację, pauzę, obsługę klawiatury i gestu przesunięcia.
- Trzy lampy są osobnymi obrazami PNG. Kliknięcie włącza ich światło, a ruch myszy przesuwa i obraca je z różną intensywnością.
- Kafelki powiększają obraz i rozjaśniają przycisk bez przesuwania tekstu.
- Shader GLSL generuje falujące światło w czasie rzeczywistym, z okresem 26 sekund. Tekst i CTA pozostają nad animacją.
- Animacje respektują `prefers-reduced-motion`; slider i shader zatrzymują pętle przy ukryciu karty lub opuszczeniu widocznego obszaru.

`app.js` zarządza interakcjami DOM oraz czasem slidera przez `requestAnimationFrame`. `shader.js` oddzielnie obsługuje program WebGL, rozmiar płótna i utratę kontekstu. CSS realizuje przejścia przez `transform` i `opacity`; wizualna zmiana kolorów korzysta z nakładanych warstw.

```text
index.html                 struktura i treść strony
styles.css                 wygląd, responsywność i przejścia
app.js                     menu, slider, lampy i dialog
shader.js                  animacja WebGL/GLSL
assets/                    lokalne grafiki, ikony, font i licencja fontu
docs/reference/            materiały referencyjne
docs/previews/             zapisane podglądy wcześniejszej wersji/weryfikacji
docs/QA.md                 wcześniejszy raport testów i scenariusz odbioru
docs/ASSETS.md             źródła materiałów
docs/AI-WORKFLOW.md        opis wcześniejszej pracy z AI
tools/                     eksport rozmowy i pakowanie
wymagania.md               brief zadania
Readme.md                  opis projektu i wynik przeglądu
```

## Zgodność z wymaganiami

Ocena z 10 listopada 2026, oparta na bieżących plikach projektu. „Spełnione w kodzie” oznacza zgodność implementacji, a nie ponowne potwierdzenie wizualne w każdej przeglądarce.

| Wymaganie | Ocena | Uzasadnienie |
| --- | --- | --- |
| Prosty stack i instrukcja uruchomienia | Spełnione | Brak zależności wykonawczych i budowania; instrukcja powyżej. Nie można zagwarantować działania na dosłownie każdym komputerze, zwłaszcza ze starą przeglądarką. |
| Krótkie przejścia 200–250 ms, większe 500–800 ms | Spełnione w kodzie | Deklaracje przejść mieszczą się w tych przedziałach. |
| Wspólny easing i animowanie tylko transform/opacity | Spełnione w kodzie | `--ease: cubic-bezier(.4,0,.2,1)`, `ease-out` dla skali; wszystkie deklaracje `transition` dotyczą wyłącznie tych dwóch właściwości. Pasek postępu jest liniowy; shader jest osobnym, wymaganym efektem WebGL. |
| Białe tło menu i czarne elementy, 250 ms w obie strony | Częściowo | Tło jest białe, a warstwy przechodzą przez opacity w 250 ms. Tekst i ikony używają jednak `--ink: #141414`, a nie czystej czerni `#000000`. Logo jest przyciemniane do czerni filtrem. |
| Kreatywna interakcja lamp w hero | Spełnione w kodzie | Włączanie światła, niezależny ruch i obrót trzech lamp, aktualizacja `aria-pressed`. |
| Autoplay co 3 s | Spełnione w kodzie z celowymi pauzami | `DURATION = 3000`; pauza użytkownika, fokus w treści slajdu, hover lampy, niewidoczna sekcja/karta i ograniczenie ruchu zatrzymują licznik. |
| Crossfade 600 ms i skala 1.05 → 1.0 przez 800 ms | Spełnione w kodzie | Przejścia opacity slajdu i transform jego warstwy obrazu. |
| Żółty pasek postępu przez 3 s i reset | Spełnione w kodzie | Postęp wynika z czasu aktywnego odtwarzania, a `showSlide()` zeruje licznik. Przy dużych opóźnieniach klatek limit przyrostu 100 ms może wydłużyć realny czas slajdu. |
| Kafelki: skala 1.1, 500 ms, overflow hidden | Spełnione w kodzie | Zmiana obejmuje obraz, również przy fokusie klawiatury. |
| Przycisk kafelka: szary #4A4A4A, 200 ms | Spełnione w kodzie | Szara warstwa pseudoelementu pojawia się przez opacity. |
| Shader WebGL, płynny cykl 20–30 s, statyczny tekst | Spełnione w kodzie | Okres 26 s; okresowe sin/cos zachowują ciągłość na granicy cyklu; brak GIF-a i wideo. |
| Pełna rozmowa AI oraz informacje o narzędziach | Niespełnione w obecnym katalogu | Jest opis workflow i eksporter, ale nie ma `docs/ai-conversation.json`. Opis pracy nie zastępuje pełnego zapisu. |
| Usunięcie sekretów i niezwiązanych danych osobowych z rozmowy | Niepotwierdzone | Brak eksportu do kontroli. Eksporter filtruje wybrane wzorce, ale nie zapewnia kompletnego usunięcia wszystkich haseł, kluczy i danych osobowych. |
| Termin 7 dni i przekazanie dostępnego repozytorium/archiwum | Poza zakresem weryfikacji | Brak potwierdzonej daty otrzymania zadania i dowodu przekazania wraz z uprawnieniami. |

**Wniosek:** implementacja pokrywa główne wymagania funkcjonalne i animacyjne. Nie jest jeszcze kompletnym materiałem do oddania z powodu braku rozmowy AI. Dokładna zgodność kolorystyczna menu wymaga drobnej korekty.

## Ocena jakości kodu

Jakość jest dobra jak na niewielki, statyczny projekt rekrutacyjny. Stack odpowiada skali zadania, a rozdzielenie treści, stylów, interakcji i shadera jest czytelne. Nie ma uzasadnienia dla dodawania frameworka wyłącznie na potrzeby tej strony.

Mocne strony:

- Semantyczne przyciski i sekcje, etykiety ARIA, skip link, obsługa Escape i klawiatury.
- Nieaktywny slajd otrzymuje `inert` i `aria-hidden`, co ogranicza przypadkowy fokus na ukrytej treści.
- Kontrolowane pętle animacji, ograniczenie rozdzielczości shadera i zatrzymywanie pracy poza widokiem.
- Statyczne tło awaryjne przy braku WebGL, obsługa utraty i przywrócenia kontekstu.
- Lokalne zasoby, warianty obrazów mobilnych, lazy loading kafelków i dołączona licencja fontu.

Najważniejsze problemy i usprawnienia, w kolejności przed oddaniem:

1. **Brakuje rozmowy AI.** Uzupełnić rzeczywisty eksport obejmujący całą pracę nad zadaniem i sprawdzić jego treść przed udostępnieniem. `docs/AI-WORKFLOW.md` opisuje eksport jako istniejący, mimo że pliku obecnie nie ma.
2. **Pakowanie nie jest przenośne między systemami.** `tools/package.py` oczekuje `README.md`, podczas gdy ten plik ma zamówioną nazwę `Readme.md`. Windows zwykle toleruje różnicę wielkości liter, Linux nie. Skrypt pomija też `wymagania.md` i nie sprawdza, czy istnieje eksport rozmowy — może więc utworzyć niekompletną paczkę.
3. **Finalizator zakłada istnienie `.work/`.** `tools/finalize-export.py` zapisuje tam status, lecz nie tworzy katalogu. W obecnej strukturze zapis zakończy się błędem zarówno po sukcesie, jak i po przekroczeniu czasu oczekiwania.
4. **Dokumentacja i metadane eksportu mają nieaktualne ścieżki.** W części opisów oraz w `binary_attachments` eksportera występuje `reference/...` zamiast `docs/reference/...`. Listy narzędzi i skilli w eksporterze są wpisane na stałe, więc mogą nie odzwierciedlać późniejszych etapów pracy.
5. **Menu odbiega od literalnego koloru z briefu.** Warstwa tekstu i ikon ma `#141414`; przy wymaganiu czystej czerni należy zastosować `#000000` w odpowiednim zakresie.
6. **CSS jest rozbudowany względem rozmiaru strony.** Prawie 2000 linii i liczne nadpisania responsywne utrudniają śledzenie końcowych wartości. Warto uporządkować reguły według komponentów i ograniczyć powtarzające się korekty. Wcięcia HTML także wymagają ujednolicenia.
7. **Brakuje powtarzalnych testów interakcji.** Istnieje raport ręcznych sprawdzeń, ale brak zestawu testów regresji slidera, menu i shadera. Selekcje DOM w JS zakładają obecność wszystkich elementów — zmiana HTML może zatrzymać inicjalizację całego skryptu.

Nie zmieniano kodu aplikacji ani narzędzi w ramach tego przeglądu; wymienione problemy pozostają otwarte.

## Weryfikacja

W ramach tego przeglądu wykonano:

- `node --check app.js` i `node --check shader.js` — poprawna składnia obu plików.
- Parsowanie trzech skryptów Python przez `ast.parse` — poprawna składnia.
- Kontrolę lokalnych odwołań w HTML i `url(...)` w CSS — brak brakujących zasobów.
- Kontrolę identyfikatorów HTML, odnośników do fragmentów i `aria-controls` — brak duplikatów ID i brakujących celów.
- Przegląd czasów i właściwości wszystkich deklaracji `transition`, logiki slidera oraz okresowości shadera.
- Kontrolę obecności eksportu rozmowy i katalogu statusu finalizatora — oba nieobecne.

Nie uruchamiano w tej analizie nowych testów przeglądarkowych, audytu Lighthouse, czytnika ekranu ani testów na urządzeniach fizycznych. Poprawna składnia nie dowodzi poprawności działania interakcji ani kompilacji GLSL na konkretnym GPU. Wcześniejsze testy Chromium i zrzuty opisano w [raporcie QA](docs/QA.md); są to zastane wyniki, a nie ponowne testy wykonane podczas tworzenia tego README.

Do odbioru wizualnego należy porównać stronę z `docs/reference/landing-page.png`, sprawdzić menu, kliknięcia wszystkich lamp, minimum dwie zmiany slajdu, hover kafelków i co najmniej 30 sekund animacji shadera. Powtórzyć na szerokości mobilnej oraz z ograniczeniem ruchu.

## Materiały i praca z AI

Źródła grafik i fontu opisuje [docs/ASSETS.md](docs/ASSETS.md). Grafiki i znaki marki nie otrzymują przez ten projekt nowej licencji; dokumentacja wskazuje ich wykorzystanie do zadania rekrutacyjnego. Licencja Red Hat Display znajduje się w `assets/OFL-RedHatDisplay.txt`.

Opis wcześniejszej pracy z AI znajduje się w [docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md). Skrypt `tools/export-conversation.py` przyjmuje ścieżkę do wskazanego dziennika JSONL i zapisuje `docs/ai-conversation.json`. Przed przekazaniem należy sprawdzić kompletność rozmowy, aktualność metadanych i redakcję danych; eksport jednego dziennika nie scala automatycznie wielu rozmów. Skryptów pakowania i finalizacji nie należy traktować jako gotowej procedury przekazania bez uwzględnienia opisanych wyżej usterek.

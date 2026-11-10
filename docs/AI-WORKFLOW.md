# Praca z AI

Data rozpoczęcia: 9 listopada 2026, strefa Europe/Warsaw.

Asystent: Codex w aplikacji desktopowej. Nie używano subagentów. Nie wygenerowano obrazów przez AI — grafiki pobrano z publicznego serwisu marki wskazanej w referencji, a 10 listopada użytkownik dostarczył trzy PNG lamp.

## Automatycznie dobrane skille

- `sites:sites` — użyty do lokalnej implementacji, podglądu i kontroli strony. Wybrano samodzielny HTML/CSS/JS zgodnie z wymaganiem prostego projektu; rezultat przygotowano jako lokalną paczkę rekrutacyjną.
- `computer-use:computer-use` — przeczytany wraz z zasadami interakcji i potwierdzeń przed kontrolą przeglądarki. Weryfikację wykonano przez dostępny Unified Computer Use / Browser Use; nie uruchamiano automatyzacji natywnych aplikacji Windows.
- `openai-docs` — przeczytany przy sprawdzaniu możliwości zapisania rozmowy. Finalny eksport powstał bezpośrednio z lokalnego dziennika tej sesji; nie korzystano z API OpenAI ani klucza API.

Nie zastosowano skilli ImageGen, dokumentów, arkuszy ani prezentacji.

## Faktycznie użyte narzędzia i integracje

| Narzędzie / serwer | Zastosowanie |
| --- | --- |
| `functions.exec` | Orkiestracja dostępnych narzędzi i odkrywanie ich opisów. |
| `exec_command` / PowerShell / Python | Odczyt plików, pobranie publicznych materiałów, serwer lokalny, sprawdzenie składni, eksport i pakowanie. |
| `apply_patch` | Tworzenie i zmiana kodu oraz dokumentacji. |
| `view_image` | Oglądanie lokalnych grafik. |
| `web.run` | Próba odczytania sollux.pl; zakończyła się timeoutem. Publiczne materiały pobrano następnie przez Python HTTP. |
| `mcp__cua_repl` / Unified Computer Use | Podgląd i testy w przeglądarce: layouty, nawigacja, slider, lampy, dialog, konsola i screenshoty. |
| Codex app tools / Sites — odkrywanie opisów | Odczyt opisów dostępnych narzędzi. Nie utworzono hostowanego Site ani nowej rozmowy. |

Żądania zgody na dostęp do sieci dotyczyły pobrania publicznych grafik/fontu/licencji i lokalnego serwera podglądu. Nie korzystano z prywatnych kont sklepu, nie wysyłano formularzy zakupowych ani wiadomości do osób trzecich.

## Eksport rozmowy

Eksport jest w `ai-conversation.json`. Skrypt `tools/export-conversation.py` czyta wskazany dziennik JSONL, wybiera wiadomości użytkownika/asystenta i rekordy narzędzi oraz zapisuje rzeczywistą treść bez streszczania. Nie jest to odtworzony z pamięci opis rozmowy.

Wyłączenia:

- wewnętrzne rozumowanie modelu oraz wiadomości systemowe/deweloperskie;
- techniczne snapshoty środowiska niebędące wypowiedziami użytkownika;
- binarne dane obrazów i screenshotów — zastąpione informacją o ich pominięciu; wejściowe obrazy są w `reference/`;
- nazwa lokalnego profilu użytkownika, identyfikatory rozmów i wykryte wartości przypominające sekrety;
- niezwiązany z projektem spis aplikacji i tytułów okien zwrócony przez narzędzie przeglądarki.

Metadane eksportu podają czas graniczny. Zapis obejmuje treść utrwaloną w dzienniku do tego momentu. Przy tym przekazaniu uruchomiono jednorazowy skrypt `tools/finalize-export.py`: czeka on na zapis końcowej odpowiedzi asystenta i ponownie tworzy eksport oraz archiwum, po czym kończy działanie. Nie instaluje usługi ani zadania cyklicznego. Ewentualny brak końcowej odpowiedzi w dzienniku w ciągu 15 minut pozostawia poprzedni eksport. Po kolejnych wiadomościach należy uruchomić eksporter ponownie, aby dołączyć dalszy ciąg, a następnie ponownie spakować projekt.

Kod eksporterów zawiera dodatkowe filtrowanie poufnych wzorców. Żaden klucz API, token ani hasło nie był potrzebny do implementacji tej strony. Publiczne dane kontaktowe marki stanowią część materiału referencyjnego i pozostają w projekcie.

Aktualizacja 10 listopada: podłączono osobne PNG, niezależny ruch i powiązane z obrazami światło. Poprawiono też wykrywanie finalnej odpowiedzi w eksporterze dla formatu dziennika `phase: final_answer`; poprzednia migawka miała datę graniczną sprzed odpowiedzi końcowej, a nowy eksport obejmuje również tę odpowiedź i dalszą rozmowę.

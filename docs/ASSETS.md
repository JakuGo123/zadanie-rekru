# Źródła materiałów

Materiały pobrano 9 listopada 2026 z publicznej strony SOLLUX. Zachowano je lokalnie, aby demonstracja nie zależała od dostępności sklepu. Załączniki w `reference/` pochodzą od użytkownika i stanowią podstawę odwzorowania.

Grafiki i znaki towarowe należą do ich właścicieli. Użycie w tym projekcie ma wyłącznie charakter rekrutacyjny zgodnie z otrzymanym briefem. Logo SVG dostosowano do wersji z załącznika: usunięto aktualny jubileuszowy dopisek „10 lat”, zachowując oryginalne ścieżki logotypu.

| Plik lokalny | Źródło |
| --- | --- |
| `assets/hero-interior.webp` | [SOLLUX](https://sollux.pl/data/include/img/links/1784632280_rwd_desktop.webp) |
| `assets/hero-interior-mobile.webp` | [SOLLUX](https://sollux.pl/data/include/img/links/1784632280_rwd_mobile.webp) |
| `assets/hero-lamps.webp` | [SOLLUX](https://sollux.pl/data/include/img/links/1784548642_rwd_desktop.webp) |
| `assets/hero-lamps-mobile.webp` | [SOLLUX](https://sollux.pl/data/include/img/links/1784548642_rwd_mobile.webp) |
| `assets/logo.svg` | [SOLLUX](https://sollux.pl/data/gfx/mask/pol/logo_1_big.svg) |
| `assets/favicon.png` | [SOLLUX](https://sollux.pl/gfx/pol/favicon.png) |
| `assets/idosell.svg` | [SOLLUX](https://sollux.pl/ajax/poweredby_IdoSell_Shop_black.svg?v=1) |
| `assets/thoro.webp` | [SOLLUX](https://sollux.pl/data/include/cms/Idomods_szablon/buttons2/thoro-desktop.webp) |
| `assets/configurator.webp` | [SOLLUX](https://sollux.pl/data/include/cms/Idomods_szablon/buttons2/configurator-desktop.webp) |
| `assets/catalog.webp` | [SOLLUX](https://sollux.pl/data/include/cms/Idomods_szablon/buttons2/catalog-desktop.webp) |
| `assets/smart.webp` | [SOLLUX](https://sollux.pl/data/include/cms/Idomods_szablon/buttons2/smart-desktop.webp) |
| `assets/Dg_icon.jpg` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/StopkaPartnerzy/Dg_icon.jpg) |
| `assets/e-gazele-biznesu-2021.jpg` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/StopkaPartnerzy/e-gazele-biznesu-2021.jpg) |
| `assets/solidna-firma-2021.jpg` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/StopkaPartnerzy/solidna-firma-2021.jpg) |
| `assets/orly-oswietlenia.jpg` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/StopkaPartnerzy/orly-oswietlenia.jpg) |
| `assets/polska-gwarancja-jakosci.jpg` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/StopkaPartnerzy/polska-gwarancja-jakosci.jpg) |
| `assets/firma-godna-zaufania.jpg` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/StopkaPartnerzy/firma-godna-zaufania.jpg) |
| `assets/visa.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/visa.png) |
| `assets/master.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/master.png) |
| `assets/payu.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/payu.png) |
| `assets/paypal.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/paypal.png) |
| `assets/inpost.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/inpost.png) |
| `assets/dpd.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/dpd.png) |
| `assets/paczka.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/paczka.png) |
| `assets/dhl.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/dhl.png) |
| `assets/gls.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/gls.png) |
| `assets/pocztaPolska.png` | [SOLLUX](https://sollux.pl/data/include/cms/bannery/platnoscidostawa/pocztaPolska.png) |
| `assets/red-hat-display.woff2` | [Font używany przez SOLLUX](https://sollux.pl/data/include/cms/Idomods_szablon/font/RedHatDisplay-VariableFont_wght.woff2) |

Red Hat Display jest dołączony wraz z [licencją SIL Open Font License](../assets/OFL-RedHatDisplay.txt), pobraną z [oficjalnego repozytorium Google Fonts](https://github.com/google/fonts/blob/main/ofl/redhatdisplay/OFL.txt).

Ikony interfejsu są własnymi, prostymi rysunkami SVG. Flagi wykonano w CSS. Shader GLSL i kod interakcji napisano na potrzeby zadania. Nie kopiowano kodu CSS ani JavaScript sklepu.

## Aktualizacja 10 listopada 2026

Użytkownik dostarczył trzy niezmodyfikowane pliki PNG z przezroczystym tłem:

| Plik | Lampa |
| --- | --- |
| `assets/lampa1.png` | Beżowa |
| `assets/lampa2.png` | Zielona |
| `assets/lampa3.png` | Czerwona |

Każdy PNG jest niezależnym elementem w hero. Położenia dopasowano do oryginalnego banera. Tło nieba odtworzono gradientami CSS, a samą skałę pokazano przez statyczną maskę `clip-path` na oryginalnym obrazie. Żaden plik rastrowy nie został zmodyfikowany ani wygenerowany.

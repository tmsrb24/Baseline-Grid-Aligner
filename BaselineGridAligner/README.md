# BaselineGridAligner pro InDesign 2024

Plugin pro Adobe InDesign 2024, který umožňuje zarovnání textu k baseline gridu s pokročilými možnostmi nastavení.

## Funkce

- **Různé typy zarovnání**: Tracking, Baseline, Mezislovní mezery nebo Kombinované
- **Intuitivní UI panel**: Přehledné uspořádání ovládacích prvků
- **Nastavitelné parametry**: Zarovnání, barvy zvýraznění, přizpůsobení mezislovních mezer
- **Live preview**: Náhled změn v reálném čase
- **Dynamické přizpůsobení velikosti**: Panel se přizpůsobí velikosti okna
- **Možnost dockování**: Panel lze ukotvit v InDesignu
- **Paralelizace pomocí OpenMP**: Rychlejší zpracování více rámců
- **Lepší správa paměti**: Využití std::unique_ptr pro efektivní správu paměti
- **Dynamické přizpůsobení DPI**: Automatické přizpůsobení různým rozlišením obrazovky

## Systémové požadavky

- Adobe InDesign 2024 (verze 19.0 nebo novější)
- Windows 10/11 nebo macOS 12.0+

## Instalace

1. Zkopírujte složku `BaselineGridAligner` do adresáře s pluginy InDesignu:
   - **Windows**: `C:\Program Files\Adobe\Adobe InDesign 2024\Plug-Ins`
   - **macOS**: `/Applications/Adobe InDesign 2024/Plug-Ins`

2. Spusťte InDesign

3. Panel BaselineGridAligner najdete v menu Okna > BaselineGridAligner

## Použití

1. Otevřete panel BaselineGridAligner z menu Okna > BaselineGridAligner
2. Vyberte text, který chcete zarovnat k baseline gridu
3. Zvolte typ zarovnání:
   - **Tracking**: Upraví tracking textu pro zarovnání k baseline gridu
   - **Baseline**: Upraví baseline offset textu
   - **Mezislovní mezery**: Upraví mezery mezi slovy
   - **Kombinované**: Kombinace trackingu a mezislovních mezer
4. Nastavte další parametry podle potřeby:
   - Barva zvýraznění pro náhled
   - Faktor mezislovních mezer
   - Automatické aplikování změn
   - Zobrazování varování
   - Povolení náhledu změn
5. Klikněte na tlačítko "Aplikovat" pro zarovnání textu

## Kompilace ze zdrojového kódu

### Požadavky

- Adobe InDesign 2024 SDK
- C++ kompilátor s podporou C++17
- OpenMP (volitelné, pro paralelizaci)

### Postup kompilace

1. Naklonujte repozitář
2. Nastavte proměnné prostředí pro InDesign SDK
3. Spusťte kompilaci pomocí skriptu build.sh (macOS) nebo build.bat (Windows)
4. Zkopírujte zkompilovaný plugin do adresáře s pluginy InDesignu

## Struktura projektu

- `source/` - Zdrojové kódy
  - `includes/` - Hlavičkové soubory
    - `BaselineGridAlignerID.h` - Definice ID a konstant
    - `BaselineGridAlignerSettings.h` - Třída pro správu nastavení
    - `BaselineGridAlignerPanel.h` - Definice UI panelu
    - `DPIScaler.h` - Třída pro přizpůsobení DPI
  - `BaselineGridAligner.cpp` - Hlavní implementace zarovnání
  - `BaselineGridAlignerSettings.cpp` - Implementace správy nastavení
  - `BaselineGridAlignerPanel.cpp` - Implementace UI panelu
- `resources/` - Zdrojové soubory
  - `manifest.xml` - Manifest pluginu

## Licence

© 2025 BaselineGridAligner
Všechna práva vyhrazena.

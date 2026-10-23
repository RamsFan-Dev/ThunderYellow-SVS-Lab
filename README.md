# Pokemon: ThunderYellow Version (2026 Special Edition)

## Official game website and downloads

- **[Official game homepage](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/)**
- **[Game update / cover art downloads](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/downloads/)**

The downloads page offers the verified **ThunderYellow v1 → Test 125N preview IPS patch** (requires the exact v1 game ROM) and the project's original cover artwork. Test 125N is a gameplay-tested **preview**, not a certified final release. A patch against a clean legally obtained LeafGreen Rev 1 base ROM is **not yet published**. Do not distribute full commercial ROMs.

**Community technical support and Delta save-state diagnostics**

- **[Open the public technical support website](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/support/)**
- **[Report a bug and attach a zipped `.svs` state](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues/new?template=bug-report.yml)**
- **[Review reported bugs and fixes](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues)**
- **[Visit the existing SVS Lab editor](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/)**
- **[Join the Reddit community](https://www.reddit.com/r/PokemonYellowThunder/)**

## Bug reporting

Describe your ROM test build (for example, Test 125N), Delta or other emulator version, the in-game location, what went wrong, and the exact steps to reproduce the issue. Attach your broken `.svs` file inside a `.zip` archive (up to 25 MB). Screenshots and multiple states from a single test sequence are welcome. **Do not upload a full copyrighted .gba ROM.**

**Privacy:** This is a public repository. Bug-report attachments may be viewed and downloaded by others. Do not upload confidential or sensitive personal information.

## SVS Lab v2.24 — Safe Bill's PC sorting, Pokémon storage and trainer funds

The [SVS Lab editor](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/) now includes:

1. **Add all supported species:** Open a verified Delta `.svs`, select **PC boxes**, expand **Add one of every available in-game Pokémon**, choose a level, and confirm. The editor adds missing species from the **386-species Generation III Pokédex** into **empty** PC slots without replacing your party or existing Pokémon. It blocks the operation when storage is insufficient or live and saved storage are inconsistent.
2. **Bill's PC management and sorting:** Select **PC boxes (14)** to edit boxed Pokémon without moving them into your party. Choose a non-destructive PC view sorted by **National Pokédex number, species name, Pokédex classification** (for example Seed or Mouse), **elemental type, level, or gender**. Search by name, type, classification or number. **Changing the view dropdown never moves any Pokémon.** To physically rearrange storage, select a view, tap **Preview physical PC sort**, review every proposed old/new Box and Slot, then tap **Confirm & apply physical sort**. The preview does not edit the save, and the physical operation can be undone before export. Optionally enable **Show Pokédex-number placeholders in empty PC slots** to preview suggested missing species without actually creating them. Existing Pokémon are never replaced by placeholders.
3. **Gender:** Choose **Male**, **Female**, or the species-supported fixed/genderless option for a selected Pokémon; gender is derived from the Gen III personality ID and changes preserve the existing nature and shiny setting. The **original starter Pikachu is protected**.
4. **Cash:** Change Pokédollars up to **999,999**, alongside the existing Casino Coins field. Wallet writes use the 32-bit FireRed encryption key and update verified FLASH/live RAM mirrors.

**Important testing instructions:** Back up the original `.svs` **and** your normal in-game `.sav`. Export the edited state as a **new** file, import it into the **same exact ROM version** in Delta, and choose **Load State**. Loading **Continue** reads the separate in-game `.sav` and will not show SVS-only edits. These new functions have passed static JavaScript, Gen III record, source-layout and sample-save consistency checks, but are **not yet gameplay verified in Delta**. Try a single box edit and cash change before using the bulk operations.

## Existing SVS Lab

The existing browser-based Delta SVS editor is preserved in the repository's root `index.html`. It runs locally in your browser with no upload server or external libraries. Save states are tied to the exact ROM version; the editor does not repair ROM follower startup code.

## Current gameplay-testing reference

Test 125N has passed Pikachu Surf/shore transitions and battle follow-up checks in user gameplay testing. Future issues can be tracked independently in [GitHub Issues](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues).

This is an unofficial fan project, not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.


## Bill's PC sorting (functional test, 2026)

The Bill's PC editor supports all 14 boxes (30 Pokémon slots each). Existing user-created box names are read from the uploaded Delta save and left unchanged.

1. Import a **fresh, verified** Delta \`.svs\` created with the same ROM build.
2. In **Party & PC Pokémon Editor**, open **PC boxes**, then choose any display sort. **Nothing physically moves** when changing the dropdown.
3. For a physical reorder, tap **Preview physical PC sort** and examine the full before/after list of Box and Slot positions. Then explicitly tap **Confirm & apply physical sort** and accept the final confirmation. The untouched original file retains its previous arrangement.
4. National Pokédex sorting places the first copy of each species into its **exact numbered slot**, leaving empty spaces for missing species. Extra copies are preserved in spare slots.
5. Sort by **name, type, classification, level, or gender** to compact entries in that order. **Current box slots** only displays the saved physical positions.
6. Use **Undo** before exporting to reverse the physical sort, or leave the preview unapplied for a read-only view. Download the edited \`.svs\` with Export and test in Delta before replacing your backup.

All current features are experimental for save editing: protect your original \`.svs\` and regular \`.sav\`. Sprite icons are intentionally deferred until functionality is verified.

### v2.24 read-only preview safeguards

- Sort dropdown = display-only; no save-state writes, no Undo entry and no Pokémon movement.
- Physical sort uses **Preview → Confirm & apply**, showing exact original and proposed Box/Slot positions for every relocated Pokémon before it changes data.
- Preview preserves the original source records and compares all 420 slots again before applying. A changed or unsafe snapshot forces another preview.
- A physical sort retains all Pokémon records, including duplicates; National Pokédex sorting leaves gaps for unowned species and sends duplicate copies to available spare slots. Existing box names and the party are untouched.
- Syntax and isolated sort-planner tests passed, and the previously uploaded `Perfect please review.svs` snapshot was inspected **read-only** (122 PC records / 116 distinct species; 14 valid FLASH sectors in each of two complete save groups). This is **not** a substitute for an actual Delta load-state gameplay test.

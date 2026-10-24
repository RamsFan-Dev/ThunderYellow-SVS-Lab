# Pokemon: ThunderYellow Version (2026 Special Edition)

## Official game website and downloads

- **[Official game homepage](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/)**
- **[First public release status](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/downloads/)**
- **[LeafGreen Rev 1 compatibility check and first-release installer](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/install/)**
- **[Play on iPhone & Android / find LeafGreen cartridge and backup](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/play/)**
- **[Download project cover art](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/artwork/)**

**Game release status: FIRST PUBLIC RELEASE — IN DEVELOPMENT.** Pokemon: ThunderYellow Version (2026 Special Edition) has not been publicly released. The game is undergoing further testing and release packaging; internal development build numbers are not public product versions. The browser installer can verify a user-provided **Pokémon LeafGreen (USA, Rev 1 / 1.1)** file locally by size, GBA header and exact SHA-1 (`7862c67bdecbe21d1d69ce082ce34327e1c6ed5e`). Once a verified, approved first-release patch is published, it will generate a complete standalone `.gba` on-device. **No game patch is released at this time; the installer intentionally cannot create a ThunderYellow ROM yet. Do not distribute full commercial ROMs.**

**Emulators and original-game sourcing:** The site includes direct links to [Delta for iOS](https://apps.apple.com/us/app/delta-game-emulator/id1048524688), [Pizza Boy A Basic for Android](https://play.google.com/store/apps/details?id=it.dbtecno.pizzaboygba), a [search for authentic LeafGreen GBA cartridges](https://www.ebay.com/sch/i.html?_nkw=pokemon+leaf+green+version+authentic), and the [GB Operator cartridge-backup guide](https://www.epilogue.co/support/getting-started/what-is-gb-operator). The user must supply a lawfully sourced original compatible LeafGreen USA Rev 1 backup; a physical cartridge alone does not guarantee the right revision. There are **no commercial ROM downloads** linked, included or hosted.

## ThunderYellow visitor counter

The public `/game/` site includes a shared page-view counter on its homepage and subpages, powered by the free, no-account [CounterAPI.com](https://counterapi.com/) service. Source: `game/visitors.js` and `game/site.css`. Every production game-page load updates the same counter; local previews do not.

- **Measures page views, not unique people**. Reloads, repeat visits, and browsing multiple pages can increase the count.
- **Starts when deployed**, not when this site was first created; it cannot recover past GitHub Pages traffic.
- No cookies or personally identifying information are collected by our own script, but the third-party counter provider may process visitors' IP/browser details for abuse prevention and visit de-duplication according to its published privacy terms.
- The live number shows **—** instead of a fabricated zero when the counter cannot be reached. Ad blockers and network conditions can undercount; artificial calls and bots can overcount.
- All six public game pages share namespace `ramsfan-dev.github.io`, action `pageview`, and key `thunderyellow-game-site`. Changing these identifiers resets the displayed count.
- We intentionally do not count visits to the SVS Lab root editor as ThunderYellow game-site traffic.

**Community technical support and Delta save-state diagnostics**

- **[Open the public technical support website](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/support/)**
- **[Report a bug and attach a zipped `.svs` state](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues/new?template=bug-report.yml)**
- **[Review reported bugs and fixes](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues)**
- **[Visit the existing SVS Lab editor](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/)**
- **[Join the Reddit community](https://www.reddit.com/r/PokemonYellowThunder/)**

## Bug reporting

Describe your ROM version or internal test build (if known), Delta or other emulator version, the in-game location, what went wrong, and the exact steps to reproduce the issue. Attach your broken `.svs` file inside a `.zip` archive (up to 25 MB). Screenshots and multiple states from a single test sequence are welcome. **Do not upload a full copyrighted .gba ROM.**

**Privacy:** This is a public repository. Bug-report attachments may be viewed and downloaded by others. Do not upload confidential or sensitive personal information.

## SVS Lab v2.29 — Drag, drop and tap between Party and Bill's PC

**Rearrange Party & PC** now works across both areas, not just within PC boxes. While viewing Bill's PC, the **Your party** sprite strip above the boxes is a compatible source **and** destination. Tap a Pokémon in either area and then tap a destination, or drag between them. On iPhone, Pointer Events support touch dragging even when native HTML drag/drop on buttons is unavailable; tap-to-select/tap-to-place is the reliable fallback.

- **Occupied Party ↔ Occupied PC:** Swap the two Pokémon. The incoming boxed Pokémon is converted to a full 100-byte party record with reconstructed battle stats; the outgoing party member becomes a complete 80-byte box record.
- **Party → Empty PC:** Deposit any non-protected member *after the fixed follower Pikachu* and close the resulting party gap, reducing the live party count by one. Never leave an invalid middle-party gap.
- **PC → Next empty Party:** Withdraw a boxed Pokémon only into the next contiguous empty slot, increasing the party count. Full parties cannot accept a seventh member.
- **Follower safety:** The original follower Pikachu can never be selected, displaced or moved, and operations that would shift its locked party position are rejected.
- **Snapshot consistency:** Before changes, verify every active party Pokémon and complete 100-byte record across cartridge FLASH and live gameplay/SaveBlock1 RAM, as well as every matching PC FLASH copy and live storage mirror. Apply changes to all validated saved and live copies, update changed party counts, refresh FLASH checksums, and verify trainer/party identity and written PC data. Failures are rolled back; Undo and manual export remain available.
- **No unintended game modification:** Does not touch the ROM, original uploaded SVS or .sav file, original follower identity, or other PC slots. Confirms action before changing the working snapshot. Export a separately named SVS and use Delta → Load State to test.

**Validation:** Inline JavaScript parsing and isolated transfer tests passed for party deposit and compaction (3→2), PC withdrawal (2→3), occupied swap, original Pikachu byte-for-byte preservation, and protected-slot rejection. Browser-side iOS drag behavior and actual Delta loading are not yet verified.
## SVS Lab v2.28 — Touch-friendly PC rearranging and true shiny Pokémon icons

An optional six-column **Pokémon sprite grid** now displays the party and PC using FireRed/LeafGreen pixel artwork, with a dedicated **Your party** thumbnail strip above Bill's PC like a traditional Pokémon editor. The art is decorative and gracefully falls back to labels when unavailable. **Shiny** artwork and a ✨ badge appear only when the individual Pokémon's real Gen III PID/Original Trainer ID XOR calculation marks it as shiny; this also accurately shows the protected original shiny follower Pikachu without changing its identity. A 🎒 indicates a held item; 🔒 marks the protected starter. **Show Pokémon sprite grid** toggles back to the original detailed cards.

**Rearrange PC Pokémon** is a safe physical move/swap tool for iPhone/iPad and desktop. Load a verified Delta SVS, choose **PC boxes**, then click **Rearrange PC Pokémon**. Tap an occupied Pokémon to select it; switch to a different one of the 14 PC boxes if desired; tap an empty or occupied slot to **move or swap**. Tapping the selected source again or **Cancel selection** cancels. Desktop HTML drag-and-drop can also select a source and drop it on a target. All changes require a separate confirmation.

- Preserves complete 80-byte Pokémon records, personality ID, original Trainer ID, species, held items, original shiny state, all EV/IV/move data, duplicates and other unrelated PC slots.
- Checks existing 420 PC records and matching RAM mirrors, verifies both FLASH save groups for each proposed source/target, mirrors both changed slots to FLASH and active PC memory, refreshes sector checksums, then revalidates the active trainer and party. Writes are rolled back on verification failure.
- Protected follower Pikachu is not moved; **party editing uses the existing Party Builder & Switcher**, retaining its locked follower slot. The new compact party strip lets you quickly inspect party Pokémon, not rearrange that protected array.
- View-only sort and physical PC rearranging remain distinct. Enabling rearranging resets the view to **Current box slots**; selecting a view-only sort cancels rearrange mode. The original PC physical sort and bulk-add continue unchanged. **Undo** is available before exporting an edited SVS.
- Pokémon sprite files are served from PokeAPI's public GitHub sprite catalog. They require a network connection on the first view; the service worker caches viewed sprites when possible for later offline reuse. All text labels, shiny detection and save operations work without sprite downloads.

**QA:** Inline script syntax passed; isolated tests verified shiny Charizard/Pikachu artwork selection, moving to an empty slot, swapping occupied PC slots, preserving all 80-byte records in both simulated FLASH groups, and stale source-identity rejection. **Live iPhone Safari and Delta gameplay testing is still required.** Keep backups of both the original .svs and in-game .sav.
## SVS Lab v2.27 — Preview-first Bad Egg & save repair

Under **Pokémon cleanup → Repair my SVS — Bad Eggs & invalid Pokémon**, import a backed-up Delta save state and click **Diagnose & preview repair**. The repair assistant is available even when the imported SVS is otherwise READ-ONLY. The second **Download repaired SVS** button creates a separately named experimental file; the original uploaded SVS and active editor state are never modified.

- **Corrupted last party member:** Recognize the specific invalid Memento-only recovery Rattata from its encrypted record or a trailing member explicitly flagged as a Bad Egg. Require every preceding party member to remain valid, matching across FLASH copies. Require the saved party count, gameplay count, RAM SaveBlock1 count, tail record, and empty next slot to agree. Update every proven party copy and its FLASH checksum.
- **Bad Eggs in Bill's PC:** Remove only slots explicitly carrying the isBadEgg flag, matching across every complete cartridge save and every verified live PC RAM mirror. Ordinary Eggs and unflagged healthy Pokémon are left alone. If any required copy disagrees, refuse repair.
- **Safety gate:** Generate the repair from a copy of the original binary, validate every FLASH checksum and the normal active-trainer and party identity checks, then verify compressed output round-trip before download. No automatic creation of Pokémon or modification of original saves.
- **Old dangerous operation:** The legacy RAM-only Bad Egg wipe is disabled; raw RAM-only deletion could leave FLASH and party counts inconsistent.
- **Known limitations:** Does not automatically repair middle-party damage, missing live mirrors, unidentifiable corruption, or a battle in progress. Use Load State in the same ROM version and check party, PC, gameplay and follower before making a normal in-game save. Keep original .sav and .svs backups.

Static JavaScript and isolated positive/negative tests passed for the corrupt Rattata pattern, healthy starter preservation, mismatch rejection, flagged PC Bad Egg removal and normal Egg preservation. The integrated button has not yet been gameplay tested in Delta.
## SVS Lab v2.26 — Gym & League Team Coach

Inside **Party & PC Pokémon Editor → Party Builder & Switcher**, choose one of **10 battle guides**: the eight Kanto gym leaders, Elite Four preparation, or the Champion. The default preview is Cerulean Gym / Misty.

- **Owned Pokémon only:** read verified party and all 420 PC slots, without creating Pokémon, editing species/levels or touching the game save. Works as a *read-only* advisor with fewer than six party Pokémon. Six valid party Pokémon plus the unique follower Pikachu are still required for the existing Party Switcher to activate a recommendation.
- **Personalized team suggestions:** rank up to six Pokémon by useful existing attack moves, species type suitability, advisory minimum levels and availability. Show exact source party slot or PC box and slot, plus warnings for each Pokémon below the preparation target. Keep original follower Pikachu in the recommendations and its required party position.
- **10 battle checklists:** challenge tactics and five user-controlled preparation checkboxes per guide. The checkboxes are in-page coaching only; they do not award badges or mutate the SVS. They reset when importing a different save.
- **Use real supplies:** show the TM suggestions already in the bag, identify unavailable TMs as optional future goals, display available Potions/Revives/berries and encourage checking owned Item PC supplies. TM compatibility **must** be verified in-game; a suggestion does not imply the Pokémon can learn it or that the TM is obtainable before a gym.
- **Optional Team Builder handoff:** **Use suggested team in builder (preview only)** populates the existing six party selectors after validating source identities and follower position. The existing **Preview team exchange → Apply party to SVS** confirmation flow remains separate. Guidance itself is always read-only.
- **No cheating required:** the coach never generates Pokémon or supplies, raises levels, gives badges or teaches moves. Save states generally cannot prove which Pokémon were captured naturally rather than generated earlier by an editor, so it refers to **already-owned Pokémon** instead of claiming verified catch provenance.
- **Readiness estimates are guides, not guaranteed wins:** advisory levels and type hints are not validated boss-specific caps or full ThunderYellow damage/AI simulations. Boss compositions may differ in the modded ROM. Save normally in-game before battles.

**Test status:** JavaScript syntax and focused recommendation-planner tests passed, including all ten guides, a locked original Pikachu, level/move-based rankings, no repeated roster location and early-game partial parties. Real Safari/Delta workflow testing of the guide, checklist and Team Builder handoff is still needed.

## SVS Lab v2.25 — Preview-first Pokémon collection and safe PC sorting

The [SVS Lab editor](https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/) now includes:

1. **Add all supported species:** Open a verified Delta `.svs`, select **PC boxes**, expand **Add one of every available in-game Pokémon**, and choose a level. Click **Preview missing Pokémon & slots** for a read-only list of all missing species and their proposed Box/Slot destinations, including collisions and safe fallbacks. Then click **Confirm & add Pokémon** and approve the confirmation. Empty numbered National Dex positions are prioritized, and no occupied Pokémon, duplicates, custom box names or party members are replaced.
2. **Bill's PC management and sorting:** Select **PC boxes (14)** to edit boxed Pokémon without moving them into your party. Choose a non-destructive PC view sorted by **National Pokédex number, species name, Pokédex classification** (for example Seed or Mouse), **elemental type, level, or gender**. Search by name, type, classification or number. **Changing the view dropdown never moves any Pokémon.** To physically rearrange storage, select a view, tap **Preview physical PC sort**, review every proposed old/new Box and Slot, then tap **Confirm & apply physical sort**. The preview does not edit the save, and the physical operation can be undone before export. Optionally enable **Show Pokédex-number placeholders in empty PC slots** to preview suggested missing species without actually creating them. Existing Pokémon are never replaced by placeholders.
3. **Gender:** Choose **Male**, **Female**, or the species-supported fixed/genderless option for a selected Pokémon; gender is derived from the Gen III personality ID and changes preserve the existing nature and shiny setting. The **original starter Pikachu is protected**.
4. **Cash:** Change Pokédollars up to **999,999**, alongside the existing Casino Coins field. Wallet writes use the 32-bit FireRed encryption key and update verified FLASH/live RAM mirrors.

**Important testing instructions:** Back up the original `.svs` **and** your normal in-game `.sav`. Export the edited state as a **new** file, import it into the **same exact ROM version** in Delta, and choose **Load State**. Loading **Continue** reads the separate in-game `.sav` and will not show SVS-only edits. The user reported a successful PC sort with v2.24. The new v2.25 bulk-add flow has passed static and isolated planning tests, but **still needs in-game testing with Delta**. Try a single box edit and cash change before using the bulk operations.

## Existing SVS Lab

The existing browser-based Delta SVS editor is preserved in the repository's root `index.html`. It runs locally in your browser with no upload server or external libraries. Save states are tied to the exact ROM version; the editor does not repair ROM follower startup code.

## Current gameplay-testing reference

Selected internal builds passed Pikachu Surf/shore transitions and battle follow-up checks. This is development validation, not a public release or full regression test. Future issues can be tracked independently in [GitHub Issues](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues).

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

### v2.25 — Add All preview-first safeguards

- Choose a level, preview every missing species and destination, then explicitly confirm before any write.
- First reserve vacant physical National Dex positions, then use spare slots 387–420 or remaining empty locations for collisions. Never overwrite an occupant.
- Validate the active party and all 420 PC slots and preserve all duplicate Pokémon.
- The preview becomes invalid after a new save is loaded, any edit is saved, or the requested level changes.
- Immediately before applying, recompare 420 PC records and all saved party records, verify trainer identity, and validate each newly generated encrypted Pokémon record before writing.
- JavaScript syntax and isolated planner tests pass. Delta gameplay testing of bulk creation is outstanding; keep original `.svs` and `.sav` backups.

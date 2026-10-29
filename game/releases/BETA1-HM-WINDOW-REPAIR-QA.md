# ThunderYellow Test 125S — HM description help-window repair (experimental)

**User-confirmed Test 125R bugs:** field-move Cut and Flash descriptions display a full-width multicolor/rainbow stripe behind their readable text. Seen in the Pokémon party menu and reproducible every time.

## Root cause established by binary comparison

The approved Test125R ROM contains 40 bytes of injected executable Thumb code, pointer constants and text at **ROM 0x463560–0x463587**. The equivalent 40 bytes in the earlier protected pre-existing v1 gameplay ROM are all 0xFF and occur inside the 4bpp help-window graphic data beginning around ROM 0x463500. The Gen III party menu calls `DrawHelpMessageWindowTilesById` for all field-move descriptions, and that helper copies graphics tiles behind the text. This overlap explains both observed glitches. Code at ROM **0x10508C** calls this injected Thumb routine with a relative BL.

## Experimental 125S direct binary-only repair

- Source: byte-exact user-approved Test125R, SHA-256 **bf11349b1b10ec9245a08390fb34ef10a1b9325ec46210b70c4456b1c1f9948b**.
- Result: experimental Test125S, SHA-256 **221de700f6660ea99e0b30506ea9e75c2ee53186f664d2f561b230aa69484905**.
- Restore all source graphic bytes 0x463560–0x463587 from the earlier original reference ROM.
- Move equivalent Thumb logic and the in-game custom text to otherwise-unallocated 0xF8A400–0xF8A433.
- Put an eight-byte Thumb long-jump veneer at 0x0000EC–0x0000F3, preserving preexisting callback at 0x0000D0–0x0000EB.
- Redirect BL at 0x10508C from graphics region 0x463560 to veneer 0x0000EC, which invokes relocated Thumb routine via BX.
- Preserve the previous r6-based choice of message strings and original downstream call to 0x08104CD9. The new Thumb wrapper sets LR to its own after-call instruction before indirect BX into original function.
- **No** modifications to original Pikachu follower callback, protected end-credits, Surf or legendary data, Rattata and Bag guards, save files or source 125R.
- Incremental 125R→125S IPS patch: 135 bytes, round-trip verified locally. This is **not** a clean LeafGreen first release patch. No GBA/ROM file committed to GitHub.
- Header complement discrepancy remains separate hardware QA; not changed in 125S.

## Playtest gates (not yet tested)

1. Import 125S in Delta as a new game and retain backups. Check Cut and Flash in party HM menu; no striped graphic, descriptions and backgrounds readable.
2. Check any other field HM descriptions: Surf, Fly, Strength, Rock Smash, Waterfall.
3. Verify Pikachu follower after loading, post-battle recovery, four standard Poké Balls warn instead of being thrown, trainer-style rejection fallback, normal wild captures, and save/restart.
4. Check Continue/main-menu messages after relocation; custom string selection must still work.
5. Keep 125R the frozen beta baseline until 125S passes actual gameplay testing and the user explicitly approves a new baseline.

**References:** upstream decomp `pret/pokefirered/src/party_menu.c` function `ToggleFieldMoveDescriptionWindow` and `src/help_message.c` function `DrawHelpMessageWindowTilesById`. Decomp is a technical reference only; project changes are direct binary ROM patching.

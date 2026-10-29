# ThunderYellow Beta 1 — regression and cartridge test sheet

**Candidate:** Test 125R · **Public release:** not yet published

For every test, mark PASS / FAIL / NOT TESTED and note save origin, game area, exact reproduction steps, and screenshots/video if helpful.

| Test | Expected result | Status |
|---|---|---|
| Baseline new game | Starts and Pikachu follows at expected point | NOT TESTED |
| Continue from native in-game save | Follower works after loading | NOT TESTED |
| Special Rattata Battle: choose Fight | Memento faints Rattata and Pikachu continues following | NOT TESTED |
| Poké Ball at special Rattata | Item-use warning, no throw, no item lost, no turn consumed | NOT TESTED |
| Great Ball at special Rattata | Same as above | NOT TESTED |
| Ultra Ball at special Rattata | Same as above | NOT TESTED |
| Master Ball at special Rattata | Same as above | NOT TESTED |
| After warning then Fight | Memento victory and Pikachu resumes following | NOT TESTED |
| Specialty Ball at special Rattata | 125Q trainer-style capture denial; no Bad Egg (may be follower-risk; use backup) | NOT TESTED |
| Catch ordinary wild Rattata | Capture allowed | NOT TESTED |
| Catch other ordinary wild Pokémon | Capture allowed | NOT TESTED |
| Party/PC inspect and transfer | All legitimate Pokémon intact; no new Bad Egg | NOT TESTED |
| Pokémon party menu / Cut help strip | Party-screen bottom field-move description background and text readable | **FAIL — every time Cut selected; screenshot IMG_3655** |
| Pokémon party menu / Flash help strip | Field-move description "Light up darkness." rendered over correct background | **FAIL — screenshot IMG_3658 confirms same multicolor tile strip** |
| Pokémon party menu / other HM descriptions (Fly, Surf, Strength, Rock Smash, Waterfall) | All draw clean help-window background | NOT TESTED |
| Experimental Test125S graphics-only repair of field move help-window | Cut and Flash backgrounds repaired; main menu Continue and follower still work | NOT TESTED — ROM/IPS binary QA passed only |
| Party-menu rendering after closing/reopening and on other maps | Background tiles and text remain stable | NOT TESTED |
| Surf follower / known event regressions | Test prior protected behavior | NOT TESTED |
| Existing title/credits | Prior protected behavior retained | NOT TESTED |
| EZ-Flash Mode A Clean Boot | Game boots without addon cheats/save-state modifications | NOT TESTED |
| In-game save on cartridge | Save succeeds; power off then reboot and Continue | NOT TESTED |
| Repeat hardware cold restart | No save rollback or follower corruption | NOT TESTED |
| Public installer patch on clean LeafGreen Rev1 | Exact candidate output SHA-256: bf11349b...f9948b | BLOCKED: CLEAN BASE NOT PROVIDED |

**Known visual defect (2026-10-28):** User screenshot from internal Test 125R on S.S. Anne shows a full-width band of corrupted colorful tiles behind the Pokémon party context-menu help string when **Cut** is selected. The letters read approximately 'Cut a tree or grass.', but the background strip is corrupted. The on-screen prompt 'Do what with this PkMn?' and the Cut menu entry are intact. Do not attribute the issue to a separate Recharged Yellow SVS edit: user confirms this screenshot is ThunderYellow Test 125R and predates those edits. ROM differential: 125Q→125R changes only four Bag Poké Ball use-function pointers at 0x3E82B0/2DC/308/334 and code at 0xF8A300–0xF8A3D7, not directly the party menu tile data. This does not exclude an earlier patch or an indirect memory side effect. On 2026-10-28 the user confirmed the defect appears every time the Cut option is selected, not just once on S.S. Anne. Upstream party_menu.c shows ToggleFieldMoveDescriptionWindow -> DrawHelpMessageWindowTilesById (help_message.c) -> AddTextPrinterParameterized4, suggesting a window graphic/tile rendering path as first investigation target; this is a hypothesis rather than a proven root cause. Needs comparison with 125Q and controlled fresh save before a binary fix. Preserve Test125R. Beta release notes must disclose if unresolved; treat visual quality as an open Beta1 bug.

**Additional user evidence (2026-10-28):** Screenshot IMG_3658 shows party-menu selection **FLASH** with text **"Light up darkness."** rendered over the *same* horizontally corrupted multicolor help-background strip seen with CUT in IMG_3655. Thus at least **two field-move descriptions** are affected, indicating a **shared rendering/graphics path** rather than one damaged move description string. Do not claim other HMs are broken without testing. The upstream FRLG field move description routine `ToggleFieldMoveDescriptionWindow` calls `DrawHelpMessageWindowTilesById` to draw the same tiled background for all field-move descriptions, then prints the individual move string. Check 4bpp source graphic, help-window tile buffer, and VRAM tile offsets for data collisions or missing redraws. Keep Test125R frozen; test any prospective repair separately.

**Save safety:** Back up original native `.sav` before transferring it. Never rely on mid-battle `.svs` as your only backup. Test risky Rattata capture paths on throwaway copies. Distinguish verified binary checks from real gameplay results.

**New graphics-repair candidate:** [Test125S technical repair and playtest criteria](BETA1-HM-WINDOW-REPAIR-QA.md). The beta baseline remains Test125R until user verifies the fix in Delta.

**Go/no-go:** Do not mark `latest.json` released until all critical tests pass and the public clean-base patch is verified.

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
| Pokémon party menu / Cut help strip | Party screen bottom help text and graphics are readable, without colored tile corruption | **FAIL — reproduced every time Cut is selected on Test 125R (user report and screenshot)** |
| Party-menu rendering after closing/reopening and on other maps | Background tiles and text remain stable | NOT TESTED |
| Surf follower / known event regressions | Test prior protected behavior | NOT TESTED |
| Existing title/credits | Prior protected behavior retained | NOT TESTED |
| EZ-Flash Mode A Clean Boot | Game boots without addon cheats/save-state modifications | NOT TESTED |
| In-game save on cartridge | Save succeeds; power off then reboot and Continue | NOT TESTED |
| Repeat hardware cold restart | No save rollback or follower corruption | NOT TESTED |
| Public installer patch on clean LeafGreen Rev1 | Exact candidate output SHA-256: bf11349b...f9948b | BLOCKED: CLEAN BASE NOT PROVIDED |

**Known visual defect (2026-10-28):** User screenshot from internal Test 125R on S.S. Anne shows a full-width band of corrupted colorful tiles behind the Pokémon party context-menu help string when **Cut** is selected. The letters read approximately 'Cut a tree or grass.', but the background strip is corrupted. The on-screen prompt 'Do what with this PkMn?' and the Cut menu entry are intact. Do not attribute the issue to a separate Recharged Yellow SVS edit: user confirms this screenshot is ThunderYellow Test 125R and predates those edits. ROM differential: 125Q→125R changes only four Bag Poké Ball use-function pointers at 0x3E82B0/2DC/308/334 and code at 0xF8A300–0xF8A3D7, not directly the party menu tile data. This does not exclude an earlier patch or an indirect memory side effect. On 2026-10-28 the user confirmed the defect appears every time the Cut option is selected, not just once on S.S. Anne. Upstream party_menu.c shows ToggleFieldMoveDescriptionWindow -> DrawHelpMessageWindowTilesById (help_message.c) -> AddTextPrinterParameterized4, suggesting a window graphic/tile rendering path as first investigation target; this is a hypothesis rather than a proven root cause. Needs comparison with 125Q and controlled fresh save before a binary fix. Preserve Test125R. Beta release notes must disclose if unresolved; treat visual quality as an open Beta1 bug.

**Save safety:** Back up original native `.sav` before transferring it. Never rely on mid-battle `.svs` as your only backup. Test risky Rattata capture paths on throwaway copies. Distinguish verified binary checks from real gameplay results.

**Go/no-go:** Do not mark `latest.json` released until all critical tests pass and the public clean-base patch is verified.

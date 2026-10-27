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
| Surf follower / known event regressions | Test prior protected behavior | NOT TESTED |
| Existing title/credits | Prior protected behavior retained | NOT TESTED |
| EZ-Flash Mode A Clean Boot | Game boots without addon cheats/save-state modifications | NOT TESTED |
| In-game save on cartridge | Save succeeds; power off then reboot and Continue | NOT TESTED |
| Repeat hardware cold restart | No save rollback or follower corruption | NOT TESTED |
| Public installer patch on clean LeafGreen Rev1 | Exact candidate output SHA-256: bf11349b...f9948b | BLOCKED: CLEAN BASE NOT PROVIDED |

**Save safety:** Back up original native `.sav` before transferring it. Never rely on mid-battle `.svs` as your only backup. Test risky Rattata capture paths on throwaway copies. Distinguish verified binary checks from real gameplay results.

**Go/no-go:** Do not mark `latest.json` released until all critical tests pass and the public clean-base patch is verified.

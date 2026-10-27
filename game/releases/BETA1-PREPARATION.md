# ThunderYellow Beta 1 — release preparation (Test 125R)

**Status: PREPARATION ONLY. No public game release is available yet.** Do not upload a full GBA ROM or change `game/releases/latest.json` to released until all release gates below pass.

## Frozen beta candidate
- Public-facing version: **Pokémon ThunderYellow — Beta 1** (when published)
- Internal source build: **Test 125R** (do not use this label as a public version)
- Target SHA-256: `bf11349b1b10ec9245a08390fb34ef10a1b9325ec46210b70c4456b1c1f9948b`
- Target size: 16,777,216 bytes; game code `BPGE`; revision 1.
- ROM identified `FLASH1M_V` save support (128 KiB). Save operation on actual hardware is **not yet verified**.
- Test 125R retains Test 125Q's fail-safe for capture of temporary recovery Rattata and introduces Bag-level item-use rejection of Poké Ball, Great Ball, Ultra Ball, and Master Ball. Ordinary wild captures must still work.
- Freeze exact candidate bytes: no silent edits; any gameplay change requires a new test and hash.

## What is already verified
1. Test 125R GBA matches the original Test 125R testing-package GBA byte-for-byte.
2. Original ZIP archive passed its integrity check.
3. Internal Test125Q→Test125R IPS available and checksums documented. **It is NOT a clean LeafGreen base patch and must never be advertised as the public installer patch.**

## Blocking release gates (in order)
- [ ] Obtain and verify a **lawfully obtained original Pokémon LeafGreen USA Rev 1 (1.1)** 16 MiB GBA. SHA-1: `7862c67bdecbe21d1d69ce082ce34327e1c6ed5e`. Do not upload original to public repo.
- [ ] Run `game/release-tools/make_beta1_patch.py` with that clean base and the exact frozen Test125R target. Tool must produce an IPS which round-trips exactly to the SHA-256 above.
- [ ] Test public `/game/install/` experience using the **clean-base IPS**, not a Test125Q incremental patch. Confirm the final patched ROM's SHA-256.
- [ ] Gameplay regression: new game and Continue, Pikachu follower after a normal save and load, Memento recovery, no capture of special level-1 Rattata, four main Balls yield warning without spending a Ball, ordinary ball captures, party/PC integrity, no Bad Egg, title/credits, Surf and legendary encounters.
- [ ] Actual hardware regression on GBA / GBA SP with EZ-Flash Omega Definitive Edition B: clean boot, multiple in-game saves and cold restarts, follower after Continue, no save rollback. Use new test saves backed up from the cart. Avoid emulator save states/cheats during baseline tests.
- [ ] Review beta known issues and instructions and explicitly approve final public publication.

## Build public patch — only once source is verified
```bash
python3 game/release-tools/make_beta1_patch.py \
  --base /private/LeafGreen_USA_Rev1.gba \
  --candidate /private/ThunderYellow-Test125R.gba \
  --out /private/ThunderYellow-Beta1.ips
```
The builder validates exact source and target hashes before generating anything, applies its output to the source, verifies round-trip, and refuses to overwrite existing output. **Never use a patched ThunderYellow game as the `--base` input.**

On final QA approval, upload only the verified `ThunderYellow-Beta1.ips` to `game/releases/assets/`; assign `publicVersion` e.g. `Beta 1` in `game/releases/latest.json`, record exact patch and output hashes, verify from the published site, then publish release notes and Reddit announcement. Do not publish beta docs claiming tested behavior until tested.

## Cartridge and save quick reference
The 2026 **EZ-Flash Omega Definitive Edition B** is not the old 2021 Omega Definitive Edition. Verify blue PCB with `EZODE-B` marking and use only its matching kernel (`ezbluekernel.bin`), per manufacturer. Use a 4–128GB microSD; FAT32 is broadly compatible. Copy `.gba`, boot in Mode A and use **Clean Boot** for baseline testing. The game's in-game `.sav` (normally 128 KiB FLASH1M) is distinct from an emulator `.svs` save state. Never import an `.svs` directly as a cartridge save. Save in-game and test a full power cycle before trusting progress. Document firmware and test results.

Manufacturer downloads: https://www.ezflash.cn/download/
Hardware guide: https://github.com/ChimeraGaming/EZ-Flash_Guide/blob/main/Models/GBA/2026_EZ-Flash_Omega_Definitive_Edition_B.md
Project homepage: https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/

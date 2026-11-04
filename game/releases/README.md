# Pokémon ThunderYellow (2026 Special Edition) — Beta 1

**Status: PUBLIC BETA TESTING** — not a stable or finished release.

The public installer is at: https://ramsfan-dev.github.io/ThunderYellow-SVS-Lab/game/install/

## Release delivery

The website hosts a **patch only**, split into 16 binary parts under `game/releases/assets/`.
The installer downloads and reassembles them locally, validates the full IPS SHA-256,
applies the patch to the player's own verified LeafGreen original, and checks the
resulting 16 MiB GBA game SHA-256 before enabling the download. No original or
modified full commercial ROM file is hosted on the public repository.

- Public version: **Beta 1**
- Required original: **Pokémon LeafGreen (USA) Rev 1 / 1.1**, 16,777,216 bytes
- Header game code: `BPGE`, revision: `1`
- Original SHA-1: `7862c67bdecbe21d1d69ce082ce34327e1c6ed5e`
- IPS patch size (reassembled): **7,958,103 bytes**
- IPS SHA-256: `568f656821cf720b6b62591d0bdb9fd692d5bf449de89a60f42effd55b1e5936`
- Finished ThunderYellow Beta 1 SHA-256: `c5b09f9b65538353387ab40f5c6d0dbd7917df20579c53e9105df1ad33ca27d7`
- Website release metadata: `latest.json`
- Patch part filenames: `assets/ThunderYellow-Beta1.ips.part00` through `part15`

The 16 part blobs have been verified against their exact Git blob IDs. The
reassembled original IPS applies byte-for-byte to the supported LeafGreen Rev 1
game and reproduces the finished Beta 1 SHA-256.

## Tester notes

The public beta has not completed a full end-to-end gameplay and device matrix.
Back up all .sav/.svs files, and use a separate emulator game entry for testing.
Fresh saves are recommended. Test areas include Pikachu following after battles,
Surf and ledges, legendary encounters, story progress, and optional move and
Pokémon battle advice. The coach uses heuristics; its suggestions are not a
guarantee of maximum damage or safety.

Please report reproducible issues through
[technical support](../../support/) or the
[bug-report tracker](https://github.com/RamsFan-Dev/ThunderYellow-SVS-Lab/issues/new?template=bug-report.yml).

## Release controls

A publicly available manifest (`latest.json`) enables the installer only when:
`publicRelease=true`, `releaseStatus=released`, the exact base hash matches,
the patch part filenames are acceptable, the full IPS hash matches, and the
finished game hash matches. If any check fails, no ROM output is offered.

To issue an updated Beta 1 patch, add new uniquely named parts, verify all
fingerprints and round-trips, and update the manifest last. Do not replace
existing public parts in place, distribute full ROMs, or use internal test
numbers as public version names.

Unofficial, noncommercial fan project. Not affiliated with Nintendo,
Game Freak, or The Pokémon Company.

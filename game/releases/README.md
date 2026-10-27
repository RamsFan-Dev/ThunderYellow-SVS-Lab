# ThunderYellow Beta 1 first-release packaging

**Release-preparation branch:** [Test125R candidate, release blockers, and cartridge notes](BETA1-PREPARATION.md) · [Critical regression matrix](BETA1-TEST-MATRIX.md). No public ROM or IPS has been posted.

Official project: **Pokemon: ThunderYellow Version (2026 Special Edition)**

**Status: NOT RELEASED.** Test 125R is the internally approved Beta 1 release candidate; there is no public v1 or first public ROM/patch yet.

## Compatible original ROM

Players must provide their own lawfully obtained **Pokémon LeafGreen (USA) Rev 1 (also called 1.1)** GBA file.

- Original file size: **16,777,216** bytes.
- Game code: `BPGE`; GBA revision byte: `1`.
- Original ROM SHA-1: `7862c67bdecbe21d1d69ce082ce34327e1c6ed5e`.

The `/game/install/` webpage checks a visitor's chosen ROM locally and does **not** upload it or copy it to the server. It cannot currently generate a game because there is no first-release IPS patch.

## First-release developer procedure

1. Finish Test 125R regression and release-readiness testing. A good internal candidate is not a completed release.
2. Use your *privately held, user-supplied* compatible original LeafGreen Rev 1 game file and the internally tested Test 125R ROM. Keep both full ROMs **out of public GitHub**.
3. Run the local builder (Python 3, no external dependencies):

   ```bash
   python3 game/release-tools/make_beta1_patch.py \
      --base /private/path/pokeleafgreen_rev1.gba \
      --candidate /private/path/ThunderYellow-Test125R.gba \
      --out /private/path/ThunderYellow-Beta1.ips
   ```

4. The Beta 1 builder rejects incorrect inputs, creates a sparse IPS, round-trip applies it to the original, then checks the exact expected Test 125R output hash. The Beta 1 builder pins the verified Test 125R target SHA-256 and must be supplied with a clean original LeafGreen Rev 1 ROM, which is not yet available in this preparation workspace.
5. Complete actual gameplay and Delta compatibility checks using the **patched output**, not only the original internal candidate. Include known issues and installation instructions.
6. Only after explicit first-public-release approval, upload the **patch file only** to `game/releases/assets/` and update `game/releases/latest.json`:

   - `publicRelease`: `true`
   - `releaseStatus`: `"released"`
   - `publicVersion`: assigned official release number (not the old internal “v1” label)
   - `patch`: `{"format":"ips","path":"assets/ThunderYellow-FirstRelease.ips","sha256":"<VERIFIED PATCH SHA256>"}`
   - `expectedOutputSha256`: SHA-256 of the **exact verified target** ROM

7. Test the public `/game/install/` workflow with the supported original LeafGreen file: base hash, downloaded patch integrity, fully patched game hash and actual launch in Delta.
8. Only then update public download/status wording, release notes and Reddit announcements.

Do **not** upload, commit, or link to a full Nintendo ROM in the public repository. Never mark the manifest released merely because an experimental patch exists.

## Related pages

- [Game homepage](../)
- [Release status / downloads](../downloads/)
- [Local LeafGreen checker and release installer](../install/)
- [Original cover art](../artwork/)
- [Technical support](../../support/)

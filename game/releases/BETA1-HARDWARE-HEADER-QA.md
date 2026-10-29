# Beta 1 hardware boot header QA: discovered 2026-10-27

**PUBLIC RELEASE BLOCKER. Preserve frozen Test 125R as-is while evaluating a separate hardware-only checksum correction.**

Binary check of original Test 125R 16MiB GBA (SHA256 bf11349b1b10ec9245a08390fb34ef10a1b9325ec46210b70c4456b1c1f9948b):
- GBA header byte 0xBD stored complement = **0x7C**.
- Standard GBA complement calculation for bytes 0xA0..0xBC gives **0x80**.
- All supplied Test 125N, O, Q and R share the same legacy value. Emulator success does not prove original hardware accepts it.

Private experimental Test125R-H1 changes ONLY byte 0xBD from 7C to 80, without modifying follower, Rattata, Bag, battle or save logic.
- H1 SHA256: 94524637fbdc2991f199a6e761889686cc36be006debf86d8de088d72c565570.
- The original 125R remains unchanged.
- The Test125R->H1 IPS is 14 bytes and is NOT a public clean-base LeafGreen patch.

## Required tests
1. Test original 125R boot on a genuine GBA through EZ-Flash Mode A Clean Boot. Test H1 separately.
2. On H1, native in-game save followed by multiple full power-off / Continue cycles.
3. Verify four main Ball warnings, follower recovery, ordinary wild captures, Surf, PC and No Bad Egg.
4. If H1 passes and is selected as Beta 1, update make_beta1_patch.py expected candidate SHA to H1, build against clean LeafGreen Rev1, and repeat all release regression/patch tests. Never silently substitute H1 for 125R.
5. Record hardware marking, kernel version and tested hashes. Do not publish before go/no-go review.

GBA header format: https://reverseengineering.wiki/index.php/Format:Game_Boy_Advance_ROM_image

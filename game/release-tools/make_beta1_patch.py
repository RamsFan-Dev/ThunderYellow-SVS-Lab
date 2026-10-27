#!/usr/bin/env python3
"""Create and validate a sparse IPS patch for the ThunderYellow Beta 1 release candidate.

Local developer utility only. Keep source/target .gba files OFF the public repo.
This script outputs a delta patch, never a full Nintendo ROM. Do not publish until
the release candidate passes gameplay tests and has explicit release approval.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path

PROJECT = "Pokemon: ThunderYellow Version (2026 Special Edition)"
BASE_SIZE = 16_777_216
BASE_SHA1 = "7862c67bdecbe21d1d69ce082ce34327e1c6ed5e"
CANDIDATE_SHA256 = "bf11349b1b10ec9245a08390fb34ef10a1b9325ec46210b70c4456b1c1f9948b"
MAX_RECORD = 65535
IPS_EOF_OFFSET = 0x454F46

def sha1(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def build_ips(original: bytes, updated: bytes) -> bytes:
    if len(original) != len(updated):
        raise ValueError("IPS builder expects equal 16 MiB source/target sizes.")
    output = bytearray(b"PATCH")
    pos = 0
    size = len(original)
    while pos < size:
        while pos < size and original[pos] == updated[pos]:
            pos += 1
        if pos >= size:
            break
        start = pos
        # Offset 0x454F46 is interpreted as "EOF" by IPS parsers.
        # Include one preceding byte so the record begins at a safe offset.
        if start == IPS_EOF_OFFSET:
            start -= 1
        end = pos + 1
        while end < size and end - start < MAX_RECORD and original[end] != updated[end]:
            end += 1
        segment = updated[start:end]
        output += start.to_bytes(3, "big")
        output += len(segment).to_bytes(2, "big")
        output += segment
        pos = end
    output += b"EOF"
    return bytes(output)

def apply_ips(original: bytes, patch: bytes) -> bytes:
    if not patch.startswith(b"PATCH"):
        raise ValueError("Invalid IPS header")
    result = bytearray(original)
    i = 5
    while i < len(patch):
        if patch[i:i + 3] == b"EOF":
            if i + 3 != len(patch):
                raise ValueError("Unexpected trailing IPS bytes")
            return bytes(result)
        if i + 5 > len(patch):
            raise ValueError("Truncated IPS record")
        offset = int.from_bytes(patch[i:i + 3], "big")
        length = int.from_bytes(patch[i + 3:i + 5], "big")
        i += 5
        if length == 0:
            if i + 3 > len(patch):
                raise ValueError("Truncated IPS RLE record")
            length = int.from_bytes(patch[i:i + 2], "big")
            chunk = bytes([patch[i + 2]]) * length
            i += 3
        else:
            chunk = patch[i:i + length]
            if len(chunk) != length:
                raise ValueError("Truncated IPS data")
            i += length
        if offset + length > len(result):
            raise ValueError("Patch exceeds target size")
        result[offset:offset + length] = chunk
    raise ValueError("Missing IPS EOF")

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--base", type=Path, required=True,
                    help="Legally obtained original LeafGreen USA Rev 1 .gba")
    ap.add_argument("--candidate", type=Path, required=True,
                    help="Internal ThunderYellow Test 125R .gba")
    ap.add_argument("--out", type=Path, required=True,
                    help="New Beta 1 .ips file; must not already exist")
    args = ap.parse_args()
    locations = [p.resolve() for p in (args.base, args.candidate, args.out)]
    if len(set(locations)) != len(locations):
        ap.error("All file paths must be distinct.")
    if args.out.exists():
        ap.error("Output already exists. Refusing to overwrite any release asset.")
    base = args.base.read_bytes()
    target = args.candidate.read_bytes()
    if len(base) != BASE_SIZE or base[0xAC:0xB0] != b"BPGE" or base[0xBC] != 1:
        ap.error("Source is not a 16 MiB USA LeafGreen Rev 1 file.")
    if sha1(base) != BASE_SHA1:
        ap.error("Source SHA-1 does not match original LeafGreen Rev 1.")
    if len(target) != BASE_SIZE or sha256(target) != CANDIDATE_SHA256:
        ap.error("Test 125R candidate does not match expected internal ROM.")
    patch = build_ips(base, target)
    rebuilt = apply_ips(base, patch)
    if rebuilt != target or sha256(rebuilt) != CANDIDATE_SHA256:
        raise RuntimeError("Round-trip verification failed. NO patch was saved.")
    args.out.write_bytes(patch)
    print(json.dumps({
        "project": PROJECT,
        "candidate": "Test 125R (approved as beta candidate; public build not yet verified)",
        "source_sha1": sha1(base),
        "patch_size": len(patch),
        "patch_sha256": sha256(patch),
        "output_sha256": sha256(rebuilt),
        "verified": True,
        "public_release_approved": False
    }, indent=2))
    print("To publish, first complete release testing and explicitly approve "
          "a release. Upload ONLY the .ips to game/releases/assets/ and update "
          "latest.json with its SHA-256 and the target SHA-256; never upload "
          "the source/target .gba files.")

if __name__ == "__main__":
    main()

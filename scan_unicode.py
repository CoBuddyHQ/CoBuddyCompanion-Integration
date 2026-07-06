"""Find and fix mojibake in .tsx/.ts files."""
import os

# These are the actual corrupt byte sequences found in the file:
# ₹ (U+20B9) was encoded as Windows-1252 bytes C3 A2 E2 80 9A C2 B9
# – (U+2013) was encoded as C3 A2 E2 80 9C C2 93 (or similar)
# Let's detect the pattern: C3A2 prefix followed by mojibake continuation

# Strategy: decode file as UTF-8, look for multi-char sequences that
# are the result of latin1/cp1252 bytes being encoded again as UTF-8.
# The pattern: byte 0xE2 -> 0xC3 0xA2; byte 0x80 -> 0xC2 0x80; etc.
# This is "UTF-8 bytes treated as Latin-1, then re-encoded as UTF-8"

# Reverse mapping: correct_char -> corrupt_sequence_as_unicode_codepoints
FIXES = [
    # ₹ U+20B9: UTF-8 E2 82 B9 -> as latin1 -> U+00E2 U+0082 U+00B9
    # re-encoded as UTF-8: C3A2 C282 C2B9
    # As unicode chars: \u00e2\u0082\u00b9
    ('\u00e2\u0082\u00b9', '₹'),
    # But what we see in the hex is C3A2 E2809A C2B9
    # C3A2 = U+00E2, E2809A = U+201A, C2B9 = U+00B9
    ('\u00e2\u201a\u00b9', '₹'),
    # – U+2013: UTF-8 E2 80 93 -> as latin1 U+00E2 U+0080 U+0093 -> as UTF-8 C3A2 C280 C293
    ('\u00e2\u0080\u0093', '–'),  # this is actually the correct one already
    # but the corrupt form: E2 80 93 treated as latin1 -> \u00e2\u20ac\u201c? Let's check
    # — U+2014: E2 80 94 -> latin1 \u00e2\u20ac\u0094
    ('\u00e2\u20ac\u201c', '–'),   # en-dash from cp1252 double-encoding
    ('\u00e2\u20ac\u201d', '—'),   # em-dash
    ('\u00e2\u20ac\u2122', '™'),   # trademark
    ('\u00e2\u20ac\u2019', '\u2019'),  # right single quote
    # × U+00D7: latin1 already single byte, but may appear as C3 97
    # Ã (C3 83) + — should not appear
    # â€" = U+00E2 U+20AC U+201C -> –
    ('\u00e2\u20ac\u201c', '–'),
    ('\u00e2\u20ac\u201d', '—'),
    # What appears on line 185: â‚¹599â€"â‚¹999
    # â = U+00E2, ‚ = U+201A, ¹ = U+00B9  => ₹
    # â€" = U+00E2 U+20AC U+201D => –  (actually â€" is cp1252 for –)
    # In the file as UTF-8 bytes of these chars:
    # ₹: \u00e2 \u201a \u00b9 (3 unicode chars encoding the 3 UTF-8 bytes of ₹)
    ('\u00e2\u201a\u00b9', '₹'),   # ← THE ACTUAL CORRUPTION
    # –: \u00e2\u20ac\u201c or \u00e2\u20ac\u201d
    # Let's check by looking at what â€" decodes to
    # "â€"" in the original display = bytes 0xE2 0x80 0x94 (em dash –) mis-read
    # As UTF-8 these 3 bytes decode to: U+00E2 (â) + U+0080 (PAD) + U+0094 (CCH)
    # Hmm. Let me approach differently and just fix what the hex showed:
    # Line 146 has: c3a2 e2809a c2b9 = â ‚ ¹
    # Line 153 same pattern for ₹
    # Line 185: need to check en-dash
]

# The definitive corruption pattern seen in hex:
# ₹ appears as bytes: c3 a2 e2 80 9a c2 b9 (6 bytes instead of 3)
# This decodes as UTF-8 to: U+00E2 U+201A U+00B9 = "â‚¹"  ← the corrupt string
DEFINITIVE_FIXES = [
    ('\u00e2\u201a\u00b9', '₹'),       # â‚¹ -> ₹
    ('\u00e2\u20ac\u201c', '\u2013'),   # â€œ -> – (en-dash) - check
    ('\u00e2\u20ac\u201d', '\u2014'),   # â€ -> — (em-dash)
    ('\u00e2\u20ac\u2022', '\u2022'),   # â€¢ -> • (bullet)
    ('\u00e2\u20ac\u2122', '\u2122'),   # â€¢ -> ™
    ('\u00e2\u20ac\u201d', '\u2014'),   # em-dash
    ('\u00e2\u20ac\u201c', '\u2013'),   # en-dash
    # minus sign − U+2212: bytes E2 88 92 -> as latin1 U+00E2 U+0088 U+0092
    # as UTF-8: C3A2 C288 C292 = â\x88\x92 hmm
    # × U+00D7 appears as Ã— = U+00C3 U+00D7
    ('\u00c3\u00d7', '\u00d7'),         # Ã— -> ×
    # â†' = U+00E2 U+2020 U+2019 (→)
    ('\u00e2\u2020\u2019', '\u2192'),   # â†' -> →
    # Ã— = × (times sign)
    # â€" = en-dash (different sequence)
    # Let's just detect what's actually in the files
]

found_any = False
for dirpath, dirs, files in os.walk('src'):
    for fname in sorted(files):
        if not (fname.endswith('.tsx') or fname.endswith('.ts')):
            continue
        fpath = os.path.join(dirpath, fname)
        try:
            with open(fpath, 'rb') as f:
                raw = f.read()
            text = raw.decode('utf-8')
            hits = []
            for corrupt, correct in DEFINITIVE_FIXES:
                if corrupt in text:
                    hits.append((corrupt, correct, text.count(corrupt)))
            if hits:
                found_any = True
                print("CORRUPTED: " + os.path.relpath(fpath))
                for c, ok, n in hits:
                    print("  '" + repr(c) + "' -> '" + ok + "'  (x" + str(n) + ")")
        except Exception as e:
            print("ERROR: " + fpath + ": " + str(e))

# Also check the actual bytes pattern c3a2 e2809a c2b9
print("\n=== Direct byte pattern scan ===")
BYTE_PATTERNS = [
    (b'\xc3\xa2\xe2\x80\x9a\xc2\xb9', '₹ rupee'),  # the actual corruption we saw
    (b'\xe2\x80\x94', 'OK em-dash'),
    (b'\xe2\x80\x93', 'OK en-dash'),
    (b'\xe2\x82\xb9', 'OK rupee'),
]
for dirpath, dirs, files in os.walk('src'):
    for fname in sorted(files):
        if not (fname.endswith('.tsx') or fname.endswith('.ts')):
            continue
        fpath = os.path.join(dirpath, fname)
        with open(fpath, 'rb') as f:
            raw = f.read()
        for pat, name in BYTE_PATTERNS:
            count = raw.count(pat)
            if count > 0:
                print(os.path.relpath(fpath) + " | " + name + " x" + str(count))

if not found_any:
    print("No definitive mojibake found via unicode scan")

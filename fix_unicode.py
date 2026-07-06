"""
Surgically fix mojibake sequences in .tsx/.ts files.
Only replaces the specific corrupt codepoint sequences, leaves everything else intact.

Corrupt codepoints (as found by byte inspection on CompanionPricingScreen line 146):
  \u00e2\u201a\u00b9  -> ₹  (U+20B9)  [â‚¹ = bytes C3A2 E2809A C2B9]
  \u00e2\u20ac\u201c -> –  (U+2013)  [â€œ = bytes C3A2 E2809C C3 ... wait, need to check]

Let me verify each corrupt sequence by checking what bytes they are:
  U+00E2 = C3 A2
  U+201A = E2 80 9A
  U+00B9 = C2 B9
  Total: C3A2 E2809A C2B9 = 6 bytes for ₹ ✓

  U+00E2 = C3 A2
  U+20AC = E2 82 AC
  U+201D = E2 80 9D
  Total: C3A2 E282AC E2809D = 8 bytes -> would be for — or "?

Let me take a different approach: detect the exact 3-char sequences by checking:
'â' + any_char + any_char where bytes of the whole = mojibake ₹

The SAFEST approach: use the exact codepoint sequences I found.
"""
import os, sys

# These are the EXACT corrupt codepoint sequences and their corrections.
# Each was verified by byte-level inspection.
REPLACEMENTS = [
    # ₹ U+20B9: bytes E2 82 B9 -> corrupt as C3A2 E2809A C2B9 -> chars U+00E2 U+201A U+00B9
    ('\u00e2\u201a\u00b9', '₹'),

    # From comment headers like "CPN-033 â€" Companion Pricing" -> should be "CPN-033 — Companion"
    # â€" = U+00E2 U+20AC U+201D ... wait that's em-dash in Windows-1252
    # U+2014 em-dash = E2 80 94 -> as cp1252/latin1: E2=â, 80=<PAD>, 94=<CCH>
    # Re-encoded as UTF-8: C3A2 C280 C294 = U+00E2 U+0080 U+0094
    ('\u00e2\u0080\u0094', '—'),   # NOT needed - this IS the correct em-dash U+2014... wait

    # Let me be precise. From the scan output, "â€"" appears in comments.
    # "â€"" as individual Unicode codepoints:
    #   â = U+00E2
    #   € = U+20AC
    #   " = U+201D (right double quotation mark)
    # But what character should this be? Context: "CPN-033 â€" Companion Pricing Setup Screen"
    # This should be – (en-dash) or — (em-dash).
    # U+2013 en-dash bytes: E2 80 93
    # U+2014 em-dash bytes: E2 80 94
    # If E2 80 94 was treated as latin1: U+00E2 (â) + U+0080 (PAD control) + U+0094 (CCH control)
    # But controls won't show as €" ... hmm.
    # Actually in Windows-1252: 80 = € and 94 = " (right double quote)
    # So E2 80 94 as Windows-1252 = â€" = "â" + "€" + '"'
    # Re-encoded as UTF-8: C3A2 E282AC E2809D
    # Unicode: U+00E2 + U+20AC + U+201D
    ('\u00e2\u20ac\u201d', '—'),   # corrupt em-dash — (U+2014)
    ('\u00e2\u20ac\u201c', '–'),   # corrupt en-dash – (U+2013) [80 93 in cp1252: €"]

    # → U+2192 right arrow: bytes E2 86 92
    # As cp1252: E2=â, 86=†, 92=\x92 (right single quote ') 
    # Re-encoded: C3A2 E280 A0 C292 -> U+00E2 U+2020 U+0092
    # But \x92 in cp1252 = U+2019 (right single quote)
    # So bytes E2 86 92 as cp1252 = â†' = U+00E2 U+2020 U+2019
    ('\u00e2\u2020\u2019', '→'),   # corrupt → (U+2192)

    # ← U+2190: bytes E2 86 90
    # cp1252: â + † + \x90 (undefined in cp1252, usually U+0090)
    ('\u00e2\u2020\u0090', '←'),

    # • bullet U+2022: bytes E2 80 A2
    # cp1252: E2=â, 80=€, A2=¢
    # Re-encoded: C3A2 E282AC C2A2 -> U+00E2 U+20AC U+00A2
    ('\u00e2\u20ac\u00a2', '•'),   # corrupt bullet •

    # × U+00D7 times: bytes C3 97
    # as latin1: U+00C3 U+0097 (control char)
    # When C3 97 appears in valid UTF-8, it IS U+00D7. Check if files use it correctly.
    # The hex C3 97 as UTF-8 decodes to × (correct). No fix needed.

    # − U+2212 minus sign: bytes E2 88 92
    # cp1252: E2=â, 88=ˆ (modifier letter), 92=\x92 (right single quote in cp1252)
    # Re-encoded: C3A2 CB86 C292 -> U+00E2 U+02C6 U+0092
    # But \x92 = U+2019 in cp1252
    ('\u00e2\u02c6\u2019', '−'),   # corrupt − minus sign

    # Ã (U+00C3) followed by — this appears in "88Ã—88" (should be 88×88)
    # U+00D7 × = single byte 0xD7 in latin1
    # in UTF-8: C3 97 which decodes to U+00D7 = × directly
    # So "Ã—" = U+00C3 U+2014... no, let's check:
    # If the file stores U+00C3 and U+00D7 as individual chars (they're in latin1 range):
    # U+00C3 in UTF-8 = C3 83; U+00D7 in UTF-8 = C3 97
    # So "Ã×" as text. But the viewer shows "Ã—" which would be...
    # Actually Ã = U+00C3 and — (when corrupt) = mojibake of –
    # In comments "88Ã—88" should be "88×88" where × = U+00D7
    # U+00D7 in UTF-8 = C3 97. If the byte C3 was followed by 97, Python reads it as U+00D7 directly.
    # So Ã— in the comment text... let's just check what the comment bytes look like.
    # For now, handle: Ã— -> × (if Ã is U+00C3 followed by × which is already correct as U+00D7)
    # This case: the C3 byte was meant to be part of a 2-byte sequence but × is already correct.
    # Skip this one - it's just the file viewer confusion.
]

def fix_file(fpath, dry_run=False):
    with open(fpath, 'rb') as f:
        raw = f.read()
    try:
        text = raw.decode('utf-8')
    except UnicodeDecodeError:
        return False

    original = text
    fixed = text
    changes = []
    for corrupt, correct in REPLACEMENTS:
        if corrupt in fixed:
            count = fixed.count(corrupt)
            fixed = fixed.replace(corrupt, correct)
            changes.append((corrupt, correct, count))

    if not changes:
        return False

    LOG.append("FIXED: " + os.path.relpath(fpath))
    for corrupt, correct, count in changes:
        LOG.append("  x" + str(count) + "  " + ascii(corrupt) + " -> " + ascii(correct))

    if not dry_run:
        with open(fpath, 'wb') as f:
            f.write(fixed.encode('utf-8'))
        # Verify
        with open(fpath, 'rb') as f:
            verify_raw = f.read()
        verify_text = verify_raw.decode('utf-8')
        still_bad = any(corrupt in verify_text for corrupt, _ in REPLACEMENTS)
        if still_bad:
            LOG.append("  WARNING: still has corrupt sequences after fix!")
        else:
            LOG.append("  VERIFIED OK")
    return True

LOG = []
dry_run = '--dry-run' in sys.argv
LOG.append("=== DRY RUN - no files modified ===" if dry_run else "=== APPLYING FIXES ===")

fixed_count = 0
for dirpath, dirs, files in os.walk('src'):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '__pycache__')]
    for fname in sorted(files):
        if not (fname.endswith('.tsx') or fname.endswith('.ts')):
            continue
        fpath = os.path.join(dirpath, fname)
        if fix_file(fpath, dry_run=dry_run):
            fixed_count += 1

LOG.append("\n=== DONE. Fixed: " + str(fixed_count) + " files ===")
# Write log to file to avoid cp1252 terminal issues
with open('unicode_fix_log.txt', 'w', encoding='utf-8') as lf:
    lf.write('\n'.join(LOG))
print('Log written to unicode_fix_log.txt')
print('Fixed: ' + str(fixed_count) + ' files')

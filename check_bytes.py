f = open('src/screens/application/CompanionPricingScreen.tsx', 'rb')
data = f.read()
f.close()
lines = data.split(b'\n')
line146 = lines[145]  # 0-indexed

# Find the special char sequence
pos = 0
while pos < len(line146):
    b = line146[pos]
    if b >= 0x80:
        # multi-byte sequence
        seq = line146[pos:pos+4]
        # try to decode
        for length in [4, 3, 2, 1]:
            try:
                ch = seq[:length].decode('utf-8')
                codepoint = ord(ch)
                print("offset " + str(pos) + " bytes=" + seq[:length].hex() + " codepoint=U+" + format(codepoint, '04X') + " char=" + repr(ch))
                pos += length
                break
            except Exception:
                if length == 1:
                    print("offset " + str(pos) + " byte=" + hex(b) + " (invalid)")
                    pos += 1
    else:
        pos += 1

"""Test: minimal slide 1 modification."""
from pptx import Presentation
import sys
sys.stdout.reconfigure(encoding='utf-8')

SRC = r"C:\Users\Poloj\Downloads\Smartindia_Hackathon_132.pptx"
DST = r"C:\Users\Poloj\Downloads\Mandi_Mitra_draft1.pptx"

prs = Presentation(SRC)
print("Loaded.")

# Just print slide 1 to see what we're dealing with
slide1 = prs.slides[0]
for sh in slide1.shapes:
    print(f"  {sh.name} has_tf={sh.has_text_frame}")
    if sh.has_text_frame:
        print(f"    text: {sh.text_frame.text[:80]!r}")

print("Saving...")
prs.save(DST)
print("Saved.")

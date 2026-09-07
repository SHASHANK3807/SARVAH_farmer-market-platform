"""Build draft1: modify in-place, preserve paragraph structure exactly."""
from pptx import Presentation
import sys
sys.stdout.reconfigure(encoding='utf-8')

SRC = r"C:\Users\Poloj\Downloads\Smartindia_Hackathon_132.pptx"
DST = r"C:\Users\Poloj\Downloads\Mandi_Mitra_draft1.pptx"

prs = Presentation(SRC)


def set_para_text(paragraph, new_text):
    """Replace paragraph text, keep formatting of first run.

    If paragraph has no runs, add one. Otherwise, set first run's text and
    remove subsequent runs.
    """
    runs = list(paragraph.runs)
    if not runs:
        run = paragraph.add_run()
        run.text = new_text
        return
    runs[0].text = new_text
    for r in runs[1:]:
        r._r.getparent().remove(r._r)


def replace_shape_paragraphs(shape, lines):
    """Replace each paragraph of a shape's text frame with the given lines.

    Requires len(lines) == len(shape.text_frame.paragraphs).
    If we have more lines, we don't add new paragraphs (we'll truncate).
    If we have fewer, we clear the extras.
    """
    paras = shape.text_frame.paragraphs
    for i, p in enumerate(paras):
        if i < len(lines):
            set_para_text(p, lines[i])
        else:
            set_para_text(p, "")


# ====== SLIDE 1: Title Page ======
slide1 = prs.slides[0]
for sh in slide1.shapes:
    if sh.name == "Rectangle" and sh.has_text_frame:
        if "Problem Statement ID" in sh.text_frame.text:
            # 8 paragraphs: p0 empty, p1-p7 have content
            new_lines = [
                "",  # keep p0 empty
                "Idea Title -",
                "Mandi Mitra: Smart Price Discovery for Maharashtra Farmers",
                "Theme -",
                "Agriculture, FoodTech & Rural Development",
                "PS Category - Software",
                "Team ID -",
                "Team Name (Registered on portal) - [Team Name TBD]",
            ]
            replace_shape_paragraphs(sh, new_lines)
            print("Slide 1: OK")

# Update team-name ovals across all slides
for s_idx, slide in enumerate(prs.slides, 1):
    for sh in slide.shapes:
        if sh.name == "Oval" and sh.has_text_frame:
            for p in sh.text_frame.paragraphs:
                if p.runs:
                    p.runs[0].text = "Vishnu Vardhan"
                    for r in p.runs[1:]:
                        r._r.getparent().remove(r._r)
    print(f"  Slide {s_idx} oval updated")

# ====== SLIDE 2: Idea Title ======
slide2 = prs.slides[1]
for sh in slide2.shapes:
    if sh.name == "Rectangle" and sh.has_text_frame:
        if "Shows current market prices" in sh.text_frame.text:
            new_lines = [
                "Aggregates real mandi prices across nearby markets and digital buyers in one screen.",
                "Shows 30-day price trends with a clear sell-now or wait recommendation per crop.",
                "Connects farmers and FPOs directly with verified buyers, cutting out the middleman.",
                "Generates transparent, timestamped transaction records for every deal.",
            ]
            replace_shape_paragraphs(sh, new_lines)
            print("Slide 2: OK")

# ====== SLIDE 3: Technical Approach ======
slide3 = prs.slides[2]
for sh in slide3.shapes:
    if sh.name == "Rectangle" and sh.has_text_frame:
        txt = sh.text_frame.text
        if "Farmer" in txt and "Flask" in txt:
            new_lines = [
                "Farmer / FPO",
                "   \u2193",
                "Next.js Web App (Marathi + English)",
                "   \u2193",
                "REST API Routes (Next.js)",
                "   \u2193",
                "+------------------------+-----------------------+",
                "| Mandi Prices           | Buyer Demand          |",
                "+------------------------+-----------------------+",
                "   \u2193",
                "Sale-Window Recommendation Engine",
                "   \u2193",
                "Better Selling Decision (Sell Now / Wait N Days)",
                "   \u2193",
                "Direct Lot + Offer Flow with Verified Buyers",
            ]
            replace_shape_paragraphs(sh, new_lines)
            print("Slide 3: OK")

# ====== SLIDE 4: Feasibility and Viability ======
slide4 = prs.slides[3]
for sh in slide4.shapes:
    if sh.name == "Rectangle" and sh.has_text_frame:
        if "Technical Feasibility" in sh.text_frame.text:
            new_lines = [
                "Technical Feasibility: Built with Next.js, TypeScript, Tailwind, shadcn/ui, and Recharts - all open-source and well-documented.",
                "Economic Feasibility: JSON-file storage, free-tier hosting, and Agmarknet's public data keep operating costs near zero.",
                "Reduces information asymmetry by surfacing real prices and demand signals farmers currently lack.",
                "Helps farmers compare markets, time their sale, and pick the highest-paying verified buyer.",
            ]
            replace_shape_paragraphs(sh, new_lines)
            print("Slide 4: OK")

# ====== SLIDE 5: Impact and Benefits ======
slide5 = prs.slides[4]
for sh in slide5.shapes:
    if sh.name == "Text box" and sh.has_text_frame:
        if "Higher earning potential" in sh.text_frame.text:
            new_lines = [
                "Higher earning potential through data-driven sell-now vs wait decisions.",
                "Time saved by checking all nearby mandi prices on one screen instead of traveling.",
                "Marathi-first web interface designed for low-literacy, low-bandwidth rural users.",
                "Stronger buyer competition via visible demand posts, raising the prices farmers are offered.",
                "Scalable across more crops, mandis, and districts without re-engineering the core.",
            ]
            replace_shape_paragraphs(sh, new_lines)
            print("Slide 5: OK")

# ====== SLIDE 6: Research and References ======
slide6 = prs.slides[5]
for sh in slide6.shapes:
    if sh.name == "Rectangle" and sh.has_text_frame:
        if "inspired by e-NAM" in sh.text_frame.text:
            new_para = (
                " Mandi Mitra builds on the foundations of e-NAM and AGMARKNET, which proved that "
                "transparent digital price information strengthens farmer outcomes. World Bank and FAO "
                "research on agricultural market information systems shows that real-time price discovery "
                "and direct buyer linkage reduce post-harvest losses and improve farmer realisation. "
                "We extend this with a sale-window recommendation engine and a verified-buyer matching "
                "flow, scoped for Maharashtra's smallholder farmers and FPOs (PS 26132)."
            )
            replace_shape_paragraphs(sh, [new_para])
            print("Slide 6: OK")

print("\nSaving...")
prs.save(DST)
print(f"Saved: {DST}")

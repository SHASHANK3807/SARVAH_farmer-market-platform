"""
Update the Sarvah PPT body content (slides 2-6 only).
Preserves slide 1, layouts, positions, and slide count.
"""

import sys
import io
import copy
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pptx import Presentation
from pptx.util import Pt, Emu
from pptx.dml.color import RGBColor

PPTX_PATH = r"C:\Users\Poloj\Downloads\sarvaha.pptx"
OUTPUT_PATH = r"C:\Users\Poloj\Downloads\sarvaha_new.pptx"  # write to new file first

prs = Presentation(PPTX_PATH)

# ============================================================================
# Helpers
# ============================================================================

def replace_shape_text(shape, new_paragraphs):
    """
    Replace all text in a shape's text frame with new paragraphs.
    Preserves the formatting of the first run in each paragraph where possible.
    new_paragraphs: list of strings or list of (text, bold) tuples
    """
    tf = shape.text_frame
    # Save the first run's formatting
    first_run = None
    for para in tf.paragraphs:
        for run in para.runs:
            if run.text.strip():
                first_run = run
                break
        if first_run:
            break

    # Clear all existing paragraphs (except first)
    for para in list(tf.paragraphs)[1:]:
        p = para._p
        p.getparent().remove(p)

    # Get the first paragraph
    first_para = tf.paragraphs[0]
    # Clear all runs in first paragraph
    for run in list(first_para.runs):
        run.text = ""

    # Now populate with new content
    for idx, content in enumerate(new_paragraphs):
        if isinstance(content, tuple):
            text, is_bold = content
        else:
            text, is_bold = content, False

        if idx == 0:
            para = first_para
        else:
            para = tf.add_paragraph()

        run = para.add_run()
        run.text = text
        if first_run is not None:
            # Copy font properties from first_run
            if first_run.font.name:
                run.font.name = first_run.font.name
            if first_run.font.size:
                run.font.size = first_run.font.size
            if first_run.font.bold is not None:
                run.font.bold = is_bold or first_run.font.bold
            if first_run.font.italic is not None:
                run.font.italic = first_run.font.italic
            try:
                if first_run.font.color and first_run.font.color.rgb:
                    run.font.color.rgb = first_run.font.color.rgb
            except (AttributeError, TypeError):
                pass

# ============================================================================
# SLIDE 2 — "IDEA TITLE" (current: SARVAHA Connect)
# ============================================================================
slide2 = prs.slides[1]
# Shape 6 is the big rectangle with all the body text
for shape in slide2.shapes:
    if shape.has_text_frame:
        text = shape.text_frame.text
        if "SARVAHA" in text and "Connect" in text:
            # This is the body content rectangle
            replace_shape_text(shape, [
                "IDEA/SOLUTION: Sarvah — Decision-Support + Lightweight Marketplace for Maharashtra Smallholders",
                "A Marathi-first web app that tells farmers WHEN to sell and TO WHOM, with mandi prices, 30-day trends, and a SELL/WAIT recommendation engine.",
                "Aggregates 5 mandi prices (Latur, Pune, Nashik, Solapur, Nagpur) for 3 crops (soybean, onion, tur) into one comparison view.",
                "Connects farmers to verified buyers via a two-sided flow: farmers post lots, buyers make offers, deals are recorded.",
                "Complements eNAM by filling gaps it doesn't address for individual smallholders: decision support, individual-buyer access, and Marathi-first UX.",
            ])
            break

# ============================================================================
# SLIDE 3 — "TECHNICAL APPROACH" (current: HTML/CSS/PHP/MySQL)
# ============================================================================
slide3 = prs.slides[2]
for shape in slide3.shapes:
    if shape.has_text_frame:
        text = shape.text_frame.text
        if "Frontend" in text and "Backend" in text:
            # This is the body content TextBox
            replace_shape_text(shape, [
                "Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui",
                "Charts: Recharts (30-day price trend visualization)",
                "i18n: next-intl (English + Marathi, Marathi-first toggle)",
                "Backend: Next.js API routes (REST), zod for input validation, nuqs for URL state",
                "Data: JSON files in /data (seed dataset: 60 days × 3 crops × 5 mandis = 900 price points)",
                "Market Data: Agmarknet (real) with seed-data fallback for demo reliability",
                "Decision Engine: Rule-based — percentile (top 20% → SELL), 7-day trend, seasonality adjustment",
                "Buyer Matching: Crop + district + grade matching, with verified-buyer badges (mocked criteria)",
            ])
            break

# ============================================================================
# SLIDE 4 — "FEASIBILITY AND VIABILITY" (current: generic)
# ============================================================================
slide4 = prs.slides[3]
for shape in slide4.shapes:
    if shape.has_text_frame:
        text = shape.text_frame.text
        if "Technical Feasibility" in text and "Data Feasibility" in text:
            # This is the body content rectangle
            replace_shape_text(shape, [
                "Technical Feasibility: Built on a standard Next.js stack — 4-day hackathon prototype by 3 developers. Modern, maintainable, and deployable on any Node.js host.",
                "Data Feasibility: Agmarknet provides public mandi prices; seed dataset (900 realistic data points) ensures the demo always works even if the live source is down.",
                "Economic Viability: Open-source stack (Next.js, Recharts, shadcn/ui) keeps infrastructure cost near zero at prototype scale. No paid APIs, no real KYC, no real payments in MVP.",
                "Scalability: JSON storage can be swapped for SQLite/Postgres via Prisma. The 5-mandi Maharashtra prototype can extend to all eNAM-integrated mandis with the same workflow.",
                "Spec Coverage: 18/18 spec items addressed — 8 fully built, 5 mocked/partial, 5 deferred to roadmap (100% acknowledged, ~44% functional).",
                "Localization: Marathi-first design differentiates from English-only prototypes and serves Maharashtra's smallholder base directly.",
            ])
            break

# ============================================================================
# SLIDE 5 — "IMPACT AND BENEFITS" (current: 6 generic points)
# ============================================================================
slide5 = prs.slides[4]
# There are two rectangle shapes here (Shape 2 and Shape 7) plus the main text box (Shape 8)
# The main text content is in Shape 8 (Text box)
for shape in slide5.shapes:
    if shape.has_text_frame:
        text = shape.text_frame.text
        if "Better price discovery" in text and "Expandable" in text:
            replace_shape_text(shape, [
                "Reduced information asymmetry: 5 mandis, 3 buyers, 1 recommendation on a single screen — no more guessing today's fair price.",
                "Better selling decisions: SELL NOW / WAIT 3 DAYS / WAIT 2 WEEKS guidance backed by percentile + 7-day trend + seasonality rules.",
                "Direct farmer-to-buyer flow: Cuts out middlemen. Farmers post lots, buyers make offers, deal closes — visible transaction record.",
                "Verified buyer signal: Trust badges (mocked) help farmers avoid low-trust buyers; FPO buyers stand out for aggregation.",
                "Less post-harvest loss: Sale-window timing advice reduces forced distress sales; basic distance heuristic flags transport risk.",
                "Transparent records: Every accepted offer creates a timestamped transaction — visible to both parties.",
                "Marathi-first access: Marathi toggle on every key screen, not a translation afterthought — for Maharashtra's smallholder majority.",
                "eNAM-complementary: Doesn't replace eNAM; fills the gaps eNAM leaves for individuals (decision support, retail buyers, mobile UX).",
            ])
            break

# ============================================================================
# SLIDE 6 — "RESEARCH AND REFERENCES" (current: eNAM/FAO/World Bank)
# ============================================================================
slide6 = prs.slides[5]
for shape in slide6.shapes:
    if shape.has_text_frame:
        text = shape.text_frame.text
        if "e-NAM" in text and "FAO" in text:
            replace_shape_text(shape, [
                "e-NAM (National Agriculture Market) — enam.gov.in",
                "Government of India's pan-India electronic trading portal. 1,522+ mandis, 13 languages including Marathi. Sarvah complements eNAM by filling gaps it doesn't address for individual smallholders (decision support, direct-to-individual flow, Marathi-first UX).",
                "",
                "Agmarknet (agmarknet.gov.in)",
                "Public mandi price data source. Used by Sarvah for reference prices, with seed-data fallback to ensure demo reliability when the live source is unavailable.",
                "",
                "Problem Statement #26132 — Maharashtra State Innovation Society",
                "\"Strengthening market linkages and price discovery for farmers.\" 18-item specification covering mandi price aggregation, buyer demand, quality requirements, lot creation, digital offers, transport, storage, payment tracking, and dispute resolution.",
                "",
                "Sarvah addresses 18/18 spec items: 8 fully built, 5 mocked/partial, 5 deferred to roadmap. Target: 70% functional, 100% acknowledged.",
            ])
            break

# ============================================================================
# Save
# ============================================================================
prs.save(OUTPUT_PATH)
print(f"PPT updated: {OUTPUT_PATH}")
print(f"Total slides: {len(prs.slides)} (unchanged)")
print()
print("Updated content:")
print("- Slide 1: PRESERVED (title page untouched)")
print("- Slide 2: IDEA TITLE → Sarvah (full description)")
print("- Slide 3: TECHNICAL APPROACH → Next.js stack details")
print("- Slide 4: FEASIBILITY AND VIABILITY → Spec coverage + scalability")
print("- Slide 5: IMPACT AND BENEFITS → 8 outcomes")
print("- Slide 6: RESEARCH AND REFERENCES → eNAM, Agmarknet, PS#26132")

"""
Generate a SHORT, readable PDF comparing eNAM with Sarvah.
Keeps it concise and avoids repetition.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, black, white, grey
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from datetime import datetime

OUTPUT_PATH = r"C:\Users\Poloj\sarvah\chats\eNAM_vs_Sarvah.pdf"

# Colors
PRIMARY = HexColor("#1f4e79")
SECONDARY = HexColor("#2e7d32")
ACCENT = HexColor("#c62828")
LIGHT_BG = HexColor("#f5f5f5")


def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(2 * cm, A4[1] - 1.2 * cm, A4[0] - 2 * cm, A4[1] - 1.2 * cm)
    canvas_obj.setFont("Helvetica-Bold", 9)
    canvas_obj.setFillColor(PRIMARY)
    canvas_obj.drawString(2 * cm, A4[1] - 1.0 * cm, "eNAM vs. Sarvah")
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(grey)
    canvas_obj.drawRightString(A4[0] - 2 * cm, A4[1] - 1.0 * cm,
                               datetime.now().strftime("%B %d, %Y"))
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.line(2 * cm, 1.2 * cm, A4[0] - 2 * cm, 1.2 * cm)
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(grey)
    canvas_obj.drawString(2 * cm, 0.9 * cm, "Sarvah — Hackathon Project")
    canvas_obj.drawRightString(A4[0] - 2 * cm, 0.9 * cm, f"Page {doc.page}")
    canvas_obj.restoreState()


def build_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="DocTitle", parent=styles["Title"],
        fontSize=22, leading=28, textColor=PRIMARY,
        alignment=TA_CENTER, spaceAfter=4, fontName="Helvetica-Bold",
    ))
    styles.add(ParagraphStyle(
        name="DocSub", parent=styles["Normal"],
        fontSize=11, leading=14, textColor=grey,
        alignment=TA_CENTER, spaceAfter=14, fontName="Helvetica-Oblique",
    ))
    styles.add(ParagraphStyle(
        name="H1Style", parent=styles["Heading1"],
        fontSize=15, leading=20, textColor=PRIMARY,
        spaceBefore=12, spaceAfter=6, fontName="Helvetica-Bold",
    ))
    styles.add(ParagraphStyle(
        name="H2Style", parent=styles["Heading2"],
        fontSize=12, leading=15, textColor=SECONDARY,
        spaceBefore=8, spaceAfter=4, fontName="Helvetica-Bold",
    ))
    styles.add(ParagraphStyle(
        name="BodyStyle", parent=styles["BodyText"],
        fontSize=10, leading=13, textColor=black,
        alignment=TA_JUSTIFY, spaceAfter=5, fontName="Helvetica",
    ))
    return styles


def make_simple_table(data, col_widths, header_color=PRIMARY):
    """Build a clean, simple table with Paragraph cells for text wrapping."""
    # Wrap each cell in Paragraph so long text wraps instead of overflowing
    cell_style = ParagraphStyle(
        name="Cell", fontSize=9, leading=11, fontName="Helvetica",
    )
    cell_style_bold = ParagraphStyle(
        name="CellBold", fontSize=9, leading=11, fontName="Helvetica-Bold",
    )
    cell_style_header = ParagraphStyle(
        name="CellHeader", fontSize=10, leading=12, fontName="Helvetica-Bold",
        textColor=white, alignment=TA_CENTER,
    )

    wrapped_data = []
    for r, row in enumerate(data):
        wrapped_row = []
        for c, cell in enumerate(row):
            if r == 0:
                wrapped_row.append(Paragraph(str(cell), cell_style_header))
            elif c == 0:
                wrapped_row.append(Paragraph(str(cell), cell_style_bold))
            else:
                wrapped_row.append(Paragraph(str(cell), cell_style))
        wrapped_data.append(wrapped_row)

    t = Table(wrapped_data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), header_color),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, grey),
        ("BOX", (0, 0), (-1, -1), 1, PRIMARY),
    ]
    # Alternating row colors for body rows only
    for i in range(1, len(wrapped_data)):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), LIGHT_BG))
    t.setStyle(TableStyle(style_cmds))
    return t


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=2.0 * cm, bottomMargin=1.8 * cm,
        title="eNAM vs. Sarvah",
        author="Sarvah Team",
    )

    styles = build_styles()
    story = []

    # ================== TITLE ==================
    story.append(Paragraph("eNAM vs. Sarvah", styles["DocTitle"]))
    story.append(Paragraph(
        "What eNAM is, where it falls short, and what Sarvah is tackling.",
        styles["DocSub"]
    ))

    # ================== 1. WHAT IS eNAM ==================
    story.append(Paragraph("1. What is eNAM?", styles["H1Style"]))
    story.append(Paragraph(
        "<b>eNAM (National Agriculture Market)</b> is a Government of India portal that "
        "connects APMC mandis into a single online trading platform. It is run by SFAC under "
        "the Ministry of Agriculture.",
        styles["BodyStyle"]
    ))
    story.append(Paragraph(
        "<b>Scale:</b> 1,522+ mandis connected across India, 13+ languages (including Marathi), "
        "live auction, online payments, mobile app, and toll-free helpline (1800 270 0224).",
        styles["BodyStyle"]
    ))

    # ================== 2. eNAM FEATURES ==================
    story.append(Paragraph("2. eNAM's Features", styles["H1Style"]))
    story.append(Paragraph(
        "eNAM is feature-rich. Key capabilities visible on enam.gov.in:",
        styles["BodyStyle"]
    ))

    features_data = [
        ["Category", "Features"],
        ["Mandi Network",
         "1,522+ integrated mandis; state-level unified licenses so one trader license works across all mandis in a state."],
        ["Trading",
         "Live trade dashboard, real-time trading data, e-NAM MIS analytics, and historical trade data."],
        ["Pricing",
         "Live price information, Agmarknet integration, eNAM vs Agmarknet price comparison, and ReMS price dissemination."],
        ["Quality",
         "Physical Quality Control (QC) labs at mandis with standardized commodity parameters."],
        ["Logistics",
         "eNAM-Logistics module for transport providers, Kisan Rath for vehicle arrangement, and eNWR (warehouse receipts)."],
        ["Demand/Supply",
         "Advance Supply and Advance Demand modules for pre-positioning produce and demand signals."],
        ["Platform",
         "Mobile app, Platform of Platforms (PoP) for third-party integrations, and dedicated portals for farmers, traders, FPOs, APMCs, and mandi boards."],
        ["Documentation",
         "Operational Guidelines PDF, training calendar, eLearning videos on YouTube, and trader FAQs."],
    ]
    story.append(make_simple_table(features_data, col_widths=[3.2 * cm, 13.8 * cm]))
    story.append(Spacer(1, 0.3 * cm))

    # ================== 3. eNAM FLAWS ==================
    story.append(Paragraph("3. eNAM's Flaws (for smallholder farmers)", styles["H1Style"]))
    story.append(Paragraph(
        "eNAM is built for traders, APMCs, and large FPOs. For the individual smallholder, "
        "it has clear gaps:",
        styles["BodyStyle"]
    ))

    flaws_data = [
        ["Flaw", "Why it matters for smallholders"],
        ["APMC bureaucracy",
         "Requires mandi registration, unified licenses, and mandi-board integration. Slow onboarding; remote farmers get left out."],
        ["Complex UI",
         "Government-style navigation, heavy PDFs, multiple logins. A farmer with a basic phone will struggle."],
        ["No decision-support",
         "Shows price data but does not say SELL NOW or WAIT. Farmers still interpret data themselves."],
        ["No individual buyers",
         "Built for bulk traders, not retail or individual buyers. No way to sell 1-10 tons to one person."],
        ["Mandi-level QC only",
         "Quality is tested at the mandi, not on each lot. Remote buyers cannot see lot-level grade before purchase."],
        ["No trust layer for individuals",
         "Trust comes from the APMC system. For direct farmer-to-individual deals, there is no verified-buyer signal."],
        ["No localized trend",
         "Aggregate national/state data, not a personal 30-day chart for your crop in your district."],
        ["Mandi-dependent",
         "Only works inside the mandi system. Farmers outside mandi network cannot use it."],
        ["Translation, not Marathi-first",
         "Marathi is one of 13 languages, but the design is not Marathi-native."],
    ]
    story.append(make_simple_table(flaws_data, col_widths=[4.5 * cm, 12.5 * cm]))
    story.append(Spacer(1, 0.3 * cm))

    # ================== 4. WHAT SARVAH TACKLES ==================
    story.append(PageBreak())
    story.append(Paragraph("4. What Sarvah Tackles", styles["H1Style"]))
    story.append(Paragraph(
        "<b>Sarvah</b> is a 4-day hackathon prototype for Maharashtra's smallholders. "
        "It does not replace eNAM; it fills the gaps eNAM leaves open for individual farmers.",
        styles["BodyStyle"]
    ))

    tackles_data = [
        ["eNAM Gap", "Sarvah's Tackle"],
        ["No decision-support",
         "SELL/WAIT recommendation engine (percentile + 7-day trend + seasonality) with reasoning chips."],
        ["Complex UI",
         "Clean mobile-first Next.js UI. Pre-baked demo URLs (?crop=soybean&district=latur) for instant judge view."],
        ["No individual buyers",
         "Two-sided flow: farmer posts lot → any individual or trader buyer makes an offer → farmer accepts."],
        ["Mandi-level QC only",
         "Per-lot A/B/C grade + quality notes on every lot detail page. (Self-declared, mocked, acknowledged.)"],
        ["No trust layer for individuals",
         "Verified buyer badge component (mocked criteria, visible badge)."],
        ["No localized trend",
         "30-day Recharts trend chart, multi-mandi overlay, for farmer's specific crop + district."],
        ["Mandi-dependent",
         "Works for direct farmer-to-buyer flow outside mandis. Farmer can also still sell at mandis."],
        ["Translation, not Marathi-first",
         "Marathi-first toggle on every key screen, not a translated afterthought."],
        ["No transport awareness",
         "Basic distance heuristic: farmer's district → buyer sees ~km estimate with warning if > 50 km."],
    ]
    story.append(make_simple_table(tackles_data, col_widths=[4.5 * cm, 12.5 * cm]))
    story.append(Spacer(1, 0.3 * cm))

    # ================== WHAT REMAINS TO TACKLE ==================
    story.append(Paragraph("5. What Sarvah Still Has to Tackle", styles["H1Style"]))
    story.append(Paragraph(
        "Honest status of the 18 spec items in the problem statement:",
        styles["BodyStyle"]
    ))

    status_data = [
        ["Status", "Items"],
        ["Built (8)",
         "Mandi price aggregation, buyer demand, quality requirements, localized trends, sale-window recommendation, match farmers/buyers, lot creation, digital offers, transaction records."],
        ["Mocked / Partial (5)",
         "Arrival volumes (one stat widget), verified buyer credentials (badge), quality grading (A/B/C self-declare), distance consideration (heuristic), payment tracking (transaction record only, no escrow)."],
        ["Deferred to roadmap (5)",
         "Logistics coordination, storage options, transport options, dispute resolution, real KYC."],
    ]
    story.append(make_simple_table(status_data, col_widths=[3.5 * cm, 13.5 * cm]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(
        "<b>Tally:</b> 8/18 functional (~44%), 18/18 acknowledged (100%). "
        "Target: 70% functional, 100% acknowledged.",
        styles["BodyStyle"]
    ))

    # ================== ONE-LINE SUMMARY ==================
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("One-line summary", styles["H2Style"]))
    story.append(Paragraph(
        "<b>eNAM</b> is the national mandi-trading infrastructure. "
        "<b>Sarvah</b> is the lightweight, Marathi-first, decision-support layer for the "
        "smallholder farmers eNAM under-serves.",
        styles["BodyStyle"]
    ))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"PDF created: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()

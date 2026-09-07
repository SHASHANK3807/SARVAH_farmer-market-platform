"""Generate an appealing PDF version of the team brief."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUTPUT = r"C:\Users\Poloj\mandi-mitra\TEAM_BRIEF.pdf"

# Colors
PRIMARY = colors.HexColor("#1f6b3a")
ACCENT = colors.HexColor("#d97706")
INK = colors.HexColor("#1a1a1a")
MUTED = colors.HexColor("#5a5a5a")
LIGHT_BG = colors.HexColor("#f4f7f2")
BORDER = colors.HexColor("#cfd8c8")

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleX", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=28, leading=34,
    textColor=PRIMARY, spaceAfter=4, alignment=TA_LEFT,
)
subtitle_style = ParagraphStyle(
    "Sub", parent=styles["Normal"],
    fontName="Helvetica", fontSize=12, leading=16,
    textColor=MUTED, spaceAfter=14,
)
h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=16, leading=20,
    textColor=PRIMARY, spaceBefore=14, spaceAfter=6,
)
h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=12, leading=15,
    textColor=ACCENT, spaceBefore=10, spaceAfter=4,
)
body = ParagraphStyle(
    "Body", parent=styles["BodyText"],
    fontName="Helvetica", fontSize=10.5, leading=15,
    textColor=INK, spaceAfter=4, alignment=TA_LEFT,
)
bullet = ParagraphStyle(
    "Bullet", parent=body, leftIndent=14, bulletIndent=4,
    spaceAfter=2,
)
small = ParagraphStyle(
    "Small", parent=body, fontSize=9, textColor=MUTED,
    spaceAfter=2,
)
quote_style = ParagraphStyle(
    "Quote", parent=body,
    fontName="Helvetica-Oblique", fontSize=11, leading=15,
    textColor=PRIMARY, leftIndent=12, spaceBefore=4, spaceAfter=4,
)


def divider():
    return HRFlowable(width="100%", thickness=0.6, color=BORDER, spaceBefore=8, spaceAfter=8)


def b(text):
    return Paragraph(f"&bull;&nbsp; {text}", bullet)


def two_col_table(rows, col_widths=None):
    if col_widths is None:
        col_widths = [5.2 * cm, 12 * cm]
    t = Table(rows, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -1), PRIMARY),
        ("TEXTCOLOR", (1, 0), (1, -1), INK),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
    ]))
    return t


def status_legend():
    rows = [
        [Paragraph("<b>BUILT</b>", body),
         Paragraph("Fully functional feature, end-to-end working", body)],
        [Paragraph("<b>MOCKED</b>", body),
         Paragraph("Visible in UI, data is seeded (looks real)", body)],
        [Paragraph("<b>DEFERRED</b>", body),
         Paragraph("Acknowledged on a 'Roadmap' page, not built", body)],
    ]
    t = Table(rows, colWidths=[3 * cm, 14.2 * cm], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


# Build document
doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=1.8 * cm, rightMargin=1.8 * cm,
    topMargin=1.6 * cm, bottomMargin=1.6 * cm,
    title="Mandi Mitra - Team Brief",
    author="Team Mandi Mitra",
)

story = []

# Title block
story.append(Paragraph("Mandi Mitra", title_style))
story.append(Paragraph("Team Brief &mdash; Maharashtra Farm-Gate Price Discovery", subtitle_style))
story.append(divider())

# Meta info
meta_rows = [
    ["Hackathon", "Maharashtra State Innovation Society"],
    ["Problem ID", "26132 &mdash; Strengthening market linkages and price discovery for farmers"],
    ["Department", "Maharashtra State Innovation Society, Dept. of Skills, Employment, Entrepreneurship and Innovation"],
    ["Theme", "Agriculture, FoodTech &amp; Rural Development"],
    ["Category", "Software"],
    ["Deadline", "Internal hackathon in 4 days"],
    ["Goal", "70% functional prototype, 100% spec acknowledged"],
]
story.append(two_col_table(meta_rows))
story.append(Spacer(1, 0.4 * cm))

# Team Situation
story.append(Paragraph("Our Team Situation", h1))
story.append(Paragraph(
    "We're vibe-coding this in 4 days for the internal hackathon. "
    "We picked problem statement 26132 (Maharashtra farm-gate price discovery) "
    "and scoped it down hard. The full PS asks for 16 features covering market "
    "intelligence, logistics, storage, payments, and dispute resolution. We're "
    "not naive about that &mdash; we've explicitly triaged what we build vs. "
    "what we acknowledge on a Roadmap page.",
    body,
))
story.append(Paragraph(
    "Our constraint: a 70% functional prototype, not a full product. That means "
    "the farmer-side decision-support flow (prices + chart + sell/wait rec) and "
    "the buyer-side lot + offer flow work end-to-end. Logistics, escrow, KYC, "
    "and dispute processes show up as 'Coming Soon' on a dedicated page &mdash; "
    "which signals to judges that we read the full spec, even where we deferred.",
    body,
))
story.append(Paragraph(
    "Stack is plain Next.js + shadcn + Recharts with JSON-file storage. No "
    "database, no auth, no payment gateway. Marathi + English toggle is included "
    "because Maharashtra's farmers are the actual user, and a Marathi UI is a "
    "sharp differentiator at the internal review.",
    body,
))
story.append(Paragraph(
    "If anything below is unclear or you disagree with the scope, raise it "
    "before Day 1 setup &mdash; easier to redirect now than mid-build.",
    body,
))

# What we're building
story.append(Paragraph("What We're Building", h1))
story.append(Paragraph(
    "A web app called <b>Mandi Mitra</b> (Friend of the Market) that helps "
    "small farmers in Maharashtra make better selling decisions. Right now, "
    "a farmer has 3 buyers in front of him and <b>zero</b> way to know which "
    "is offering a fair price. He just picks the easiest option and loses money. "
    "We fix that.",
    body,
))

# The Big Idea
story.append(Paragraph("The Big Idea", h1))
story.append(Paragraph(
    "Don't build a full marketplace. Build a decision-support tool.",
    quote_style,
))
story.append(Paragraph(
    "The one question a farmer needs answered: <i>Should I sell today or wait?</i>",
    body,
))
story.append(Spacer(1, 0.2 * cm))
story.append(Paragraph("Our app shows him:", body))
for item in [
    "Today's price at 3 nearby mandis (side by side)",
    "30-day price trend chart",
    "A clear recommendation: <b>SELL NOW</b> / <b>WAIT 3 DAYS</b> / <b>WAIT 2 WEEKS</b>",
    "2&ndash;3 verified buyers who want his crop right now",
]:
    story.append(b(item))
story.append(Spacer(1, 0.1 * cm))
story.append(Paragraph(
    "Plus a basic two-sided flow: farmer posts a lot, buyer makes an offer, deal is recorded.",
    body,
))

# Personas
story.append(Paragraph("Who Uses It", h1))

priya_rows = [
    [Paragraph("<b>PRIYA</b> &mdash; Farmer", body),
     Paragraph("Opens app on phone<br/>"
               "Selects: Soybean, Latur district<br/>"
               "Sees: prices, chart, recommendation, buyers<br/>"
               "Creates a lot: 10 tons, Grade A, asking &nbsp;4,400/quintal", body)],
    [Paragraph("<b>RAJAN</b> &mdash; Buyer", body),
     Paragraph("Opens app on desktop<br/>"
               "Browses lots, sees Priya's soybean lot<br/>"
               "Makes offer: &nbsp;4,350/quintal for 10 tons<br/>"
               "Priya accepts &mdash; transaction shows up in history", body)],
]
priya_table = Table(priya_rows, colWidths=[4.5 * cm, 12.7 * cm], hAlign="LEFT")
priya_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (0, -1), LIGHT_BG),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.append(priya_table)

# Features We Deliver
story.append(Paragraph("Features We're Delivering", h1))
story.append(Paragraph(
    "The problem statement asks for 16 specific features. Here's our plan for each:",
    body,
))
story.append(Spacer(1, 0.2 * cm))
story.append(status_legend())
story.append(Spacer(1, 0.3 * cm))

feature_rows = [
    [Paragraph("<b>#</b>", body),
     Paragraph("<b>Feature</b>", body),
     Paragraph("<b>Status</b>", body)],
    ["A", "Mandi price aggregation", "BUILT"],
    ["B", "Buyer demand aggregation", "BUILT"],
    ["C", "Quality requirements per lot/buyer", "BUILT"],
    ["D", "Arrival volumes at mandi", "MOCKED"],
    ["E", "Transport options", "DEFERRED"],
    ["F", "Storage options", "DEFERRED"],
    ["G", "Localised price trends", "BUILT"],
    ["H", "Sale-window recommendations", "BUILT"],
    ["I", "Match farmers/FPOs with buyers", "BUILT"],
    ["J", "Verified buyer credentials", "MOCKED"],
    ["K", "Lot creation", "BUILT"],
    ["L", "Quality grading (A/B/C)", "MOCKED"],
    ["M", "Digital offers", "BUILT"],
    ["N", "Logistics coordination", "DEFERRED"],
    ["O", "Payment tracking (escrow)", "DEFERRED"],
    ["P", "Dispute / grievance process", "DEFERRED"],
]

# Wrap text in feature rows
wrapped_rows = [feature_rows[0]]
for code, feat, status in feature_rows[1:]:
    color = PRIMARY if status == "BUILT" else (ACCENT if status == "MOCKED" else MUTED)
    wrapped_rows.append([
        Paragraph(f"<b>{code}</b>", body),
        Paragraph(feat, body),
        Paragraph(f"<font color='{color.hexval()}'><b>{status}</b></font>", body),
    ])

feature_table = Table(wrapped_rows, colWidths=[1.2 * cm, 11 * cm, 5 * cm], hAlign="LEFT")
feature_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 9.5),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
]))
story.append(feature_table)
story.append(Spacer(1, 0.2 * cm))
story.append(Paragraph(
    "<b>Tally:</b> 8 BUILT &middot; 3 MOCKED &middot; 5 DEFERRED &nbsp;|&nbsp; "
    "Functional: 8/16 (50%) &nbsp;|&nbsp; Acknowledged: 16/16 (100%)",
    small,
))

# Tech Stack
story.append(Paragraph("Tech Stack", h1))
stack_rows = [
    ["Framework", "Next.js (App Router) + TypeScript"],
    ["Styling", "Tailwind CSS + shadcn/ui components"],
    ["Charts", "Recharts"],
    ["Languages", "next-intl (English + Marathi toggle)"],
    ["Storage", "JSON files in /data (simple, fast, no DB setup)"],
    ["Approach", "Vibe-coding &mdash; pick tools we're comfortable with"],
]
story.append(two_col_table(stack_rows))

# Data Plan
story.append(Paragraph("Data Plan", h1))
data_rows = [
    ["Crops", "Soybean, Onion, Tur"],
    ["Mandis", "Latur, Pune, Nashik, Solapur, Nagpur"],
    ["Day 1 priority",
     "Create a realistic seed dataset (60 days of prices). Even if we successfully scrape Agmarknet later, the seed data is our demo safety net. If scraping breaks during the demo, we fall back to seed data and the demo still works."],
]
story.append(two_col_table(data_rows, col_widths=[3.5 * cm, 13.7 * cm]))

# 4-Day Plan
story.append(Paragraph("4-Day Plan", h1))
plan_rows = [
    [Paragraph("<b>Day 1</b>", body),
     Paragraph("Setup, data, basic structure, seed dataset", body)],
    [Paragraph("<b>Day 2</b>", body),
     Paragraph("Farmer dashboard &mdash; <b>HERO feature</b>: price + chart + recommendation", body)],
    [Paragraph("<b>Day 3</b>", body),
     Paragraph("Buyer dashboard + lot + offer flow + transactions", body)],
    [Paragraph("<b>Day 4</b>", body),
     Paragraph("Polish + demo prep + rehearsal + Loom backup", body)],
]
plan_table = Table(plan_rows, colWidths=[2.5 * cm, 14.7 * cm], hAlign="LEFT")
plan_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (0, -1), LIGHT_BG),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story.append(plan_table)
story.append(Spacer(1, 0.2 * cm))
story.append(Paragraph(
    "See <b>CHECKLIST.md</b> for the full task list.",
    small,
))

# Roles
story.append(Paragraph("Roles (suggested)", h1))
role_rows = [
    [Paragraph("<b>Person 1</b><br/>Architecture", body),
     Paragraph("Data layer, Agmarknet scraper, recommendation engine, API routes", body)],
    [Paragraph("<b>Person 2</b><br/>Farmer UI", body),
     Paragraph("Farmer dashboard, charts, Marathi translations, mobile responsive", body)],
    [Paragraph("<b>Person 3</b><br/>Buyer UI", body),
     Paragraph("Buyer dashboard, lot + offer flow, transactions page, polish", body)],
]
role_table = Table(role_rows, colWidths=[4.5 * cm, 12.7 * cm], hAlign="LEFT")
role_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (0, -1), LIGHT_BG),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story.append(role_table)
story.append(Spacer(1, 0.2 * cm))
story.append(Paragraph(
    "<b>Day 1:</b> all three sit together and align on the setup. After that, "
    "work in parallel and review each other's code.",
    body,
))

# Demo Script
story.append(Paragraph("Demo Script (3 minutes)", h1))
demo_rows = [
    ["0:00 &ndash; 0:30", "Problem: farmer has no price info, loses 15%"],
    ["0:30 &ndash; 1:30", "Farmer flow: open app, see prices + chart + recommendation"],
    ["1:30 &ndash; 2:30", "Marketplace: create lot, buyer makes offer, accept"],
    ["2:30 &ndash; 3:00", "What's next: roadmap, Marathi support, outcomes"],
]
demo_table = Table(demo_rows, colWidths=[3.5 * cm, 13.7 * cm], hAlign="LEFT")
demo_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
    ("TEXTCOLOR", (0, 0), (0, -1), ACCENT),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(demo_table)
story.append(Spacer(1, 0.2 * cm))
story.append(Paragraph(
    "The whole thing ends with a transaction record visible. That's our "
    "<i>proof it works</i> moment.",
    body,
))

# Judge-Facing Outcomes
story.append(Paragraph("Judge-Facing Outcomes", h1))
story.append(Paragraph(
    "The problem statement asks for these outcomes. Here's how we show each one:",
    body,
))
story.append(Spacer(1, 0.1 * cm))
outcomes = [
    ("Improved farmer price realisation", "Sell/wait rec + buyer competition visible"),
    ("Reduced information asymmetry", "One screen: 3 mandis + 3 buyers + recommendation"),
    ("Lower transaction cost", "No-middleman direct farmer-to-buyer lot flow"),
    ("Stronger FPO aggregation", "FPO persona in the data"),
    ("Reduced post-harvest loss", "Sell/wait timing advice reduces distress sales"),
    ("More reliable buyer sourcing", "Verified badge + transaction history"),
    ("Transparent transaction records", "/transactions page"),
]
for outcome, how in outcomes:
    story.append(Paragraph(
        f"&bull;&nbsp; <b>{outcome}</b> &mdash; {how}", bullet,
    ))

# Ground Rules
story.append(Paragraph("Ground Rules", h1))
rules = [
    "Don't add features past Day 3. Polish beats more features.",
    "Don't skip the seed data. Always have a working demo.",
    "Marathi on key screens, not error messages. Don't over-translate.",
    "Mobile-responsive. Judges will check.",
    "Test the demo URL with ?crop=soybean&district=latur pre-loaded.",
    "Have a 3-min Loom backup recorded on Day 4, in case live demo dies.",
]
for r in rules:
    story.append(b(r))

doc.build(story)
print(f"PDF created: {OUTPUT}")

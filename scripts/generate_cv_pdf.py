import os
import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def create_pdf_resume():
    # Setup output path - output to the public folder in Next.js
    pdf_path = r"c:\Users\DEVINE\Downloads\navie-portfolio-revamp\divinethedev\public\Divine_Nnaji_CV.pdf"
    if len(sys.argv) > 2:
        pdf_path = sys.argv[2]
    
    # 0.5 in margins for maximum density and clean layout
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    # Color Palette Definitions
    COLOR_PRIMARY = colors.HexColor('#1A365D')   # Deep Navy
    COLOR_BODY = colors.HexColor('#2D3748')      # Charcoal / Slate
    COLOR_SUB = colors.HexColor('#718096')       # Cool Grey
    COLOR_BORDER = colors.HexColor('#1A365D')    # Navy border

    story = []

    # --- STYLES ---
    style_name = ParagraphStyle(
        'HeaderName',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=COLOR_PRIMARY,
        alignment=TA_CENTER
    )
    
    style_role = ParagraphStyle(
        'HeaderRole',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=COLOR_SUB,
        alignment=TA_CENTER
    )

    style_contact = ParagraphStyle(
        'HeaderContact',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=COLOR_BODY,
        alignment=TA_CENTER
    )

    style_summary = ParagraphStyle(
        'SummaryText',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=COLOR_BODY,
    )

    # --- HELPERS ---
    def add_section_header(title):
        p_style = ParagraphStyle(
            'SectionHeaderTitle',
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=COLOR_PRIMARY,
        )
        p = Paragraph(title.upper(), p_style)
        t = Table([[p]], colWidths=[540])
        t.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('LINEBELOW', (0,0), (-1,-1), 1.2, COLOR_BORDER),
        ]))
        story.append(t)
        story.append(Spacer(1, 6))

    def make_job_header(role, period):
        style_role = ParagraphStyle(
            'JobRole',
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=COLOR_PRIMARY,
        )
        style_period = ParagraphStyle(
            'JobPeriod',
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=COLOR_PRIMARY,
            alignment=TA_RIGHT
        )
        p_role = Paragraph(role, style_role)
        p_period = Paragraph(period, style_period)
        t = Table([[p_role, p_period]], colWidths=[360, 180])
        t.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        return t

    def make_job_subheader(company, location):
        style_comp = ParagraphStyle(
            'JobCompany',
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11,
            textColor=COLOR_SUB,
        )
        style_loc = ParagraphStyle(
            'JobLocation',
            fontName='Helvetica',
            fontSize=9,
            leading=11,
            textColor=COLOR_SUB,
            alignment=TA_RIGHT
        )
        p_comp = Paragraph(company, style_comp)
        p_loc = Paragraph(location, style_loc)
        t = Table([[p_comp, p_loc]], colWidths=[360, 180])
        t.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        return t

    def make_tech_row(techs):
        style_label = ParagraphStyle(
            'TechLabel',
            fontName='Helvetica-BoldOblique',
            fontSize=8.5,
            leading=11,
            textColor=COLOR_PRIMARY,
        )
        style_val = ParagraphStyle(
            'TechValue',
            fontName='Helvetica-Oblique',
            fontSize=8.5,
            leading=11,
            textColor=COLOR_BODY,
        )
        p_label = Paragraph("Technologies Utilized: ", style_label)
        p_val = Paragraph(techs, style_val)
        t = Table([[p_label, p_val]], colWidths=[110, 430])
        t.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('TOPPADDING', (0,0), (-1,-1), 1),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    def make_bullet(text):
        style_bullet = ParagraphStyle(
            'BulletDot',
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=COLOR_PRIMARY,
            alignment=TA_CENTER
        )
        style_text = ParagraphStyle(
            'BulletText',
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=COLOR_BODY,
        )
        p_bullet = Paragraph("&bull;", style_bullet)
        p_text = Paragraph(text, style_text)
        t = Table([[p_bullet, p_text]], colWidths=[12, 528])
        t.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
            ('TOPPADDING', (0,0), (-1,-1), 1.5),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    # --- DEFAULTS ---
    name = "DIVINE CHIBUEZE NNAJI (NAVIE)"
    role_title = "Fullstack Software Engineer & AI Systems Developer"
    contacts_html = (
        'Email: <a href="mailto:dnnaji26@gmail.com" color="#1A365D">dnnaji26@gmail.com</a>  |  '
        'Phone: +234 810 689 0380  |  '
        'GitHub: <a href="https://github.com/D33yan" color="#1A365D">github.com/D33yan</a>  |  '
        'LinkedIn: <a href="https://linkedin.com/in/divine-nnaji-23b771393" color="#1A365D">linkedin.com/in/divine-nnaji-23b771393</a>  |  '
        'Portfolio: <a href="https://divinethe.dev" color="#1A365D">divinethe.dev</a>'
    )
    summary_text = (
        "Dynamic, results-driven Fullstack Software Engineer and AI Builder with 3 years of hands-on experience "
        "delivering high-performance web applications, native mobile experiences, and advanced workflow automation pipelines. "
        "Adept at bridging the gap between complex mathematical systems and sleek, responsive UI/UX designs. "
        "Expertly leverages Next.js, React Native, Supabase, Express.js, n8n, and Python to automate operations, "
        "reduce system latency, and engineer premium consumer products."
    )

    skills = [
        ("Languages", "JavaScript (ES6+), TypeScript, Python, PHP, HTML5, CSS3, SQL"),
        ("Frontend & Mobile", "React Native, Expo, Next.js (App Router), React.js, Tailwind CSS, shadcn/ui, Figma"),
        ("Backend & Database", "Node.js, Express.js, Supabase, PostgreSQL, Laravel, Firebase, Firestore, REST APIs, WebSockets"),
        ("AI, ML & Data Science", "Scikit-learn, NumPy, Matplotlib, Exploratory Data Analysis (EDA), Data Preprocessing & Modeling"),
        ("Automation & CRM", "n8n, Zapier, Make.com, GoHighLevel CRM, Webhook Listeners, Automation Funnels"),
        ("Platforms & DevOps", "Git, GitHub, CI/CD pipelines, WordPress, Wix, Vercel, Brevo, Linux Systems")
    ]

    jobs = [
        {
            "role": "Data Scientist & AI Engineer",
            "company": "NASRDA (National Space Research & Development Agency)",
            "location": "Abuja, Nigeria",
            "period": "April 2026 – Present",
            "tech": "Python, NumPy, Pandas, Matplotlib, Data Science, AI Integration",
            "bullets": [
                "Cleaned and preprocessed datasets using Python, NumPy, and Pandas to ensure data integrity for modelling pipelines.",
                "Conducted exploratory data analysis (EDA) to surface patterns and inform model development decisions.",
                "Built and evaluated machine learning models, contributing to AI integration across internal research workflows.",
                "Worked across data science, embedded systems, and networking domains within a government research environment."
            ]
        },
        {
            "role": "Graphic Designer & Web Developer (Contract/Volunteer)",
            "company": "Ink and Armor",
            "location": "Abuja, Nigeria",
            "period": "2026 – Present",
            "tech": "Figma, Photoshop, Illustrator, WordPress, Web Design, Brand Design",
            "bullets": [
                "Designed brand and marketing materials including logos, flyers, and social media graphics for a creative writing agency.",
                "Currently developing the company website to establish a cohesive online presence for the agency.",
                "Collaborated directly with the founder to translate brand vision into visual and web deliverables.",
                "Handled end-to-end creative production across print and digital formats using Figma, Photoshop, and Illustrator."
            ]
        },
        {
            "role": "Frontend Engineer Intern",
            "company": "Tech Beavers",
            "location": "Abuja, Nigeria",
            "period": "January 2025 – May 2025",
            "tech": "React, Next.js, HTML, CSS, JavaScript, Git, GitHub",
            "bullets": [
                "Built and maintained frontend interfaces using React and Next.js, contributing to live product features across the internship period.",
                "Collaborated with a development team on sprint-based workflows, gaining hands-on experience with real codebase collaboration.",
                "Translated UI/UX designs into responsive, accessible components using HTML, CSS, and JavaScript.",
                "Received mentorship in professional frontend development practices and delivered assigned features within deadlines."
            ]
        },
        {
            "role": "Fullstack Developer & Automation Specialist",
            "company": "Freelance (Fiverr & Direct Clients)",
            "location": "Remote",
            "period": "2023 – Present",
            "tech": "Next.js, React Native, Node.js, WordPress, Wix, GoHighLevel, n8n, Zapier",
            "bullets": [
                "Delivered 15+ client projects across web development, CRM automation, and funnel design over 3 years of independent practice.",
                "Designed and delivered custom websites for clients via Fiverr, covering landing pages, portfolios, and business sites using Next.js, WordPress, and Wix.",
                "Built lead capture and CRM automation pipelines using GoHighLevel, n8n, and Zapier — handling everything from funnel design to email/SMS qualification sequences.",
                "Designed and deployed sales funnels for clients, integrating lead generation flows with CRM tools and automated follow-up systems.",
                "Managed end-to-end client delivery independently — from scoping and design to handoff — across multiple concurrent projects."
            ]
        }
    ]

    projects_data = [
        {
            "title": "Rebid — Mobile Bidding Platform",
            "tech": "React Native, Expo, Supabase (Real-time), Express.js, WebSockets",
            "desc": (
                "Designed and engineered a high-performance native mobile auction application where clients list active "
                "projects and receive competitive bids. Integrated React Native and Expo with a Supabase real-time database "
                "and Express.js WebSocket synchronizations, developing a custom bid-validation algorithm that prevents race conditions. "
                "Built automated anti-bidding-sniping timer extensions and a secure automated winner determination protocol, "
                "delivering a zero-latency, secure bidding ecosystem."
            )
        },
        {
            "title": "TyphoidGuard — Clinical Typhoid Risk Simulator",
            "tech": "Python, TypeScript, TensorFlow, Scikit-learn, Next.js",
            "desc": (
                "Developed a zero-dependency edge-computing clinical triage screening application powered by a custom-trained "
                "3-layer Neural Network (Multi-Layer Perceptron) running entirely client-side. Trained the Sequential classifier "
                "in Python, then built a custom Python exporter to serialize model weights, biases, and StandardScaler coefficients "
                "into a 15 KB JSON configuration. Programmed a pure-math forward-propagation matrix multiplication engine in raw "
                "TypeScript to execute client-side predictions in < 0.1ms locally (100% HIPAA-compliant, in-memory sandboxing)."
            )
        },
        {
            "title": "AcadExpub — Academic Material Distribution Portal",
            "tech": "Next.js, TypeScript, Tailwind CSS, shadcn/ui, Firebase Auth, Firestore & Cloud Storage",
            "desc": (
                "Developed a fullscale web application for secure academic file indexing and literature distribution. "
                "Designed custom Firebase authorization claims to isolate Student and Educator dashboards, built drag-and-drop chunked "
                "file upload systems in Firebase Storage with encrypted access validation, and optimized page query execution speed "
                "reducing operational layout lag by 35%."
            )
        }
    ]

    education = [
        {"title": "B.Sc. Computer Science", "org": "University of Abuja", "period": "2023 – Present"}
    ]

    certs = [
        ("App Development", "July 2023 – September 2023"),
        ("Fullstack Web Development", "October 2022 – February 2023"),
        ("Python Programming", "May 2022 – June 2022")
    ]

    # --- DYNAMIC JSON LOAD ---
    if len(sys.argv) > 1:
        json_path = sys.argv[1]
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Fetch personal info
                if "name" in data and data["name"]: name = data["name"]
                if "role" in data and data["role"]: role_title = data["role"]
                if "contacts" in data and data["contacts"]: contacts_html = data["contacts"]
                if "summary" in data and data["summary"]: summary_text = data["summary"]
                
                # Fetch skills
                if "skills" in data and isinstance(data["skills"], list):
                    skills = [(s["category"], s["items"]) for s in data["skills"]]
                
                # Fetch jobs (Experiences)
                if "jobs" in data and isinstance(data["jobs"], list):
                    jobs = data["jobs"]
                    
                # Fetch projects
                if "projects" in data and isinstance(data["projects"], list):
                    projects_data = data["projects"]
                    
                # Fetch education
                if "education" in data and isinstance(data["education"], list):
                    education = data["education"]

                # Fetch certs
                if "certs" in data and isinstance(data["certs"], list):
                    certs = [(c["title"], c["period"]) for c in data["certs"]]
        except Exception as e:
            print(f"Error parsing dynamic JSON: {e}. Falling back to default data.")

    # --- HEADER ---
    story.append(Paragraph(name.upper(), style_name))
    story.append(Spacer(1, 2))
    story.append(Paragraph(role_title, style_role))
    story.append(Spacer(1, 4))
    story.append(Paragraph(contacts_html, style_contact))
    story.append(Spacer(1, 12))

    # --- PROFESSIONAL SUMMARY ---
    add_section_header("Professional Summary")
    story.append(Paragraph(summary_text, style_summary))
    story.append(Spacer(1, 10))

    # --- TECHNICAL SKILLS ---
    add_section_header("Technical Skills")
    
    style_skill_label = ParagraphStyle(
        'SkillLabel',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11.5,
        textColor=COLOR_PRIMARY
    )
    style_skill_val = ParagraphStyle(
        'SkillVal',
        fontName='Helvetica',
        fontSize=9,
        leading=11.5,
        textColor=COLOR_BODY
    )

    skill_rows = []
    for category, items in skills:
        p_cat = Paragraph(f"{category}:", style_skill_label)
        p_items = Paragraph(items, style_skill_val)
        skill_rows.append([p_cat, p_items])

    skills_table = Table(skill_rows, colWidths=[130, 410])
    skills_table.setStyle(TableStyle([
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 10))

    # --- PROFESSIONAL EXPERIENCE ---
    add_section_header("Professional Experience")

    for job in jobs:
        job_story = []
        job_story.append(make_job_header(job["role"], job["period"]))
        job_story.append(make_job_subheader(job["company"], job["location"]))
        job_story.append(make_tech_row(job["tech"]))
        for bullet in job["bullets"]:
            job_story.append(make_bullet(bullet))
        job_story.append(Spacer(1, 4))
        story.append(KeepTogether(job_story))
    
    story.append(Spacer(1, 6))

    # --- SELECTED PROJECTS ---
    add_section_header("Selected Projects")

    style_proj_title = ParagraphStyle(
        'ProjTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=COLOR_PRIMARY
    )
    style_proj_label = ParagraphStyle(
        'ProjTechLabel',
        fontName='Helvetica-BoldOblique',
        fontSize=8.5,
        leading=11,
        textColor=COLOR_PRIMARY
    )
    style_proj_val = ParagraphStyle(
        'ProjTechVal',
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=COLOR_SUB
    )
    style_proj_desc = ParagraphStyle(
        'ProjDesc',
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=COLOR_BODY
    )

    for proj in projects_data:
        proj_story = []
        proj_story.append(Paragraph(proj["title"], style_proj_title))
        
        p_plabel = Paragraph("Technologies: ", style_proj_label)
        p_pval = Paragraph(proj["tech"], style_proj_val)
        t_tech = Table([[p_plabel, p_pval]], colWidths=[75, 465])
        t_tech.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 1),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        proj_story.append(t_tech)
        
        p_desc = Paragraph(proj["desc"], style_proj_desc)
        t_desc = Table([[p_desc]], colWidths=[540])
        t_desc.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 1),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        proj_story.append(t_desc)
        proj_story.append(Spacer(1, 2))
        story.append(KeepTogether(proj_story))

    story.append(Spacer(1, 6))

    # --- EDUCATION & CERTIFICATIONS ---
    add_section_header("Education & Certifications")

    edu_cert_story = []
    
    # Education list
    style_edu_title = ParagraphStyle(
        'EduTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=COLOR_PRIMARY
    )
    style_edu_period = ParagraphStyle(
        'EduPeriod',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=COLOR_PRIMARY,
        alignment=TA_RIGHT
    )
    style_edu_org = ParagraphStyle(
        'EduOrg',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=11.5,
        textColor=COLOR_SUB
    )
    style_edu_loc = ParagraphStyle(
        'EduLoc',
        fontName='Helvetica',
        fontSize=9.5,
        leading=11.5,
        textColor=COLOR_SUB,
        alignment=TA_RIGHT
    )

    for edu in education:
        p_etitle = Paragraph(edu["title"], style_edu_title)
        p_eperiod = Paragraph(edu["period"], style_edu_period)
        t_edu1 = Table([[p_etitle, p_eperiod]], colWidths=[360, 180])
        t_edu1.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        edu_cert_story.append(t_edu1)

        p_eorg = Paragraph(edu["org"], style_edu_org)
        p_eloc = Paragraph("Abuja, Nigeria" if "Abuja" in edu["org"] else "Remote", style_edu_loc)
        t_edu2 = Table([[p_eorg, p_eloc]], colWidths=[360, 180])
        t_edu2.setStyle(TableStyle([
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        edu_cert_story.append(t_edu2)

    # Certifications Section
    style_cert_header = ParagraphStyle(
        'CertHeader',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=COLOR_PRIMARY
    )
    
    if len(certs) > 0:
        p_cheader = Paragraph("Professional Certifications (EarlyCode Training Institute)", style_cert_header)
        edu_cert_story.append(p_cheader)
        edu_cert_story.append(Spacer(1, 2))

        for cert_title, cert_period in certs:
            style_cbullet = ParagraphStyle(
                'CertBullet',
                fontName='Helvetica',
                fontSize=9.5,
                leading=12,
                textColor=COLOR_PRIMARY,
                alignment=TA_CENTER
            )
            style_ctitle = ParagraphStyle(
                'CertTitle',
                fontName='Helvetica',
                fontSize=9.5,
                leading=12,
                textColor=COLOR_BODY,
            )
            style_cperiod = ParagraphStyle(
                'CertPeriod',
                fontName='Helvetica',
                fontSize=9.5,
                leading=12,
                textColor=COLOR_BODY,
                alignment=TA_RIGHT
            )
            p_cb = Paragraph("&bull;", style_cbullet)
            p_ct = Paragraph(cert_title, style_ctitle)
            p_cp = Paragraph(cert_period, style_cperiod)
            t_c = Table([[p_cb, p_ct, p_cp]], colWidths=[12, 348, 180])
            t_c.setStyle(TableStyle([
                ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
                ('TOPPADDING', (0,0), (-1,-1), 1.5),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ]))
            edu_cert_story.append(t_c)

    story.append(KeepTogether(edu_cert_story))

    # Build the document
    doc.build(story)
    print(f"PDF Resume generated successfully at: {pdf_path}")

if __name__ == "__main__":
    create_pdf_resume()

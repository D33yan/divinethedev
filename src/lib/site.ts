export const siteConfig = {
  name: "Divine Chibueze Nnaji",
  alias: "Navie",
  shortName: "Divine",
  title: "Fullstack Software Engineer",
  location: "Abuja, Nigeria",
  email: "dnnaji26@gmail.com",
  phone: "08106890380",
  github: "https://github.com/D33yan",
  githubHandle: "D33yan",
  linkedin: "https://www.linkedin.com/in/divine-nnaji-23b771393?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  liveSite: "https://made-by-navie.vercel.app",
  resumePath: "/Divine_Nnaji_CV.docx",
  currentRole: "Fullstack Software Engineer & AI Builder",
  typewriterRoles: [
    "Fullstack Engineer",
    "AI Integration Specialist",
    "Automation Builder",
    "UI/UX Enthusiast",
  ],
  sidebarBio:
    "I build web apps, mobile experiences, and AI-powered tools — with a strong eye for design and a love for automation.",
  aboutBio: `I'm a creative, detail-oriented Fullstack Software Engineer with hands-on experience building web and mobile applications, AI-powered tools, and automation workflows. I have a strong eye for UI/UX and a growing specialisation in AI integration and workflow automation.`,
} as const;

export const navSections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export const techPills = [
  "JavaScript",
  "TypeScript",
  "Python",
  "PHP",
  "Next.js",
  "React Native",
  "Node.js",
  "Laravel",
  "Scikit-learn",
  "NumPy",
  "n8n",
  "Zapier",
  "Make.com",
  "Figma",
  "WordPress",
  "Go High Level",
] as const;

export const experiences = [
  {
    id: "nasrda",
    company: "NASRDA",
    role: "Data Scientist & AI Engineer",
    period: "April 12, 2026 – Present",
    location: "Abuja, Nigeria",
    tech: ["Python", "NumPy", "Matplotlib", "Data Science", "Machine Learning", "AI Integration"],
    bullets: [
      "Performing data cleaning and preprocessing to prepare datasets for analysis and modelling",
      "Conducting exploratory data analysis (EDA) using Python, NumPy, and Matplotlib",
      "Supporting the development and evaluation of AI and machine learning models",
      "Gaining applied experience across data science, embedded systems, and networking",
    ],
  },
  {
    id: "freelance",
    company: "Freelance",
    role: "Contract Fullstack Engineer",
    period: "June 2023 – Present",
    location: "Remote",
    tech: ["Next.js", "React Native", "Node.js", "Firebase", "n8n", "GoHighLevel", "Figma"],
    bullets: [
      "Architecting and deploying bespoke web and mobile applications for global clients, utilizing Next.js, React Native, Node.js, and Firebase architectures",
      "Designing and implementing robust AI-powered workflows and multi-branch automation pipelines using n8n, Zapier, and Python scripts, optimizing client operations",
      "Managing full product lifecycles from initial Figma UI/UX design wireframes to production deployment, database structures, and GoHighLevel CRM funnels",
      "Consulting on search engine optimization (SEO), performance metrics, and lead generation campaigns to elevate client site conversions and user engagement",
    ],
  },
  {
    id: "tech-beavers",
    company: "Tech Beavers",
    role: "Frontend Developer Trainee",
    period: "January 2025 – May 12, 2025",
    location: "Lagos, Nigeria",
    tech: ["JavaScript", "HTML5", "CSS3", "React", "CI/CD", "Git", "GitHub"],
    bullets: [
      "Contributed to development and maintenance of the company's main website",
      "Handled CI/CD pipeline tasks and resolved tracked issues via ticketing system",
      "Gained hands-on experience with production-level frontend development workflows",
    ],
  },
  {
    id: "acadexpub-dev",
    company: "AcadExpub",
    role: "Independent Fullstack Developer",
    period: "January 2024 – August 2024",
    location: "Abuja, Nigeria",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Firebase", "Firestore", "Storage"],
    bullets: [
      "Designed, engineered, and deployed AcadExpub in 2024 — a high-performance academic publishing and peer-distribution platform that centralizes course material sharing.",
      "Architected a secure, multi-role authentication flow utilizing Firebase Auth custom claims and Next.js middleware routing guards to enforce absolute isolation between Student and Educator dashboard portals.",
      "Engineered an optimized document upload and distribution pipeline with Firebase Storage and Cloud Firestore, featuring drag-and-drop uploads, chunked transfer validation, and cryptographic tokenized secure access links.",
      "Developed a custom, interactive reference viewer and searchable archives catalog using React, Tailwind CSS, and shadcn/ui components, providing educators with instant course-level material controls.",
      "Fine-tuned Next.js App Router data-fetching methods and client-side state caching, resulting in a 35% reduction in initial page load latency and achieving seamless 60fps responsive UI transitions."
    ],
  },
] as const;

export const projects = [
  {
    id: "rebid",
    title: "Rebid",
    description:
      "A mobile bidding platform where users post projects and receive competitive bids within a set time window, awarding the contract to the highest bidder.",
    tech: ["React Native", "Node.js", "Firebase"],
    tag: "Mobile App",
    featured: true,
    github: "https://github.com/D33yan",
    live: null,
    badge: null,
    caseStudy: {
      problem: "The mobile landscape lacked an accessible, real-time platform designed specifically for fast-paced, competitive bidding on listed items. Users faced delayed updates, lack of security against bid-sniping, and manual intervention in contract awards.",
      approach: "Divine engineered a robust mobile architecture combining React Native with Firebase for instantaneous state synchronization. He designed a custom real-time bidding algorithm that handles quick bid validation, dynamic timer updates, and race-condition prevention during peak activity.",
      built: "A native mobile application featuring fully synchronized WebSocket and Firebase live feeds, automated anti-sniping bid extensions, and a secure user rating and ranking system. The app automates winner determination and instantly compiles bid histories.",
      result: "The system achieved a seamless, low-latency auction environment that successfully automates the contract award process. It eliminates bid manipulation and human error, providing users with a highly reliable mobile bidding experience.",
      images: [
        "/rebid-app-images/pic1.jpeg",
        "/rebid-app-images/pic2.jpeg",
        "/rebid-app-images/3.jpeg",
        "/rebid-app-images/pic4.jpeg",
        "/rebid-app-images/pic5.jpeg",
        "/rebid-app-images/pic6.jpeg"
      ]
    }
  },
  {
    id: "typhoidguard",
    title: "TyphoidGuard",
    description:
      "A web-based health screening tool that predicts typhoid fever likelihood through an interactive symptom survey, powered by an ML classification model trained on Kaggle datasets, achieving 98% accuracy.",
    tech: ["Python", "Scikit-learn", "Next.js"],
    tag: "AI / ML",
    featured: true,
    github: "https://github.com/D33yan/typhoidchecker",
    live: "https://typhoidchecker.vercel.app",
    badge: "98% Accuracy",
    caseStudy: {
      problem: "Individuals in remote or underserved regions frequently lack immediate access to medical testing facilities for early typhoid fever screening. This delay in diagnostics often leads to worsened health outcomes due to unmonitored symptoms.",
      approach: "Sourcing diverse, high-quality symptom datasets from Kaggle, Divine executed meticulous data cleaning and feature engineering. He trained and benchmarked multiple machine learning classification models to select the most performant predictor.",
      built: "An interactive Next.js web application integrated with a high-accuracy Python machine learning backend that predicts classification probabilities. The portal guides users through a structured symptom questionnaire and outputs instant risk assessments.",
      result: "The classifier reached an exceptional 98% accuracy in diagnosing potential infections. This deployment provides a highly accessible, rapid screening tool directly via any standard web browser.",
      images: ["/images/typhoidguard_preview.png"]
    }
  },
  {
    id: "acadexpub",
    title: "AcadExpub",
    description:
      "An academic publishing platform with role-based authentication where educators submit and manage course materials, while students access and reference content through a dedicated portal.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Firebase"],
    tag: "Web App",
    featured: true,
    github: "https://github.com/D33yan",
    live: "https://acadexpub.vercel.app",
    badge: null,
    caseStudy: {
      problem: "Academic institutions lacked a centralized, intuitive portal for lecturers to distribute course material and for students to reference academic literature. This resulted in fragmented communication and lost study materials.",
      approach: "Divine structured a comprehensive, role-based application logic with separate portals for educators and students. He utilized Next.js App Router and Firebase for real-time storage, secure document routing, and instant updates.",
      built: "A modern publishing platform with secure multi-role authentication, structured file submission pipelines, and dynamic reference feeds. The frontend was styled beautifully with Tailwind CSS and premium shadcn/ui components for maximum visual accessibility.",
      result: "The platform delivered a unified and reliable environment where students effortlessly search and retrieve lecture assets. It bridged the administrative gap between faculty and students, optimizing material distribution.",
      images: ["/acadexpub.png", "/acadexpub2.png"]
    }
  },
  {
    id: "customer-onboarding",
    title: "Customer Onboarding Automation",
    description:
      "A lead capture and onboarding automation pipeline for a fitness brand, converting Instagram leads through a GoHighLevel funnel with automated CRM entry and qualification.",
    tech: ["GoHighLevel", "n8n"],
    tag: "Automation",
    featured: true,
    github: "https://github.com/D33yan",
    live: null,
    badge: null,
    caseStudy: {
      problem: "A scaling fitness brand was losing high-intent Instagram leads due to a lack of a structured, immediate follow-up system. Leads remained uncontacted in direct messages, resulting in lost revenue opportunities.",
      approach: "Divine mapped the entire user journey from the initial Instagram message to the final onboarding payment. He developed custom webhook listeners and multi-branch automation paths to segment leads dynamically.",
      built: "Automated client-acquisition pipeline that triggers on direct messages, inputs leads into GoHighLevel's CRM, and qualifies them via conversational flows. It schedules onboarding sessions and triggers personal follow-ups automatically.",
      result: "The automated sequence achieved consistent lead conversion while completely eliminating manual lead follow-up. The business recaptured dormant interest, saving hours of manual administrative labor daily.",
      images: []
    }
  },
  {
    id: "ecommerce-template",
    title: "E-commerce Website Template",
    description:
      "Production-ready e-commerce frontend template showcasing modern UI patterns, responsive design, and clean component architecture.",
    tech: ["Next.js", "TypeScript"],
    tag: "Web · Open Source",
    featured: false,
    github: "https://github.com/D33yan/afabric-ecommercestore",
    live: "https://afabric-ecommercestore.vercel.app/",
    badge: null,
    caseStudy: {
      problem: "Developers frequently lose valuable time rebuilding standard, highly interactive e-commerce visual components from scratch for new projects. There was a clear need for a highly optimized, modern codebase starter template.",
      approach: "He designed a modern component architecture focusing on reusability, performance, and responsive layout patterns. Using TypeScript, he created robust type-safe interfaces for cart management, product sorting, and navigation states.",
      built: "A production-ready Next.js frontend template with modular UI components, fluid animations, and a responsive structure. The template includes cart controls, checkout steps, search filters, and smooth page transitions out of the box.",
      result: "The project delivers an extremely performant and adaptable template that saves developers significant boilerplate time. It is fully ready to be integrated with any headless API or commerce database.",
      images: []
    }
  },
  {
    id: "fitness-tracker",
    title: "Fitness Tracker",
    description:
      "A premium frontend workout tracking dashboard allowing users to set goals, log workouts, and view interactive visual progress indicators seamlessly.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    tag: "Frontend Web App",
    featured: false,
    github: "https://github.com/D33yan/fitness-tracker",
    live: "https://fitness-tracker-one-xi.vercel.app/",
    badge: null,
    caseStudy: {
      problem: "Fitness enthusiasts struggled to find a simple, responsive, and distraction-free workout logging portal that functions perfectly without complex account setups.",
      approach: "Divine crafted an elegant frontend dashboard with client-side state management, local storage synchronization, and lightweight visual metrics.",
      built: "A fully responsive single-page application incorporating calorie goal trackers, weekly checklist routines, and custom SVG category cards.",
      result: "The tracker offers a seamless offline-first experience with near-zero latency, enabling users to log their workouts quickly and monitor progress in real-time.",
      images: ["/images/fitness_tracker_preview.png"]
    }
  }
] as const;

export const skillGroups = [
  {
    title: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "PHP"],
  },
  {
    title: "Frontend",
    skills: ["Next.js", "React Native", "HTML/CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Laravel"],
  },
  {
    title: "AI & ML",
    skills: ["Scikit-learn", "NumPy", "Data Cleaning"],
  },
  {
    title: "Automation",
    skills: ["n8n", "Zapier", "Make.com"],
  },
  {
    title: "Design",
    skills: ["Figma", "Photoshop", "Illustrator", "After Effects"],
  },
  {
    title: "Platforms",
    skills: ["WordPress", "Wix", "Go High Level", "Brevo"],
  },
  {
    title: "Other",
    skills: ["UI/UX Principles", "Funnel Design", "Lead Generation"],
  },
] as const;

export const education = [
  {
    type: "education" as const,
    title: "B.Sc. Computer Science",
    org: "University of Abuja",
    period: "2023 – Present",
  },
] as const;

export const certifications = [
  {
    type: "cert" as const,
    title: "Python Programming",
    org: "EarlyCode",
    period: "May–June 2022",
  },
  {
    type: "cert" as const,
    title: "Fullstack Web Development",
    org: "EarlyCode",
    period: "Oct 2022 – Feb 2023",
  },
  {
    type: "cert" as const,
    title: "App Development",
    org: "EarlyCode",
    period: "July–Sept 2023",
  },
] as const;

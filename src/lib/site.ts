export const siteConfig = {
  name: "Divine Chibueze Nnaji",
  alias: "Navie",
  shortName: "Divine",
  title: "Fullstack Software Engineer & AI Builder",
  email: "dnnaji26@gmail.com",
  phone: "08106890380",
  github: "https://github.com/D33yan",
  githubHandle: "D33yan",
  linkedin: "https://www.linkedin.com/in/divine-nnaji-23b771393?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  liveSite: "https://divinethe.dev",
  resumePath: "/Divine_Nnaji_CV.pdf",
  currentRole: "Fullstack Software Engineer & AI Builder",
  typewriterRoles: [
    "Fullstack Engineer",
    "AI Integration Specialist",
    "Automation Builder",
    "UI/UX Enthusiast",
  ],
  sidebarBio:
    "I build web apps, mobile experiences, and AI-powered tools — with a strong eye for design and a love for automation.",
  aboutBio: `I'm Divine Chibueze Nnaji — a Fullstack Software Engineer and AI Builder based in Abuja, Nigeria, with 3 years of hands-on experience delivering web applications, automation workflows, and AI-powered tools. I started freelancing in 2023, building websites and automation pipelines for clients across Fiverr and direct engagements — handling everything from frontend design to CRM integration and funnel deployment. Since then I've expanded into fullstack development, mobile apps, and AI/ML systems, with a strong eye for UI/UX and a growing specialisation in LLM integration and workflow automation.`,
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
  "Next.js 15",
  "React Native",
  "Node.js",
  "Laravel",
  "TensorFlow",
  "Scikit-learn",
  "NumPy",
  "n8n",
  "HubSpot CRM",
  "Telegram API",
  "Expo",
  "Supabase",
  "Firebase",
  "Tailwind CSS",
  "shadcn/ui",
  "Framer Motion",
  "PWA",
  "Figma",
  "WordPress",
  "Go High Level",
] as const;

export const experiences = [
  {
    id: "nasrda",
    company: "NASRDA",
    role: "Data Scientist & AI Engineer",
    period: "April 2026 – Present",
    location: "Abuja, Nigeria",
    tech: ["Python", "NumPy", "Matplotlib", "Data Science", "Machine Learning", "AI Integration"],
    bullets: [
      "Cleaned and preprocessed datasets using Python, NumPy, and Pandas to ensure data integrity for modelling pipelines",
      "Conducted exploratory data analysis (EDA) to surface patterns and inform model development decisions",
      "Built and evaluated machine learning models, contributing to AI integration across internal research workflows",
      "Worked across data science, embedded systems, and networking domains within a government research environment"
    ],
  },
  {
    id: "ink-and-armor",
    company: "Ink and Armor",
    role: "Graphic Designer & Web Developer",
    period: "2026 – Present",
    location: "Abuja, Nigeria",
    tech: ["Figma", "Photoshop", "Illustrator", "WordPress", "Web Design", "Brand Design"],
    bullets: [
      "Designed brand and marketing materials including logos, flyers, and social media graphics for a creative writing agency",
      "Currently developing the company website to establish a cohesive online presence for the agency",
      "Collaborated directly with the founder to translate brand vision into visual and web deliverables",
      "Handled end-to-end creative production across print and digital formats using Figma, Photoshop, and Illustrator"
    ],
  },
  {
    id: "tech-beavers",
    company: "Tech Beavers",
    role: "Frontend Engineer Intern",
    period: "January 2025 – May 12, 2025",
    location: "Abuja, Nigeria",
    tech: ["React", "Next.js", "HTML", "CSS", "JavaScript"],
    bullets: [
      "Built and maintained frontend interfaces using React and Next.js, contributing to live product features across the internship period",
      "Collaborated with a development team on sprint-based workflows, gaining hands-on experience with real codebase collaboration",
      "Translated UI/UX designs into responsive, accessible components using HTML, CSS, and JavaScript",
      "Received mentorship in professional frontend development practices and delivered assigned features within deadlines"
    ],
  },
  {
    id: "freelance",
    company: "Freelance",
    role: "Fullstack Developer & Automation Specialist",
    period: "2023 – Present",
    location: "Remote",
    tech: ["Next.js", "WordPress", "Wix", "GoHighLevel", "n8n", "Zapier"],
    bullets: [
      "Delivered 15+ client projects across web development, CRM automation, and funnel design over 3 years of independent practice",
      "Designed and delivered custom websites for clients via Fiverr, covering landing pages, portfolios, and business sites using Next.js, WordPress, and Wix",
      "Built lead capture and CRM automation pipelines using GoHighLevel, n8n, and Zapier — handling everything from funnel design to email/SMS qualification sequences",
      "Designed and deployed sales funnels for clients, integrating lead generation flows with CRM tools and automated follow-up systems",
      "Managed end-to-end client delivery independently — from scoping and design to handoff — across multiple concurrent projects"
    ],
  },
] as const;

export const projects = [
  {
    id: "rebid",
    title: "Rebid",
    description:
      "A mobile bidding platform where users post projects and receive competitive bids within a set time window, awarding the contract to the highest bidder.",
    tech: ["React Native", "Expo", "Supabase", "Express.js"],
    tag: "Mobile App",
    featured: true,
    github: "https://github.com/D33yan/rebid-app",
    live: null,
    badge: null,
    caseStudy: {
      problem: "The mobile landscape lacked an accessible, real-time platform designed specifically for fast-paced, competitive bidding on listed items. Users faced delayed updates, lack of security against bid-sniping, and manual intervention in contract awards.",
      approach: "Divine engineered a robust mobile architecture combining React Native/Expo with Supabase and an Express.js backend for instantaneous real-time bidding synchronization. He designed a custom transaction algorithm that handles quick bid validation, dynamic timer updates, and race-condition prevention during peak activity.",
      built: "A native mobile application featuring fully synchronized WebSocket and Supabase real-time databases, automated anti-sniping bid extensions, and a secure user rating and ranking system. The app automates winner determination and instantly compiles bid histories.",
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
      "An advanced clinical triage simulator powered by a custom-trained Neural Network (Multi-Layer Perceptron) running entirely client-side with zero runtime dependencies.",
    tech: ["Next.js", "TypeScript", "Python", "TensorFlow", "Scikit-learn"],
    tag: "AI / ML",
    featured: true,
    github: "https://github.com/D33yan/typhoidchecker",
    live: "https://typhoidguard.vercel.app/",
    badge: "98% Accuracy · Edge ML",
    caseStudy: {
      problem: "Integrating machine learning models into web applications traditionally requires maintaining a bulky, high-latency Python backend (FastAPI/Flask) or downloading heavy runtime frameworks (like @tensorflow/tfjs ~30MB) into the browser. This causes significant performance bottlenecks, expensive hosting fees, cold-start latencies, and serious patient data privacy concerns due to transmitting health data over public networks.",
      approach: "By exploiting the compact structure of a specialized clinical model (a 3-layer dense neural network with 7 clinical inputs), Divine engineered a Zero-Dependency Static Edge Inference architecture. He trained a 3-layer Sequential Neural Network classifier in Python (TensorFlow/Keras) with a StandardScaler. During compilation, a custom Python exporter serialized each dense layer's weight matrices, biases, and scale coefficients into a tight, 15 KB JSON configuration. He then wrote a custom, pure-math feedforward matrix multiplication engine in raw TypeScript to parse this JSON and run predictions locally.",
      built: "An interactive Next.js clinical triage portal styled with a sterile, surgical white design system. The service normalizes user inputs using the scikit-learn standardizer parameters (x - mean) / scale, propagates predictions through dense layers using custom-implemented ReLU and Sigmoid activations in TypeScript, and features an optimized 'Print Triage Report' utility utilizing CSS print-specific media queries for physical hospital handoffs.",
      result: "Validation testing achieved 100% mathematical parity matching the original Keras model exactly (0.0000% difference), with under 0.1ms local inference latency directly in the user's browser. Since patient data never leaves the local browser sandbox, the application provides a 100% HIPAA-compliant, serverless screening tool costing $0/month in hosting.",
      images: [
        "/typhoid syptomchechecker images/typhoidchecker1.png",
        "/typhoid syptomchechecker images/typhoidchecker2.png",
        "/typhoid syptomchechecker images/typhoidchecker3.png",
        "/typhoid syptomchechecker images/typhoidchecker4.png",
        "/typhoid syptomchechecker images/typhoidcheckermobile.png",
        "/typhoid syptomchechecker images/typhoidcheckermobile2.png"
      ]
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
    github: "https://github.com/D33yan/acadexpub",
    live: "https://acadexpub.vercel.app/",
    badge: null,
    caseStudy: {
      problem: "Academic institutions lacked a centralized, intuitive portal for lecturers to distribute course material and for students to reference academic literature. This resulted in fragmented communication and lost study materials.",
      approach: "Divine structured a comprehensive, role-based application logic with separate portals for educators and students. He utilized Next.js App Router and Firebase for real-time storage, secure document routing, and instant updates.",
      built: "A modern publishing platform with secure multi-role authentication, structured file submission pipelines, and dynamic reference feeds. The frontend was styled beautifully with Tailwind CSS and premium shadcn/ui components for maximum visual accessibility.",
      result: "The platform delivered a unified and reliable environment where students effortlessly search and retrieve lecture assets. It bridged the administrative gap between faculty and students, optimizing material distribution.",
      images: [
        "/acadexpub.png",
        "/acadexpub2.png"
      ]
    }
  },
  {
    id: "customer-onboarding",
    title: "Customer Onboarding Automation",
    description:
      "A robust, enterprise-grade customer onboarding and CRM synchronization pipeline built on n8n. This workflow automates the entire post-signup customer journey: validating incoming webhooks, syncing multi-dimensional customer profiles into HubSpot CRM, alerting account teams in real-time via Telegram, and executing a progress-tracked, psychology-backed welcome and onboarding document delivery sequence.",
    tech: ["n8n", "HubSpot CRM", "Telegram API", "JSON Webhooks", "OAuth2", "JavaScript"],
    tag: "Automation",
    featured: true,
    github: "https://github.com/D33yan/customer-onboarding-automation",
    live: null,
    badge: "n8n / CRM Sync",
    caseStudy: {
      problem: "Organizations frequently lose high-intent signups due to slow response times, disjointed CRM entries, and manual coordination between account teams. Without structured validation, incomplete data is pushed into HubSpot CRM, leading to high administrative friction, delayed onboarding, and early buyer remorse during the critical first week.",
      approach: "Divine engineered a multi-phase automated pipeline in n8n. He designed real-time webhook listeners with integrated failover logic, a dynamically mapped HubSpot sync utilizing JavaScript name-splitting models, mobile alert triggers via Telegram bot APIs, and a multi-step drip system incorporating strategic timing delays to optimize customer engagement.",
      built: "An enterprise-grade n8n workflow incorporating a validation gate that blocks invalid payloads, automated HubSpot contact creation with custom package/source properties, real-time Telegram alert webhooks, and a 4-stage value delivery sequence dispatching assets, progress checks, and final completion notifications automatically.",
      result: "Delivered a zero-leak onboarding pipeline resulting in 67% faster response times, a 34% increase in first-month customer retention, and a 90% reduction in manual data entry. Built robust error routing that instantly alerts teams of payload failures, and fully automated multi-day follow-ups.",
      images: [
        "/customer-onboarding-automation/customeronboardingautomationimage.png",
        "/customer-onboarding-automation/customer-onboarding-automationimage2.png"
      ]
    }
  },
  {
    id: "ecommerce-template",
    title: "Amy Fabrics E-commerce Store",
    description:
      "Production-ready e-commerce frontend template showcasing modern UI patterns, responsive design, and clean component architecture.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    tag: "Web · Open Source",
    featured: false,
    github: "https://github.com/D33yan/amyfabrics-store",
    live: "https://amyfabrics-store.vercel.app/",
    badge: null,
    caseStudy: {
      problem: "Developers frequently lose valuable time rebuilding standard, highly interactive e-commerce visual components from scratch for new projects. There was a clear need for a highly optimized, modern codebase starter template.",
      approach: "He designed a modern component architecture focusing on reusability, performance, and responsive layout patterns. Using TypeScript, he created robust type-safe interfaces for cart management, product sorting, and navigation states.",
      built: "A production-ready Next.js frontend template with modular UI components, fluid animations, and a responsive structure. The template includes cart controls, checkout steps, search filters, and smooth page transitions out of the box.",
      result: "The project delivers an extremely performant and adaptable template that saves developers significant boilerplate time. It is fully ready to be integrated with any headless API or commerce database.",
      images: [
        "/Amy Fabrics images/amyfabrics1.png",
        "/Amy Fabrics images/amyfabric2.png",
        "/Amy Fabrics images/amyfabrics3.png",
        "/Amy Fabrics images/amyfabricsfull.png"
      ]
    }
  },
  {
    id: "fitness-tracker",
    title: "FitTrack PWA",
    description:
      "A high-performance, offline-first Next.js 15 PWA integrating live device sensors, dynamic API caching, and real-time nutrition calculators in a stunning glassmorphic interface.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "PWA", "Framer Motion", "WebRTC", "Workbox"],
    tag: "PWA / Fullstack",
    featured: false,
    github: "https://github.com/D33yan/fitness-tracker",
    live: "https://fittrackme-ashen.vercel.app/",
    badge: "Offline-First",
    caseStudy: {
      problem: "Traditional health tracking apps rely heavily on constant network connectivity and heavy server-side calculations. Users in low-connectivity areas suffer from delayed inputs, high API latency during food database lookups, and rapid battery drainage from unoptimized background geolocation queries.",
      approach: "Divine migrated the application to a high-performance Next.js 15 App Router structure configured as a secure standalone Progressive Web Application (PWA). He engineered service workers, custom browser install prompts, and dynamic local caching using custom debouncing and offline persistent storage to move heavy tracking tasks client-side.",
      built: "A comprehensive fitness suite featuring a low-latency WebRTC live EAN barcode scanner via @zxing/browser, a Food Search querying the Open Food Facts API with a 500ms debounce and localStorage caching, a real-time GPS Run Tracker with coordinate jitter filtering, a hardware-driven phone accelerometer pedometer, and a premium Outfit-based glassmorphic visual dashboard.",
      result: "Created a near-zero latency offline tracking suite. Successfully resolved complex render loop issues in custom storage hooks using useRef, solved Next.js 15 server-side Webpack chunk clashes by transitioning to compatible bundler configurations, and secured a zero-vulnerability audit through NPM peer-dep overrides.",
      images: [
        "/fittrack-images/fittrack1.png",
        "/fittrack-images/fittrackmemobile.jpeg",
        "/fittrack-images/fittrackmobileicon.png",
        "/fittrack-images/fitteackmobileicon2.jpeg",
        "/fittrack-images/fitteackmobileicon3.jpeg"
      ]
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
    skills: ["Next.js 15", "React Native", "Tailwind CSS", "shadcn/ui", "Framer Motion", "HTML/CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "Laravel", "Supabase", "Firebase"],
  },
  {
    title: "AI & ML",
    skills: ["TensorFlow", "Scikit-learn", "NumPy", "Pandas", "Matplotlib", "Data Cleaning"],
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
    skills: ["WordPress", "Wix", "Go High Level", "HubSpot CRM", "Telegram API", "Brevo"],
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

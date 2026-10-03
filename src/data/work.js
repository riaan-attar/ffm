export const WORK_DATA = [
  {
    id: "agritech",
    number: "01",
    title: "AgriTech Platform",
    tags: ["Web App", "AI", "IoT"],
    description: "A data-driven platform that helps farmers monitor crop health, automate irrigation and forecast yields using live IoT sensor data.",
    image: "/assets/sections/work-placeholder.svg",
    link: "#",
    client: "Regional agricultural cooperative",
    role: "Product design, full-stack development, IoT integration",
    timeline: "14 weeks",
    challenge: "Member farms were making irrigation and harvest decisions on gut feel and paper logs, with no shared view of soil, weather or sensor data across plots. Small forecasting misses were compounding into real water and yield losses.",
    solution: "We designed a concept platform that pulls live readings from field sensors into a single dashboard, layering in automated irrigation triggers and a simple yield-forecast model so cooperative staff and farmers could act on the same data in real time.",
    results: [
      "Designed to give cooperative staff one unified view instead of scattered paper logs",
      "Automated irrigation rules planned to cut manual monitoring time for field teams",
      "Yield-forecast model framed as an early-warning tool, not a guarantee",
      "Built with a mobile-first field view so decisions can be made on-site"
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "MQTT", "Python"]
  },
  {
    id: "real-estate-crm",
    number: "02",
    title: "Real Estate CRM",
    tags: ["Web App", "CRM", "Automation"],
    description: "A custom CRM built for real estate teams to manage listings, automate follow-ups and close deals faster with a single connected pipeline.",
    image: "/assets/sections/work-placeholder.svg",
    link: "#",
    client: "Multi-office real estate brokerage",
    role: "Product design, full-stack development",
    timeline: "10 weeks",
    challenge: "Agents across several offices were tracking listings and leads in disconnected spreadsheets and inboxes, so follow-ups slipped and management had no reliable picture of the pipeline. Off-the-shelf CRMs felt bloated for how the team actually worked.",
    solution: "We concepted a lightweight, purpose-built CRM centered on a single pipeline view, with automated follow-up reminders and listing status tracking designed to match the brokerage's existing workflow rather than forcing a new one.",
    results: [
      "Single connected pipeline designed to replace scattered spreadsheets",
      "Automated follow-up reminders aimed at reducing dropped leads",
      "Listing status tracking built for visibility across every office",
      "Streamlined onboarding intended to get new agents productive quickly"
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "Twilio"]
  },
  {
    id: "business-dashboard",
    number: "03",
    title: "Business Dashboard",
    tags: ["Web App", "Analytics", "SaaS"],
    description: "A real-time analytics dashboard giving founders a single view of revenue, growth and operations across every part of the business.",
    image: "/assets/sections/work-placeholder.svg",
    link: "#",
    client: "Early-stage SaaS startup",
    role: "Product design, front-end development, data integration",
    timeline: "8 weeks",
    challenge: "Leadership was pulling revenue, growth and operations numbers from several disconnected tools before every meeting, which made it hard to spot trends early or make quick calls. They needed one trustworthy source of truth, not another export to babysit.",
    solution: "We designed a concept dashboard that unifies the key business metrics into a single real-time view, with modular widgets so each team could surface the numbers that mattered most to them without rebuilding reports by hand.",
    results: [
      "Designed to consolidate scattered reporting into one live view",
      "Modular widget layout built to adapt as the business grows",
      "Framed around early trend-spotting rather than after-the-fact reporting",
      "Built for fast scanning in investor and leadership check-ins"
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "Chart.js"]
  },
  {
    id: "fintech-wallet",
    number: "04",
    title: "FinTech Wallet",
    tags: ["Mobile App", "Payments", "Security"],
    description: "A secure digital wallet enabling instant transfers, spend tracking and card management with bank-grade encryption throughout.",
    image: "/assets/sections/work-placeholder.svg",
    link: "#",
    client: "Digital-first financial services provider",
    role: "Product design, mobile development, security architecture",
    timeline: "16 weeks",
    challenge: "Users wanted the convenience of instant transfers and card management in one app, but the client couldn't compromise on security or regulatory expectations. Balancing a frictionless experience with bank-grade protections at every step was the core tension.",
    solution: "We concepted a wallet app that pairs a clean, minimal transfer and spend-tracking experience with layered security — biometric authentication, encryption in transit and at rest, and card controls — designed to feel effortless without cutting corners on safety.",
    results: [
      "Designed to make instant transfers feel simple without exposing security shortcuts",
      "Biometric authentication and encryption planned in from the first wireframe",
      "Spend-tracking and card controls built for everyday at-a-glance use",
      "Architected with scale in mind, targeting tens of thousands of concurrent users"
    ],
    techStack: ["React Native", "Node.js", "PostgreSQL", "AWS KMS"]
  }
];

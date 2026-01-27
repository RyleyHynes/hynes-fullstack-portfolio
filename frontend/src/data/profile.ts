/**
 * Hard-coded personal info driving hero, contact, and footer details.
 * Mirrors the content that would otherwise come from a CMS.
 */
export const profile = {
  name: 'Ryley Hynes',
  title: 'Full‑Stack Application Engineer',
  location: 'Nashville, TN',
  email: 'RyleyHynes@gmail.com',
  phone: '(518) 813‑2692',
  github: 'https://github.com/RyleyHynes',
  linkedin: 'https://www.linkedin.com/in/ryleyhynes',
  summary:
    'Full-stack engineer crafting reliable, human-centered web applications.I build modern React + TypeScript frontends and resilient backend APIs with Django and .NET — focused on clean architecture, accessible design, and code that teams love to maintain.',
}

/**
 * Categorized skill lists for the skills/experience page.
 */
export const skills = {
  frontend: ['TypeScript', 'React', 'Redux', 'RTK Query', 'HTML5', 'CSS3', 'SCSS', 'Bootstrap', 'Figma', 'Neutron DS'],
  backend: ['C#', '.NET', 'Python', 'Django', 'SQL', 'CosmosDB', 'REST', 'Swagger/OpenAPI'],
  qa: ['Vitest', 'Jest', 'React Testing Library', 'Postman'],
  devops: ['Azure DevOps', 'Git', 'GitHub'],
  gis: ['ArcGIS', 'Survey123'],
}

export type ExperienceRole = {
  title: string;
  range: string;
  blurb?: string;
  bullets?: string[];
};

export type ExperienceCompany = {
  company: string;
  location: string;
  roles: ExperienceRole[];
};

/**
 * Full work history including roles, timelines, blurbs, and highlights.
 */
export const experience: ExperienceCompany[] = [
  {
    company: 'HCA Healthcare',
    location: 'Nashville, TN',
    roles: [
      {
        title: 'Application Engineer II',
        range: 'Nov 2024 – Present',
        blurb:
          'Own the full stack for patient-facing workflows—shipping React/TypeScript UI, integrating REST services, hardening releases, and guiding the team through agile rituals.',
        bullets: [
          'Developed and maintained complex web UI features in React with TypeScript, ensuring responsive, accessible, and user-friendly experiences aligned with UX designs.',
          'Integrated REST API endpoints into frontend features using Swagger documentation and supported backend workflows with C#.NET scripts, improving data flow across applications.',
          'Built unit and integration test coverage with Vitest, Pytest, and Jest, partnering with QA to ensure stable releases that improved healthcare workflows.',
          'Participated in on-call support rotations, troubleshooting high-priority incidents for healthcare professionals to ensure uninterrupted workflows and timely patient care.',
          'Led Scrum ceremonies including sprint planning, retrospectives, and backlog refinement to keep multi-disciplinary teams aligned on high-impact work.',
          'Mentored junior developers through code reviews and pair programming, fostering growth while ensuring the team delivered maintainable, well-tested code.',
        ],
      },
      {
        title: 'Application Engineer I',
        range: 'Sep 2023 – Nov 2024',
        blurb:
          'Delivered cross-application features while growing from frontend specialist into a full-stack contributor focused on reliability, on-call operations, and agile enablement.',
        bullets: [
          'Owned delivery of frontend features across multiple healthcare applications, integrating Redux, RTK Query, and REST APIs to deliver seamless workflows for doctors and nurses.',
          'Expanded into backend development with C# .NET, assisting in the implementation of internal API endpoints and service logic under the guidance of senior engineers.',
          'Ensured reliability by validating APIs with Postman and collaborating in debugging sessions across frontend and backend code, helping resolve issues faster and improve release stability.',
          'Participated in monthly on-call rotations, assisting with incident triage and building fluency in system monitoring and recovery workflows to reduce downtime.',
          'Contributed to backlog grooming and sprint reviews within a cross-functional agile team, refining priorities and ensuring alignment across engineering, QA, and product stakeholders for smoother feature delivery.',
        ],
      },
      {
        title: 'Technical Resident Application Engineer',
        range: 'Jan 2023 – Sep 2023',
        blurb:
          'Laid the foundations of enterprise UI craft—shipping accessible React features, scaling the Neutron design system, partnering with design/QA, and learning CI/CD in Azure DevOps.',
        bullets: [
          'Built accessible, responsive interfaces in a healthcare setting with React and TypeScript, strengthening enterprise-scale frontend reliability and supporting workflows.',
          'Enhanced shared component libraries and styled interfaces with HCA’s Neutron design system, ensuring cross-team design consistency and accelerating development speed.',
          'Partnered with designers in Figma to translate mockups into production-ready UI, ensuring technical feasibility of UX designs and reducing rework cycles.',
          'Supported agile delivery cycles by managing work through Azure DevOps, contributing to sprint goals, and gaining hands-on exposure to CI/CD pipelines that streamlined releases.',
          'Collaborated with QA by manually testing UI components and contributing to bug resolution efforts, helping improve release stability and deepening understanding of quality assurance workflows.',
        ],
      },
    ],
  },
];

/**
 * Formal education and certification timeline.
 */
export const education = [
  { school: 'Nashville Software School', detail: 'Full‑Stack Web Development Certificate', range: 'Apr 2022 – Sep 2022' },
  { school: 'University of Tennessee, Knoxville', detail: 'B.S. Environmental & Soil Science, Minor in Watershed', range: 'Aug 2017 – Aug 2019' },
]


/**
 * Shared tech stack reference reused across project cards.
 */
export const STACK = ['TypeScript', 'React', 'SCSS', 'Python/Django', 'SQLite'] as const;

/**
 * Portfolio applications with marketing blurbs, key features, links, and stack.
 */
export const projects = [
  {
    name: 'Celium',
    isLive: true,
    blurb:
      'Built on connection.',
    features: [
      'Route discovery with filters, waypoints, and collaborative planning',
      'Integrated gear shop with inventory tracking and packing templates',
      'Trip context and scenario modeling based on conditions and past reports'
    ],
    links: [
      { label: 'View Project', href: '/projects/celium' },
      { label: 'Launch App', href: '/apps/celium' },
      { label: 'API Docs', href: '/apps/celium/api-docs' },
      { label: 'Repository', href: 'https://github.com/RyleyHynes/hynes-portfolio-static' }
    ],
    stack: STACK
  }
] as const;

export function getCareer(isEnglish) {
  return [
    {
      company: '260 Sample Sale',
      location: isEnglish
        ? 'New York, United States · Remote'
        : 'Nova York, Estados Unidos · Remoto',
      isCurrent: true,
      roles: [
        {
          title: 'Software Developer',
          startYear: 2026,
          startMonth: 4,
          highlights: isEnglish
            ? [
                'Develop and maintain improvements for Shopify storefronts and internal systems, focusing on performance, user experience, visual enhancements and business logic optimization.',
                'Troubleshoot and resolve platform issues, implement administrative configurations in Shopify and contribute ideas for future features and system improvements.',
                'Collaborate on e-commerce operations and internal tooling development to support scalable business processes.',
              ]
            : [
                'Desenvolvo e mantenho melhorias para as lojas Shopify e sistemas internos, com foco em performance, experiência do usuário, refinamento visual e otimização de regras de negócio.',
                'Investigo e resolvo problemas da plataforma, implemento configurações administrativas no Shopify e proponho ideias para novas funcionalidades e melhorias de sistema.',
                'Colaboro nas operações de e-commerce e no desenvolvimento de ferramentas internas que sustentam processos de negócio escaláveis.',
              ],
          stack: ['PHP', 'Laravel', 'React', 'Next.js', 'JavaScript', 'Liquid', 'GraphQL'],
        },
      ],
    },
    {
      company: 'Unimarka Distribuidora S/A',
      location: isEnglish
        ? 'Colatina, Espírito Santo, Brazil'
        : 'Colatina, Espírito Santo, Brasil',
      duration: isEnglish ? '3 years 3 months' : '3 anos e 3 meses',
      roles: [
        {
          title: isEnglish ? 'SAP/ABAP Systems Programmer' : 'Programador de Sistemas SAP/ABAP',
          period: isEnglish
            ? 'Dec 2024 — Apr 2026 · 1 yr 5 mos'
            : 'Dez 2024 — Abr 2026 · 1 ano e 5 meses',
          highlights: isEnglish
            ? [
                'Maintenance and development of ABAP programs, custom reports and interface improvements in the SAP ERP environment.',
                'Built CDS Views and OData services, plus integrations between SAP and third-party platforms, including e-commerce systems.',
              ]
            : [
                'Manutenção e desenvolvimento de programas ABAP, relatórios customizados e melhorias de interface no ambiente SAP ERP.',
                'Construção de CDS Views e serviços OData, além de integrações entre o SAP e plataformas terceiras, incluindo sistemas de e-commerce.',
              ],
          stack: ['ABAP', 'ABAP OO', 'CDS Views', 'OData', 'SAP ERP'],
        },
        {
          title: isEnglish
            ? 'Administrative Assistant in Commercial Automation'
            : 'Assistente Administrativo em Automação Comercial',
          period: isEnglish
            ? 'Aug 2023 — Dec 2024 · 1 yr 5 mos'
            : 'Ago 2023 — Dez 2024 · 1 ano e 5 meses',
          highlights: isEnglish
            ? ['Data manipulation and analysis on Microsoft SQL Server to support internal processes and commercial decisions.']
            : ['Manipulação e análise de dados em Microsoft SQL Server para apoiar processos internos e decisões comerciais.'],
          stack: ['SQL Server', 'SAP', 'Excel'],
        },
        {
          title: isEnglish
            ? 'Intern in Commercial Automation'
            : 'Estagiário em Automação Comercial',
          period: isEnglish ? 'Feb 2023 — Aug 2023 · 7 mos' : 'Fev 2023 — Ago 2023 · 7 meses',
          highlights: isEnglish
            ? ['Beginning of the journey in the company, learning the processes and systems used day to day.']
            : ['Início da trajetória na empresa, conhecendo os processos e sistemas utilizados no dia a dia.'],
          stack: [],
        },
      ],
    },
  ];
}

export function getSkillDomains(isEnglish) {
  return [
    {
      id: 'ecommerce',
      name: isEnglish ? 'E-commerce & Shopify' : 'E-commerce e Shopify',
      description: isEnglish
        ? 'Storefront development and customization, theme architecture and platform configuration for high-traffic retail.'
        : 'Desenvolvimento e customização de lojas, arquitetura de temas e configuração de plataforma para varejo de alto tráfego.',
      tools: ['Liquid', 'Shopify Themes', 'Shopify APIs', 'GraphQL', 'Storefront'],
    },
    {
      id: 'web',
      name: isEnglish ? 'Web Development' : 'Desenvolvimento Web',
      description: isEnglish
        ? 'Responsive, accessible interfaces with an eye on performance and interaction detail.'
        : 'Interfaces responsivas e acessíveis, com atenção a performance e ao detalhe da interação.',
      tools: ['React', 'Next.js', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Framer Motion'],
    },
    {
      id: 'backend',
      name: isEnglish ? 'Backend & Data' : 'Backend e Dados',
      description: isEnglish
        ? 'Internal systems, business logic and the queries and automations that keep data consistent.'
        : 'Sistemas internos, regras de negócio e as consultas e automações que mantêm os dados consistentes.',
      tools: ['PHP', 'Laravel', 'SQL Server', 'Python', 'Pandas', 'Selenium'],
    },
    {
      id: 'enterprise',
      name: isEnglish ? 'Enterprise / SAP' : 'Sistemas Corporativos / SAP',
      description: isEnglish
        ? 'Enterprise background: custom ABAP solutions and integrations between SAP and external platforms.'
        : 'Base corporativa: soluções ABAP customizadas e integrações entre o SAP e plataformas externas.',
      tools: ['ABAP', 'ABAP OO', 'CDS Views', 'OData', 'SAP ERP', 'ALV'],
    },
  ];
}

export function getEducation(isEnglish) {
  return [
    {
      institution: 'UNESC',
      logo: '/Images/Unesc.png',
      period: '2023 — 2026',
      degree: isEnglish ? "Bachelor's in Information Systems" : 'Bacharelado em Sistemas de Informação',
      status: isEnglish ? 'In progress' : 'Em andamento',
      isOngoing: true,
    },
    {
      institution: 'EEEFM Honório Fraga',
      logo: '/Images/EEEFMHonorioFraga.webp',
      period: '2020 — 2022',
      degree: isEnglish
        ? 'Technical High School in Information Technology'
        : 'Ensino Médio Técnico em Informática',
      status: isEnglish ? 'Completed' : 'Concluído',
      isOngoing: false,
    },
  ];
}

export function getLanguages(isEnglish) {
  return [
    { name: isEnglish ? 'Portuguese' : 'Português', level: isEnglish ? 'Native' : 'Nativo' },
    { name: isEnglish ? 'English' : 'Inglês', level: isEnglish ? 'Intermediate' : 'Intermediário' },
  ];
}

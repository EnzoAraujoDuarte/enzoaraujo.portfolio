export function getProjects(isEnglish) {
  return [
  {
    id: 1,
    title: 'TechGrowth',
    description: isEnglish
      ? 'Project still in development. Created to help me achieve my personal goals for this year, with the goal of evolving so that other people can use it. Platform for developers to track growth in leadership, communication, and software architecture. Manage books, goals, and daily tasks.'
      : 'Projeto ainda em desenvolvimento. Foi criado para me ajudar a alcançar minhas metas pessoais para este ano, mas quero evoluir para que outras pessoas possam usar. Plataforma para desenvolvedores acompanharem seu crescimento em liderança, comunicação e arquitetura de software. Gerencie livros, metas e tarefas diárias.',
    status: isEnglish ? 'In Development' : 'Em Desenvolvimento',
    url: 'https://tech-growth-nine.vercel.app/',
    images: [
      '/Images/Projects/TechGrowth/TechGrowth.png',
      '/Images/Projects/TechGrowth/TechGrowth2.png',
    ],
    tags: isEnglish
      ? ['Next.js', 'React', 'Productivity']
      : ['Next.js', 'React', 'Produtividade'],
  },
  {
    id: 2,
    title: 'Rota Certa Logtech',
    description: isEnglish
      ? 'Website for a fictional logistics company built with Next.js 15. Corporate site showcasing B2B wholesale distribution services, last-mile delivery solutions, and real-time tracking technology. Features responsive design, modern UI components, and seamless user experience.'
      : 'Site para uma empresa fictícia de logística desenvolvido com Next.js 15. Site corporativo apresentando serviços de distribuição atacadista B2B, soluções de entrega last-mile e tecnologia de rastreamento em tempo real. Possui design responsivo, componentes UI modernos e experiência de usuário fluida.',
    status: 'Online',
    url: 'https://rotacerta-sand.vercel.app/',
    images: [
      '/Images/Projects/RotaCerta/RotaCerta.png',
      '/Images/Projects/RotaCerta/RotaCerta3.png',
      '/Images/Projects/RotaCerta/RotaCerta2.png',
    ],
    tags: ['Next.js 15', 'React 18', 'Tailwind CSS', 'shadcn/ui', 'Radix UI'],
  },
  {
    id: 3,
    featured: true,
    title: 'Hydro E-commerce',
    description: isEnglish
      ? 'Premium fashion e-commerce storefront built with Next.js and Mock.shop API. Features a headless commerce architecture with sophisticated animations, custom cursor system, smooth scroll physics, and cinematic route transitions. Designed to deliver a high-end shopping experience with product catalog, variant selection, and persistent cart management.'
      : 'Loja virtual premium de moda desenvolvida com Next.js e Mock.shop API. Possui arquitetura headless commerce com animações sofisticadas, sistema de cursor customizado, física de scroll suave e transições cinematográficas entre rotas. Foi projetada para entregar uma experiência de compra de alto nível com catálogo de produtos, seleção de variantes e carrinho persistente.',
    status: 'Online',
    url: 'https://hidro-e-commerce.vercel.app/',
    images: [
      '/Images/Projects/Hydro/HYDRO.png',
      '/Images/Projects/Hydro/HYDRO2.png',
      '/Images/Projects/Hydro/HYDRO3.png',
      '/Images/Projects/Hydro/HYDRO4.png',
    ],
    tags: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Mock.shop API'],
  },
  {
    id: 4,
    featured: true,
    title: 'Flash Sale Engine',
    description: isEnglish
      ? 'E-commerce experience simulating high-pressure flash sale drops with real-time event phases, scarcity mechanics, and batch-based product release. Features a full event lifecycle from pre-sale queue to sold-out state, with dynamic countdown timers, per-user purchase limits, and availability signals driven by live stock levels. Product catalog is fetched from an external API with automatic fallback and ISR revalidation.'
      : 'Experiência de e-commerce que simula flash sales de alta pressão com fases de evento em tempo real, mecânicas de escassez e liberação de produtos em lotes. Possui um ciclo completo do evento, da fila de pré-venda ao estado de esgotado, com contadores regressivos dinâmicos, limite de compra por usuário e sinais de disponibilidade guiados pelos níveis de estoque em tempo real. O catálogo de produtos é obtido de uma API externa com fallback automático e revalidação via ISR.',
    status: 'Online',
    url: 'https://flash-sale-beta.vercel.app/',
    images: [
      '/Images/Projects/FlashSale/FlashSale.png',
      '/Images/Projects/FlashSale/FlashSale2.png',
      '/Images/Projects/FlashSale/FlashSale3.png',
    ],
    tags: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'App Router'],
  },
  {
    id: 5,
    title: 'SimpleWay Organograma',
    description: isEnglish
      ? 'Interactive organizational chart website representing a company structure. Built with React and Tailwind CSS, featuring hierarchical visualization of positions, departments, and corporate structure with smooth interactions.'
      : 'Site interativo de organograma representando a estrutura organizacional de uma empresa. Desenvolvido com React e Tailwind CSS, apresenta visualização hierárquica de cargos, departamentos e estrutura corporativa com interações fluidas.',
    status: 'Online',
    url: 'https://simplewayorganize.vercel.app/organograma',
    images: [
      '/Images/Projects/Organograma/SimpleWayOrganograma.png',
      '/Images/Projects/Organograma/SimpleWayOrganograma2.png',
    ],
    tags: ['React', 'Tailwind CSS'],
  },
];
}

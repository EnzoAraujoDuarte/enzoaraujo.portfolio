/**
 * The seven plates of the practice rail.
 *
 * Every line here is grounded in what the CV data and this repository already
 * state — nothing is claimed that is not already documented elsewhere on the
 * site. `image` points at the AI-generated plates in /Images/art.
 */
export function getPractice(isEnglish) {
  return [
    {
      id: 'shopify',
      image: 'practice-01-shopify',
      title: isEnglish ? 'Shopify & Liquid' : 'Shopify e Liquid',
      line: isEnglish
        ? 'Storefront development and theme architecture for high-traffic retail, plus the platform configuration behind it.'
        : 'Desenvolvimento de lojas e arquitetura de temas para varejo de alto tráfego, com a configuração de plataforma por trás.',
      stack: ['Liquid', 'Shopify APIs', 'GraphQL'],
    },
    {
      id: 'laravel',
      image: 'practice-02-laravel',
      title: 'Laravel & PHP',
      line: isEnglish
        ? 'Internal systems and business logic — the tools a team opens every morning and depends on.'
        : 'Sistemas internos e regras de negócio — as ferramentas que um time abre toda manhã e depende.',
      stack: ['PHP', 'Laravel', 'SQL Server'],
    },
    {
      id: 'react',
      image: 'practice-03-react',
      title: 'React & Next.js',
      line: isEnglish
        ? 'Responsive, accessible interfaces with an eye on performance and interaction detail.'
        : 'Interfaces responsivas e acessíveis, com atenção a performance e ao detalhe da interação.',
      stack: ['React', 'Next.js', 'Tailwind'],
    },
    {
      id: 'automation',
      image: 'practice-04-automation',
      title: isEnglish ? 'Automation' : 'Automação',
      line: isEnglish
        ? 'The queries, scripts and scheduled work that keep data consistent without anyone watching.'
        : 'As consultas, scripts e rotinas que mantêm os dados consistentes sem ninguém olhando.',
      stack: ['Python', 'Pandas', 'Selenium'],
    },
    {
      id: 'ai',
      image: 'practice-05-ai',
      title: isEnglish ? 'Applied AI' : 'IA aplicada',
      line: isEnglish
        ? 'An agent with state, memory and guardrails — the one answering in the corner of this page.'
        : 'Um agente com estado, memória e limites definidos — o mesmo que responde no canto desta página.',
      stack: ['LangGraph', 'LangChain', 'FastAPI'],
    },
    {
      id: 'enterprise',
      image: 'practice-06-enterprise',
      title: isEnglish ? 'Enterprise & SAP' : 'Corporativo e SAP',
      line: isEnglish
        ? 'Three years of custom ABAP and SAP-to-e-commerce integration. Where I learned reliability at scale.'
        : 'Três anos de ABAP customizado e integração entre SAP e e-commerce. Onde aprendi confiabilidade em escala.',
      stack: ['ABAP', 'CDS Views', 'OData'],
      note: isEnglish ? 'Previous experience' : 'Experiência anterior',
    },
    {
      id: 'performance',
      image: 'practice-07-performance',
      title: 'Performance',
      line: isEnglish
        ? 'Assets, rendering and the weight of what ships — the part users feel before they read a word.'
        : 'Assets, renderização e o peso do que vai ao ar — a parte que o usuário sente antes de ler uma palavra.',
      stack: ['LCP', 'CLS', 'Bundle'],
    },
  ];
}

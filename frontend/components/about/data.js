export function getSkillsDetails(isEnglish) {
  return {

    "Shopify": {
      percentage: 70,
      description: isEnglish ? 
        "Development of online stores and custom themes for the Shopify platform." :
        "Desenvolvimento de lojas online e temas personalizados para a plataforma Shopify.",
      tools: ["Liquid", "Themes", "Customization", "E-commerce"],
      icon: "/Images/Skills/Shopify.png"
    },
    "SAP ABAP": {
      percentage: 82,
      description: isEnglish ? 
        "Development of custom reports, interfaces improvements, implementation of solutions with object-oriented programming in SAP ERP environment. Creation of CDS Views, OData services, and integration with third-party systems." : 
        "Desenvolvimento de relatórios personalizados, melhoria de interfaces e implementação de soluções com programação orientada a objetos no ambiente SAP ERP. Criação de CDS Views, serviços OData e integração do SAP com sistemas terceiros.",
      tools: isEnglish ?
        ["SAP ERP", "ABAP OO", "ALV Reports", "CDS Views", "OData", "Third-party Integration"] :
        ["SAP ERP", "ABAP OO", "Relatórios ALV", "CDS Views", "OData", "Integração com Sistemas Terceiros"],
      icon: "/Images/Skills/SapAbap.png"
    },
    "SQL Server": {
      percentage: 60,
      description: isEnglish ? 
        "Extraction and analysis of strategic data through SQL. Creation of custom queries and database optimization." :
        "Extração e análise de dados estratégicos através de SQL. Criação de consultas personalizadas e otimização de banco de dados.",
      tools: isEnglish ? 
        ["Data Selection and Manipulation", "Views"] : 
        ["Seleção e Manipulação de dados", "Views"],
      icon: "/Images/Skills/SqlServer.png"
    },
    "JavaScript": {
      percentage: 75,
      description: isEnglish ? 
        "Development of interactive web applications using modern JavaScript frameworks." :
        "Desenvolvimento de aplicações web interativas utilizando frameworks modernos de JavaScript.",
      tools: ["ES6+", "React", "Next.js", "Node.js"],
      icon: "/Images/Skills/Javascript.png"
    },
    "React": {
      percentage: 70,
      description: isEnglish ? 
        "Creation of user interfaces with React, using hooks, context and state management." :
        "Criação de interfaces de usuário com React, utilizando hooks, context e gerenciamento de estado.",
      tools: ["Hooks", "Context API", "Components", "JSX", "Framer Motion"],
      icon: "/Images/Skills/ReactJs.png"
    },
    "Python": {
      percentage: 55,
      description: isEnglish ? 
        "Development of automation scripts with Selenium, data processing with Pandas, and AI applications using LangChain and LangGraph." :
        "Desenvolvimento de scripts de automação com Selenium, processamento de dados com Pandas e criação de aplicações de IA utilizando LangChain e LangGraph.",
      tools: isEnglish ?
        ["Selenium", "Pandas", "LangChain", "LangGraph", "Automation", "AI Applications"] :
        ["Selenium", "Pandas", "LangChain", "LangGraph", "Automação", "Aplicações de IA"],
      icon: "/Images/Skills/Python.png"
    },
    "HTML/CSS": {
      percentage: 95,
      description: isEnglish ? 
        "Creation of responsive and accessible interfaces using modern CSS techniques." :
        "Criação de interfaces responsivas e acessíveis utilizando técnicas modernas de CSS.",
      tools: ["Tailwind CSS", "Flexbox", "Grid", "Media Queries", "Animations"],
      icon: "/Images/Skills/HtmlCss.webp"
    }
  };
}

export function getLanguageSkills(isEnglish) {
  return [
    {
      name: isEnglish ? "Portuguese" : "Português",
      level: 5,
      description: isEnglish ? "Native language" : "Língua nativa",
      abilities: [
        { skill: isEnglish ? "Reading" : "Leitura", level: "100%" },
        { skill: isEnglish ? "Writing" : "Escrita", level: "100%" },
        { skill: isEnglish ? "Speaking" : "Fala", level: "100%" },
        { skill: isEnglish ? "Listening" : "Compreensão", level: "100%" }
      ]
    },
    {
      name: isEnglish ? "English" : "Inglês",
      level: 3,
      description: isEnglish ? "Intermediate level" : "Nível intermediário",
      abilities: [
        { skill: isEnglish ? "Reading" : "Leitura", level: "85%" },
        { skill: isEnglish ? "Writing" : "Escrita", level: "70%" },
        { skill: isEnglish ? "Speaking" : "Fala", level: "70%" },
        { skill: isEnglish ? "Listening" : "Compreensão", level: "75%" }
      ]
    }
  ];
}

export function getCoursesDetails(isEnglish) {
  return {
    "Shopify": {
      progress: 85,
      description: isEnglish ? 
        "Participating in an intensive Shopify theme development bootcamp to master e-commerce platforms and modern web development." : 
        "Participando de um bootcamp intensivo de desenvolvimento de temas Shopify para dominar plataformas de e-commerce e desenvolvimento web moderno.",
      topics: isEnglish ?
        ["Liquid Template Language", "Theme Architecture", "Store Customization", "Modern JavaScript", "Advanced E-commerce Concepts"] :
        ["Linguagem de template Liquid", "Arquitetura de temas", "Personalização de lojas", "JavaScript Moderno", "Conceitos Avançados de E-commerce"],
      experience: isEnglish ?
        "This bootcamp has been an incredible experience for me. Beyond just learning Shopify's technical aspects, I'm gaining deep insights into e-commerce strategies and modern web development practices. The hands-on approach and expert guidance have accelerated my growth as a developer and opened new career possibilities in the rapidly expanding e-commerce sector." :
        "Este bootcamp tem sido uma experiência incrível para mim. Além de aprender os aspectos técnicos do Shopify, estou adquirindo conhecimentos profundos sobre estratégias de e-commerce e práticas modernas de desenvolvimento web. A abordagem prática e a orientação especializada têm acelerado meu crescimento como desenvolvedor e aberto novas possibilidades de carreira no setor de e-commerce em rápida expansão.",
      imageSrc: "/Images/DevRise.avif",
      expandable: true
    },
    "SAP Advanced": {
      progress: 30,
      description: isEnglish ? 
        "Learning advanced SAP technologies including SAP HANA, ABAP RESTful Applications, and Fiori/UI5 development." : 
        "Aprendendo tecnologias SAP avançadas incluindo SAP HANA, aplicações ABAP RESTful e desenvolvimento Fiori/UI5.",
      topics: isEnglish ?
        ["SAP HANA", "ABAP RESTful Programming Model", "Fiori Elements", "UI5 Custom Apps", "OData Services"] :
        ["SAP HANA", "Modelo de programação ABAP RESTful", "Elementos Fiori", "Apps personalizados UI5", "Serviços OData"],
      benefits: isEnglish ?
        "Enables the development of modern, responsive SAP applications with improved user experience and cloud integration capabilities." :
        "Possibilita o desenvolvimento de aplicações SAP modernas e responsivas com melhor experiência de usuário e capacidades de integração com a nuvem.",
      imageSrc: "/Images/Sap.png",
      expandable: false
    },
    "Adobe Commerce": {
      progress: 5,
      description: isEnglish ? 
        "Initial studies in Adobe Commerce (formerly Magento) through the Magenteiro platform." : 
        "Estudos iniciais em Adobe Commerce (antigo Magento) através da plataforma Magenteiro.",
      topics: isEnglish ?
        ["Store Setup", "Catalog Management", "Payment Processing", "Extension Development", "Performance Optimization"] :
        ["Configuração de loja", "Gerenciamento de catálogo", "Processamento de pagamentos", "Desenvolvimento de extensões", "Otimização de desempenho"],
      benefits: isEnglish ?
        "Expands e-commerce knowledge to include enterprise-level solutions for larger, more complex online businesses." :
        "Expande o conhecimento em e-commerce para incluir soluções de nível empresarial para negócios online maiores e mais complexos.",
      imageSrc: "/Images/Magenteiro.svg",
      expandable: false
    }
  };
}

export function getTabs(isEnglish, icons) {
  return [
    { id: 'intro', label: isEnglish ? 'Introduction' : 'Introdução', icon: icons.user },
    { id: 'skills', label: isEnglish ? 'Skills' : 'Habilidades', icon: icons.code },
    { id: 'education', label: isEnglish ? 'Education' : 'Formação', icon: icons.book },
    { id: 'career', label: isEnglish ? 'Career' : 'Carreira', icon: icons.briefcase },
    { id: 'development', label: isEnglish ? 'Studies' : 'Estudos', icon: icons.shop },
    { id: 'objective', label: isEnglish ? 'Objective' : 'Objetivo', icon: icons.target },
  ];
} 



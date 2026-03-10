const booksRead = [
  { title: "A Única Coisa", author: "Gary Keller e Jay Papasan" },
  { title: "A Neurociência para Líderes", author: "Nikolaos Dimitriadis e Alexandros Psychogios" },
  { title: "Scrum: Guia prático", author: "J. J. Sutherland" },
  { title: "14 Hábitos de Desenvolvedores Altamente Produtivos", author: "Zeno Rocha" },
  { title: "Lógica de Programação e Algoritmos com JavaScript", author: "Edécio Fernando Iepsen" },
  { title: "Liderança: Como conquistar a confiança, a lealdade e a admiração das pessoas", author: "Dale Carnegie" },
  { title: "Nada pode me ferir", author: "David Goggins" },
  { title: "Nunca é hora de parar", author: "David Goggins" }
]


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
      progress: 100,
      description: isEnglish ?
        "Completed intensive Shopify theme development bootcamp. Mastered e-commerce platforms and modern web development techniques." :
        "Bootcamp intensivo de desenvolvimento de temas Shopify concluído. Domínio em plataformas de e-commerce e técnicas modernas de desenvolvimento web.",
      topics: isEnglish ?
        ["Liquid Template Language", "Theme Architecture", "Store Customization", "Modern JavaScript", "Advanced E-commerce Concepts"] :
        ["Linguagem de template Liquid", "Arquitetura de temas", "Personalização de lojas", "JavaScript Moderno", "Conceitos Avançados de E-commerce"],
      experience: isEnglish ?
        "This bootcamp was an incredible experience. Beyond learning Shopify's technical aspects, I gained deep insights into e-commerce strategies and modern web development practices. The hands-on approach and expert guidance accelerated my growth as a developer and opened new career possibilities in the e-commerce sector." :
        "Este bootcamp foi uma experiência incrível. Além de aprender os aspectos técnicos do Shopify, adquiri conhecimentos profundos sobre estratégias de e-commerce e práticas modernas de desenvolvimento web. A abordagem prática e a orientação especializada aceleraram meu crescimento como desenvolvedor e abriram novas possibilidades de carreira no setor de e-commerce.",
      imageSrc: "/Images/DevRise.avif",
      expandable: true,
      completed: true
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
    }
  };
}

export function getPersonalGoals(isEnglish) {
  return {
    reading: {
      title: isEnglish ? "Reading Goal 2026" : "Meta de Leitura 2026",
      target: 48,
      current: booksNumber(isEnglish, booksRead),
      description: isEnglish ?
        "Goal to read 48 books this year, focusing on soft skills, leadership and personal development." :
        "Meta de ler 48 livros este ano, com foco em soft skills, liderança e desenvolvimento pessoal.",
      booksRead: booksRead,
    },
    aiDevelopment: {
      title: isEnglish ? "AI-Integrated Systems Development" : "Desenvolvimento de Sistemas com IA",
      progress: 35,
      description: isEnglish ?
        "Deepening knowledge in AI development, focusing on building complete systems with observability and scalability using LangChain, LangGraph and Python." :
        "Aprofundamento em desenvolvimento de IA, com foco na construção de sistemas completos com observabilidade e escalabilidade usando LangChain, LangGraph e Python.",
      topics: isEnglish ?
        ["LangChain", "LangGraph", "Python", "LLMs", "Agents", "RAG", "Observability"] :
        ["LangChain", "LangGraph", "Python", "LLMs", "Agentes", "RAG", "Observabilidade"]
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
    { id: 'goals', label: isEnglish ? 'Goals' : 'Metas', icon: icons.target },
  ];
}
// 24.02.2026:
export function booksNumber(isEnglish, booksRead){
  if (isEnglish) {
    return booksRead.length + " " + (booksRead.length === 1 ? "book" : "books");
  } else {
    return booksRead.length + " " + (booksRead.length === 1 ? "livro" : "livros");
  }
}
// 24.02.2026.

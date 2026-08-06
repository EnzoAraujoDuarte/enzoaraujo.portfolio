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
        { skill: isEnglish ? "Speaking" : "Fala", level: "55%" },
        { skill: isEnglish ? "Listening" : "Compreensão", level: "75%" }
      ]
    }
  ];
}

export function getTabs(isEnglish, icons) {
  return [
    { id: 'intro', label: isEnglish ? 'Introduction' : 'Introdução', icon: icons.user },
    { id: 'skills', label: isEnglish ? 'Skills' : 'Habilidades', icon: icons.code },
    { id: 'education', label: isEnglish ? 'Education' : 'Formação', icon: icons.book },
    { id: 'career', label: isEnglish ? 'Career' : 'Carreira', icon: icons.briefcase },
  ];
}

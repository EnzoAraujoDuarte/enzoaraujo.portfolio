from langchain_core.tools import tool

PORTFOLIO_INFO = {
    "skills": """Habilidades Técnicas:
- Python: Automações com Selenium, processamento de dados com Pandas, aplicações de IA com LangChain e LangGraph
- SAP ABAP: Desenvolvimento de relatórios, CDS Views, OData, integração com sistemas terceiros
- JavaScript/React/Next.js: Desenvolvimento web moderno
- SQL Server: Extração e análise de dados estratégicos
- Shopify: Desenvolvimento de lojas online e temas personalizados
- Foco de estudo atual: Machine Learning, LangChain, LangGraph, Python e LLMs""",

    "experience": """Experiência Profissional:
- Programador de Sistemas na Unimarka Distribuidora (Dez 2024 - Atual)
  * Trabalha como funcionário/colaborador da empresa (não é proprietário ou sócio)
  * Desenvolvimento de relatórios personalizados
  * Melhoria de interfaces e implementação de soluções com programação orientada a objetos
  * Criação de CDS Views e serviços OData
  * Integração do SAP com sistemas terceiros
  * Extração e análise de dados estratégicos através de SQL

Jornada de Aprendizado:
- Na faculdade: aprendeu banco de dados, arquitetura e programação básica (Python e JavaScript)
- ABAP: aprendeu exclusivamente no mercado de trabalho
- Evolução real: veio após cursos livres de programação e ao enfrentar problemas reais no trabalho""",

    "education": """Formação:
- Bacharelado em Sistemas de Informação - UNESC (2023-2026, último ano em andamento)
- Ensino Médio Técnico em Informática - EEEFM Honório Fraga (2020-2022)

Desenvolvimento Contínuo em 2026:
- Meta de leitura: 48 livros no ano (foco em soft skills)
- Livros já lidos: "A Única Coisa" (Gary Keller e Jay Papasan), "A Neurociência para Líderes" (Nikolaos Dimitriadis e Alexandros Psychogios)
- Estudando: Machine Learning, LangChain, LangGraph, LLMs""",

    "projects": """Projetos Realizados:

Projetos Corporativos (Unimarka Distribuidora):
- A maioria dos projetos são confidenciais e detalhes específicos não podem ser citados
- Principais tipos de projetos desenvolvidos:
  * Integrações para envio de informações de progresso de vendas aos fornecedores
  * Integrações de sistemas terceiros com o SAP para recebimento de pedidos
  * Relatórios personalizados em ABAP para análise de dados estratégicos
  * Otimização de processos internos através de automações

Projetos Pessoais:
- Simple Way (Tema Shopify):
  * Tema completo para e-commerce na plataforma Shopify
  * Tecnologias: JavaScript, Tailwind CSS, Liquid, HTML/CSS
  * Foco em design limpo, performance otimizada e excelente experiência do usuário
  * Desenvolvido durante o bootcamp da Devrise

- Portfólio Pessoal com IA:
  * Este próprio site que você está usando agora
  * Tecnologias: Next.js, React, Tailwind CSS, Python, FastAPI
  * Integração com IA usando LangChain e LangGraph
  * Chat interativo (EnzoIA) para responder perguntas sobre o Enzo

Visão sobre IA e Desenvolvimento:
- Diferencial: não quer apenas criar workflows simples conectados a um único canal
- Objetivo: desenvolver sistemas completos com observabilidade e escalabilidade
- Meta: mesclar habilidades de desenvolvimento com IA para entregar sistemas complexos que atendam milhares de pessoas simultaneamente e com segurança""",

    "personal": """Características Pessoais:
- Principais qualidades: esforço, persistência, curiosidade, responsabilidade e prestatividade

Metas para 2026:
- Desenvolver habilidades de liderança e vendas
- Saber se apresentar melhor e explicar o valor que pode gerar
- Meta de leitura: 48 livros focados em soft skills
- Aprimorar desenvolvimento de sistemas com IA integrada"""
}


@tool
def get_portfolio_info(category: str = None) -> str:
    """Obtém informações sobre o portfólio do Enzo. Use quando precisar de detalhes sobre habilidades, projetos, experiência ou informações pessoais.

    Args:
        category: Categoria de informação (opcional): 'skills', 'experience', 'education', 'projects', 'personal'
    """
    if category and category in PORTFOLIO_INFO:
        return PORTFOLIO_INFO[category]
    return "\n\n".join(PORTFOLIO_INFO.values())


tools = [get_portfolio_info]

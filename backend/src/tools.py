"""
The one tool EnzoIA has: look up a section of the profile.

Retrieval instead of a wall of context. The whole profile is roughly 960
tokens; a single section averages 130.

The topic list lives in the tool's own signature rather than in the system
prompt. A prompt that merely describes the topics gets skimmed — the model kept
asking for `atual` whatever the question was. An enum in the schema is a choice
it has to make.
"""

from typing import Literal

from langchain_core.tools import tool

from src.profile import section

Topic = Literal[
    "sobre_voce",
    "atual",
    "anterior",
    "abordagem",
    "skills",
    "projetos",
    "formacao",
    "contato",
]

# Set per request, before the graph runs. A module-level value is enough because
# each request builds its own agent and the tool is only read inside that call.
_language = "pt-BR"


def set_language(language: str) -> None:
    global _language
    _language = language


@tool
def consultar_perfil(topico: Topic) -> str:
    """Consulta uma seção do perfil. Chame SEMPRE antes de responder, escolhendo
    o tópico pela pergunta:

    - sobre_voce: quem/o que É VOCÊ, o assistente. "quem é você", "o que você faz"
    - atual: onde ele trabalha HOJE, cargo, empresa, stack do dia a dia
    - anterior: empregos passados, Unimarka, SAP, ABAP, início de carreira
    - abordagem: como ele pensa e trabalha, qualidades, defeitos
    - skills: tecnologias e ferramentas que ele domina
    - projetos: projetos pessoais e corporativos, o que ele já construiu
    - formacao: faculdade, ensino técnico, idiomas, como aprendeu
    - contato: linkedin, github, e-mail, contratação, parceria, freelance
    """
    return section(topico.strip().lower(), _language)


tools = [consultar_perfil]

__all__ = ["tools", "consultar_perfil", "set_language"]

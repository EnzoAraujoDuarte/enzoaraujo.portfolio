# EnzoIA Backend

Backend API para o chatbot EnzoIA, desenvolvido com FastAPI e LangGraph.

## Tecnologias

- **FastAPI**: Framework web moderno para Python
- **LangGraph**: Framework para construção de agentes de IA
- **LangChain Groq**: Integração com modelos Llama via Groq
- **Uvicorn**: Servidor ASGI

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
GROQ_API_KEY=sua_chave_groq_aqui
```

## Executar Localmente

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python run.py
# ou
python -m uvicorn api:app --host 0.0.0.0 --port 8001 --reload
```

O servidor estará disponível em `http://localhost:8001`

## Endpoints

- `POST /chat` - Enviar mensagem para o chatbot
- `GET /health` - Verificar saúde da API

## Deploy

Consulte `../DEPLOY.md` para instruções detalhadas de deploy em produção.

### Opções de Deploy

1. **Railway** (Recomendado) - Melhor para FastAPI
2. **Render** - Alternativa gratuita
3. **Vercel** - Serverless (pode ter limitações)

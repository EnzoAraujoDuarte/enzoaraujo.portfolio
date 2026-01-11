from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.agent import create_agent
from langchain_core.messages import HumanMessage, AIMessage
from collections import defaultdict
from datetime import datetime, timedelta
import threading

app = FastAPI()

# Rate limiting configuration
RATE_LIMIT_REQUESTS = 10  # Max requests per window
RATE_LIMIT_WINDOW = 60  # Window in seconds (1 minute)
rate_limit_store = defaultdict(list)
rate_limit_lock = threading.Lock()


def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(client_ip: str) -> bool:
    """Check if client has exceeded rate limit. Returns True if allowed."""
    now = datetime.now()
    window_start = now - timedelta(seconds=RATE_LIMIT_WINDOW)

    with rate_limit_lock:
        # Clean old requests outside the window
        rate_limit_store[client_ip] = [
            req_time for req_time in rate_limit_store[client_ip]
            if req_time > window_start
        ]

        # Check if limit exceeded
        if len(rate_limit_store[client_ip]) >= RATE_LIMIT_REQUESTS:
            return False

        # Record this request
        rate_limit_store[client_ip].append(now)
        return True

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8001",
        "https://enzoaraujo.site/",
        "https://*.vercel.app",
        "https://*.railway.app",
        "https://*.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agents_cache = {}


class ChatRequest(BaseModel):
    message: str
    thread_id: str = "default"
    language: str = "pt-BR"
    conversation_history: list = []


class ChatResponse(BaseModel):
    response: str
    thread_id: str


def convert_history(history: list) -> list:
    messages = []
    for msg in history:
        content = msg.get("text", "")
        if msg.get("type") == "user":
            messages.append(HumanMessage(content=content))
        elif msg.get("type") == "bot":
            messages.append(AIMessage(content=content))
    return messages


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, req: Request):
    # Rate limiting check
    client_ip = get_client_ip(req)
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Muitas requisições. Por favor, aguarde um momento antes de enviar outra mensagem."
        )

    try:
        cache_key = f"{request.thread_id}_{request.language}"

        if cache_key not in agents_cache:
            agents_cache[cache_key] = create_agent(request.language)

        agent = agents_cache[cache_key]

        messages = convert_history(request.conversation_history)
        messages.append(HumanMessage(content=request.message.strip() or "Olá"))

        result = agent.invoke(
            {"messages": messages},
            config={"configurable": {"thread_id": request.thread_id}}
        )

        response_content = result["messages"][-1].content

        return ChatResponse(response=response_content, thread_id=request.thread_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}

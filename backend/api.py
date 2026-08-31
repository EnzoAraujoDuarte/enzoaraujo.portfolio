import json
import os
import uuid
from typing import Any, Dict, List
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from langchain_core.messages import HumanMessage, AIMessage, AIMessageChunk, BaseMessage
from src.agent import create_agent
from src import limits

app = FastAPI(title="EnzoIA API", version="1.0.0")

threads_store: Dict[str, Dict[str, Any]] = {}
agents_cache: Dict[str, Any] = {}

allow_origins_env = os.getenv("ALLOW_ORIGINS", "*")
if allow_origins_env == "*":
    allow_origins = ["*"]
else:
    allow_origins = [origin.strip() for origin in allow_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageInput(BaseModel):
    role: str
    content: str


class RunInput(BaseModel):
    messages: List[MessageInput]


class RunConfig(BaseModel):
    configurable: Dict[str, Any] = {}


class RunRequest(BaseModel):
    input: RunInput
    config: RunConfig = None


class ThreadObj(BaseModel):
    thread_id: str
    created_at: str = None
    values: Dict[str, Any] = None


def lc_messages_to_list(messages: List[BaseMessage]) -> List[Dict[str, Any]]:
    result = []
    for msg in messages:
        msg_type = "human" if isinstance(msg, HumanMessage) else "ai"
        result.append({
            "id": getattr(msg, "id", None) or f"msg-{len(result)}",
            "type": msg_type,
            "content": msg.content,
        })
    return result


def chunk_to_text(chunk: Any) -> str:
    if isinstance(chunk, AIMessageChunk):
        content = chunk.content
        if isinstance(content, list):
            parts = []
            for item in content:
                if isinstance(item, dict):
                    parts.append(str(item.get("text", "")))
                else:
                    parts.append(str(item))
            return "".join(parts)
        if isinstance(content, str):
            return content
    if hasattr(chunk, "content"):
        value = getattr(chunk, "content")
        if isinstance(value, str):
            return value
    return str(chunk)


def sse_payload(data: Dict[str, Any]) -> str:
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"


def get_or_create_agent(thread_id: str, language: str):
    cache_key = f"{thread_id}_{language}"
    if cache_key not in agents_cache:
        agents_cache[cache_key] = create_agent(language)
    return agents_cache[cache_key]


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/threads")
async def create_thread(request: Request) -> Dict[str, Any]:
    refused = limits.check_new_thread(limits.client_ip(request))
    if refused:
        raise HTTPException(status_code=429, detail=refused)

    thread_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat() + "Z"
    threads_store[thread_id] = {
        "thread_id": thread_id,
        "created_at": created_at,
        "messages": []
    }
    return {"thread": ThreadObj(thread_id=thread_id, created_at=created_at, values={"messages": []}).model_dump()}


@app.get("/threads")
async def list_threads() -> Dict[str, Any]:
    threads = []
    for tid, data in sorted(threads_store.items(), key=lambda x: x[1].get("created_at", ""), reverse=True):
        threads.append({
            "thread_id": tid,
            "created_at": data.get("created_at"),
            "values": {"messages": data.get("messages", [])}
        })
    return {"threads": threads[:50]}


@app.get("/threads/{thread_id}")
async def get_thread(thread_id: str) -> Dict[str, Any]:
    if thread_id not in threads_store:
        raise HTTPException(status_code=404, detail="Thread not found")
    data = threads_store[thread_id]
    return {"thread": {
        "thread_id": thread_id,
        "created_at": data.get("created_at"),
        "values": {"messages": data.get("messages", [])}
    }}


@app.post("/threads/{thread_id}/runs/stream")
async def run_and_stream(thread_id: str, body: RunRequest, request: Request):
    refused = limits.check(limits.client_ip(request))
    if refused:
        raise HTTPException(status_code=429, detail=refused)

    if thread_id not in threads_store:
        threads_store[thread_id] = {
            "thread_id": thread_id,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "messages": []
        }

    language = "pt-BR"
    user_content = ""

    for msg in body.input.messages:
        if msg.role == "system" and "settings" in msg.content:
            try:
                settings = json.loads(msg.content)
                if settings.get("language"):
                    language = settings["language"]
            except:
                pass
        elif msg.role == "user":
            user_content = limits.clean_message(msg.content)

    if body.config and body.config.configurable:
        if body.config.configurable.get("language"):
            language = body.config.configurable["language"]

    agent = get_or_create_agent(thread_id, language)

    stored_messages = limits.trim_history(threads_store[thread_id].get("messages", []))
    history_msgs = []
    for m in stored_messages:
        if m.get("type") == "human":
            history_msgs.append(HumanMessage(content=m.get("content", "")))
        elif m.get("type") == "ai":
            history_msgs.append(AIMessage(content=m.get("content", "")))

    if user_content:
        history_msgs.append(HumanMessage(content=user_content))

    async def event_iterator():
        try:
            full_response = ""

            async for event in agent.astream_events(
                {"messages": history_msgs},
                config={"configurable": {"thread_id": thread_id}},
                version="v2"
            ):
                event_name = event.get("event")
                if event_name == "on_chat_model_stream":
                    chunk = event.get("data", {}).get("chunk")
                    text = chunk_to_text(chunk) if chunk else ""
                    if text:
                        full_response += text
                        yield sse_payload({"event": "chunk", "thread_id": thread_id, "text": text})

            user_msg = {"id": f"msg-{len(stored_messages)}", "type": "human", "content": user_content}
            ai_msg = {"id": f"msg-{len(stored_messages)+1}", "type": "ai", "content": full_response}

            threads_store[thread_id]["messages"].append(user_msg)
            threads_store[thread_id]["messages"].append(ai_msg)

            all_messages = threads_store[thread_id]["messages"]
            yield sse_payload({
                "event": "final",
                "thread_id": thread_id,
                "messages": all_messages
            })
            yield sse_payload({"event": "done", "thread_id": thread_id})

        except Exception as exc:
            yield sse_payload({"event": "error", "detail": str(exc), "thread_id": thread_id})

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
    }
    return StreamingResponse(event_iterator(), media_type="text/event-stream", headers=headers)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)

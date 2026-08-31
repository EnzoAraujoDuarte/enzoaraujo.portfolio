"""
What stands between a public chat widget and a free-tier token budget.

Groq's free tier gives roughly 8k tokens a minute and 200k a day, counted per
organisation rather than per visitor — so one script hammering the widget takes
the chat down for everyone. These are the guards, cheapest first: length, then
per-visitor rate, then a shared daily ceiling.

All state is in memory. The app runs as a single machine that sleeps between
conversations, so a restart resetting the counters is the expected behaviour,
not a gap.
"""

import threading
from collections import defaultdict, deque
from datetime import date, datetime, timedelta

# A question about someone's career does not need more than this. The cap
# matters because the message is resent with every following turn.
MAX_MESSAGE_CHARS = 600

# How much history travels to the model. Older turns are dropped: without this
# a long conversation grows its own token cost without bound.
MAX_HISTORY_MESSAGES = 8

PER_MINUTE = 6
PER_DAY = 40

# Generous, because a page refresh opens a new thread: a visitor who reloads a
# few times must not lock themselves out. The real ceiling is the shared budget
# below, which also covers anyone calling the Fly URL directly with a forged
# x-forwarded-for.
MAX_THREADS_PER_IP = 20

# Rough ceiling on the shared daily budget, leaving room for the site to keep
# working if one visitor gets carried away. Counted in messages, since exact
# token accounting would cost more than it saves.
DAILY_MESSAGE_BUDGET = 400

_lock = threading.Lock()
_recent = defaultdict(deque)          # ip -> request timestamps
_daily = defaultdict(int)             # ip -> messages today
_threads_by_ip = defaultdict(int)     # ip -> threads created today
_day = date.today()
_spent_today = 0


def _roll_day_locked() -> None:
    global _day, _spent_today
    today = date.today()
    if today != _day:
        _day = today
        _spent_today = 0
        _daily.clear()
        _threads_by_ip.clear()


def client_ip(request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check(ip: str) -> str | None:
    """None when the request may proceed, otherwise the reason to refuse."""
    global _spent_today
    now = datetime.now()

    with _lock:
        _roll_day_locked()

        if _spent_today >= DAILY_MESSAGE_BUDGET:
            return "O chat atingiu o limite de uso de hoje. Tente novamente amanhã."

        window = _recent[ip]
        cutoff = now - timedelta(seconds=60)
        while window and window[0] < cutoff:
            window.popleft()

        if len(window) >= PER_MINUTE:
            return "Muitas mensagens seguidas. Aguarde um momento."

        if _daily[ip] >= PER_DAY:
            return "Você atingiu o limite de mensagens de hoje."

        window.append(now)
        _daily[ip] += 1
        _spent_today += 1

        # Visitors who never came back would otherwise accumulate forever.
        if len(_recent) > 5000:
            for stale in [k for k, v in _recent.items() if not v]:
                del _recent[stale]

    return None


def check_new_thread(ip: str) -> str | None:
    """Thread creation is unauthenticated and free, which makes it the cheapest
    way to grow the server's memory from outside."""
    with _lock:
        _roll_day_locked()
        if _threads_by_ip[ip] >= MAX_THREADS_PER_IP:
            return "Limite de conversas atingido. Continue na conversa atual."
        _threads_by_ip[ip] += 1
    return None


def clean_message(content: str) -> str:
    return (content or "").strip()[:MAX_MESSAGE_CHARS]


def trim_history(messages: list) -> list:
    return messages[-MAX_HISTORY_MESSAGES:]


def usage() -> dict:
    with _lock:
        return {"date": str(_day), "messages": _spent_today, "budget": DAILY_MESSAGE_BUDGET}

# The Fly app serves the EnzoIA backend. It lives at the repository root
# because the deploy is triggered from a push to the repo, and Fly scans the
# root for a Dockerfile — a Dockerfile inside backend/ is never found.
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080

WORKDIR /app

# Dependencies first, so a change to the agent code does not reinstall
# langchain on every deploy.
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# api.py imports `src.agent`, so the package has to sit next to it in WORKDIR.
EXPOSE 8080
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-8080}"]

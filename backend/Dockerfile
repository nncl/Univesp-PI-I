# --- base layer ---
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        default-libmysqlclient-dev \
        pkg-config \
        netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .
RUN chmod +x /app/entrypoint.sh

# --- dev ---
FROM base AS dev
ENV DJANGO_DEBUG=true
EXPOSE 8000
CMD ["sh", "/app/entrypoint.sh"]

# --- prod ---
FROM base AS prod
ENV DJANGO_DEBUG=false
EXPOSE 8000
CMD ["sh", "/app/entrypoint.sh"]

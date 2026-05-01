# Yara Oliveira — Tattoo Portfolio Platform

Portfólio público + agenda de orçamento + área administrativa para a tatuadora **Yara Oliveira** (Campinas/SP).

Stack: **Django 5 + DRF + MySQL 8** (backend) e **Next.js 14 + TypeScript + Tailwind** (frontend), orquestrados com **Docker Compose**.

## Estrutura

```
.
├── backend/        # API Django REST (JWT)
├── frontend/       # Aplicação Next.js (App Router)
├── infra/          # docker-compose.yml, .env.example
└── README.md
```

## Subindo o projeto (desenvolvimento)

```bash
cd infra
cp .env.example .env
docker compose up --build
```

Serviços:

| Serviço  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:3000     |
| API      | http://localhost:8000/api |
| Django Admin | http://localhost:8000/admin |
| MySQL    | localhost:3306            |

No primeiro boot, o backend automaticamente:
- Aplica as migrações (`migrate`).
- Cria/atualiza o superusuário definido em `DJANGO_ADMIN_USERNAME` / `DJANGO_ADMIN_PASSWORD`.
- Carrega itens de exemplo no portfólio se a tabela estiver vazia (`seed_portfolio`).
- Em modo `DJANGO_DEBUG=true`, também roda `makemigrations` para refletir mudanças nos models.

> **Para o fluxo de desenvolvimento** (gerar migrações ao alterar models, fazer seed manual, subir em produção, troubleshooting), veja o **[Guia de Desenvolvimento](./DEVELOPMENT.md)**.

## Endpoints

### Públicos
- `GET  /api/portfolio/` — lista paginada
- `GET  /api/portfolio/{id}/` — detalhe
- `POST /api/contact/` — solicita orçamento

### Auth
- `POST /api/auth/login/` — `{ username, password }` → `{ access, refresh }`
- `POST /api/auth/refresh/` — `{ refresh }` → `{ access, refresh }`
- `POST /api/auth/logout/` — `{ refresh }` → 205 (blacklist)
- `GET  /api/auth/me/` — perfil do admin autenticado

### Admin (JWT obrigatório)
- `GET/POST              /api/admin/portfolio/`
- `GET/PUT/PATCH/DELETE  /api/admin/portfolio/{id}/`
- `GET                   /api/admin/contacts/`
- `GET                   /api/admin/contacts/{id}/`

## Páginas (frontend)

Públicas: `/`, `/portfolio`, `/portfolio/[id]`, `/agenda-orcamento`, `/quem-sou-eu`.

Admin (protegidas, redireciona para `/admin/login` sem token):
`/admin`, `/admin/portfolio`, `/admin/portfolio/new`, `/admin/portfolio/[id]/edit`, `/admin/contacts`, `/admin/contacts/[id]`.

## Decisões do MVP

- Imagens são URLs (sem upload).
- Calendário bloqueia datas passadas no cliente; servidor rejeita `suggested_date` no passado considerando `America/Sao_Paulo`.
- Sem contas de cliente — contato apenas via formulário.
- "Quem sou eu" é estático.
- Idioma: pt-BR.

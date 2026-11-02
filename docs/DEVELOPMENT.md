# Guia de Desenvolvimento

Comandos e fluxos do dia a dia. Para a visão geral do projeto, veja o [README](../README.md).

## Sumário

- [Subir / parar o ambiente](#subir--parar-o-ambiente)
- [Modificando os models (migrações)](#modificando-os-models-migrações)
- [Dados de exemplo (seed)](#dados-de-exemplo-seed)
- [Logs e shell](#logs-e-shell)
- [Testes de acessibilidade (Cypress + axe)](#testes-de-acessibilidade-cypress--axe)
- [Produção](#produção)
- [Variáveis de ambiente](#variáveis-de-ambiente)

## Subir / parar o ambiente

A partir de `infra/`:

```bash
cp .env.example .env       # primeira vez apenas
docker compose up --build  # sobe db + backend + frontend
docker compose down        # para tudo (mantém o volume do MySQL)
docker compose down -v     # para tudo e apaga o banco
```

Serviços expostos no host:

| Serviço      | URL                       |
| ------------ | ------------------------- |
| Frontend     | http://localhost:3000     |
| API          | http://localhost:8000/api |
| Django admin | http://localhost:8000/admin |
| MySQL        | localhost:3306            |

## Modificando os models (migrações)

O `entrypoint.sh` do backend roda **`makemigrations --noinput`** automaticamente em modo dev (`DJANGO_DEBUG=true`) e **`migrate --noinput`** em qualquer ambiente. Ou seja:

- **Em desenvolvimento**, basta editar os models e reiniciar o container do backend:
  ```bash
  docker compose restart backend
  ```
  Os arquivos de migração gerados aparecem no host (montado em `backend/`) e devem ser **commitados no git**.

- **Em produção**, `makemigrations` **não roda** — as migrações precisam estar versionadas no repositório. Antes do deploy, sempre rode em dev primeiro para gerar e revisar os arquivos.

Comandos manuais úteis (executados dentro do container):

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py makemigrations portfolio --name add_tags
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py showmigrations
docker compose exec backend python manage.py sqlmigrate portfolio 0002
```

Para reverter uma migração específica:

```bash
docker compose exec backend python manage.py migrate portfolio 0001
```

## Dados de exemplo (seed)

A primeira subida do backend executa `seed_portfolio`, que carrega os itens do fixture `backend/portfolio/fixtures/sample_portfolio.json` **somente se a tabela estiver vazia** (idempotente — re-executar não cria duplicatas).

Para forçar um reseed do zero:

```bash
docker compose exec backend python manage.py flush --no-input  # ⚠️ apaga TODOS os dados
docker compose exec backend python manage.py seed_portfolio
```

Para apenas adicionar/atualizar itens manualmente, edite o JSON do fixture e rode:

```bash
docker compose exec backend python manage.py loaddata sample_portfolio
```

> Itens já existentes com o mesmo `pk` no fixture serão **sobrescritos** por `loaddata`.

## Logs e shell

```bash
docker compose logs -f backend          # logs do Django
docker compose logs -f frontend         # logs do Next.js
docker compose exec backend bash        # shell no container
docker compose exec backend python manage.py shell   # shell do Django
docker compose exec db mysql -u root -p tattoo       # cliente MySQL
```

## Testes de acessibilidade (Cypress + axe)

O frontend tem uma suíte em `frontend/cypress/e2e/a11y/` que valida o site contra o **WCAG 2.1 nível AA** usando [axe-core](https://github.com/dequelabs/axe-core) via `cypress-axe`:

| Spec                 | O que cobre |
| -------------------- | ----------- |
| `public.cy.ts`       | Todas as páginas públicas (incl. detalhe do portfólio e 404), em desktop e mobile. |
| `interaction.cy.ts`  | Link "Pular para o conteúdo", menu mobile (`aria-expanded`, Esc), rótulos dos campos, erros anunciados (`role="alert"`) e horários com `aria-pressed`. |
| `admin.cy.ts`        | Login (inclusive com erro) e todas as telas do admin, autenticado com o superusuário do seed. |

Os testes precisam do **backend rodando com seed**, porque as páginas públicas buscam dados no servidor (RSC) — não dá para mockar com `cy.intercept`.

### Rodando localmente

```bash
# 1. backend + banco (a partir de infra/)
docker compose up -d db backend

# 2. build de produção do frontend + testes (a partir de frontend/)
npm install
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api npm run build
INTERNAL_API_BASE_URL=http://localhost:8000/api npm run test:a11y:ci
```

`test:a11y:ci` sobe o `next start`, espera a porta 3000 e roda o `cypress run`. Se o frontend já estiver no ar (ex.: `docker compose up` completo), rode só `npm run test:a11y`, ou `npm run cy:open` para a interface interativa.

As credenciais do admin vêm de `cypress.config.ts` (padrão do `.env.example`: `yara` / `changeme`) e podem ser sobrescritas com `CYPRESS_adminUsername`, `CYPRESS_adminPassword`, `CYPRESS_apiUrl` e `CYPRESS_BASE_URL`.

Quando uma regra falha, o terminal mostra uma tabela com o id da regra do axe, o impacto e os seletores afetados — o link para a documentação de cada regra (Deque University) aparece no log do Cypress.

### No CI

O workflow `.github/workflows/a11y.yml` roda a mesma suíte (MySQL + gunicorn + `next build`/`next start`):

- em todo **pull request para `main`**;
- em todo **push para `main`**, chamado pelo `deploy.yml` — os jobs de deploy dependem dele (`needs: [test, a11y]`), então **uma violação de acessibilidade bloqueia o deploy**.

Em caso de falha, os screenshots do Cypress ficam disponíveis como artefato `cypress-screenshots` na execução do workflow.

### Boas práticas já adotadas

- Todo `<label>` tem `htmlFor` apontando para o `id` do campo; campos obrigatórios usam `aria-required`.
- Mensagens de erro usam `role="alert"`; estados de carregamento, `role="status"`.
- Todo `<main>` tem `id="conteudo" tabIndex={-1}` (alvo do link "Pular para o conteúdo" no layout raiz).
- Foco visível global via `:focus-visible` em `globals.css` — não use `outline-none` em controles.
- Texto secundário no mínimo `text-ink/60` (contraste ≥ 4.5:1 sobre `paper`/`paper-warm`).

## Produção

A configuração de produção sobrescreve a de desenvolvimento via um segundo arquivo de compose (`docker-compose.prod.yml`):

- Backend roda com **gunicorn** (3 workers) e executa `collectstatic`.
- Frontend é buildado em modo **standalone** e servido pelo `node server.js`.
- Volumes de código-fonte montados em dev são desativados (a imagem é imutável).
- `DJANGO_DEBUG=false` é forçado.

### Comando

```bash
cd infra
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Para parar:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Checklist antes de subir em produção

- [ ] `DJANGO_SECRET_KEY` é uma string aleatória de 50+ caracteres (não use o valor de exemplo).
- [ ] `DJANGO_DEBUG=false`.
- [ ] `DJANGO_ALLOWED_HOSTS` lista os domínios reais (ex.: `yara.com.br,www.yara.com.br`).
- [ ] `CORS_ALLOWED_ORIGINS` aponta para o domínio do frontend público.
- [ ] `NEXT_PUBLIC_API_BASE_URL` é a URL pública da API (com HTTPS).
- [ ] Senhas do MySQL e do admin (`DJANGO_ADMIN_PASSWORD`) foram trocadas.
- [ ] Todas as migrações foram geradas em dev e estão **commitadas** no git.

## Variáveis de ambiente

Todas vivem em `infra/.env` (não commitado). Veja `infra/.env.example` para a lista completa.

Resumo:

| Variável                     | Onde é consumida                | Para que serve                                      |
| ---------------------------- | ------------------------------- | --------------------------------------------------- |
| `DJANGO_SECRET_KEY`          | backend                         | Criptografia de sessões e tokens                    |
| `DJANGO_DEBUG`               | backend                         | Liga modo dev (auto-migrations, runserver, traceback) |
| `DJANGO_ALLOWED_HOSTS`       | backend                         | Hosts aceitos pelo Django                           |
| `DATABASE_*`                 | backend                         | Conexão com o MySQL                                 |
| `CORS_ALLOWED_ORIGINS`       | backend                         | Origens permitidas pelo CORS                        |
| `MYSQL_*`                    | container do banco              | Inicialização do MySQL                              |
| `DJANGO_ADMIN_*`             | comando `create_admin`          | Cria/atualiza o superusuário no boot                |
| `NEXT_PUBLIC_API_BASE_URL`   | frontend (browser)              | URL pública da API                                  |
| `INTERNAL_API_BASE_URL`      | frontend (server components)    | URL da API dentro da rede docker                    |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Two Audiences

This repo is itself a memory system **for Claude (the end user)**. Don't confuse the two roles:

- **`CLAUDE_PROMPT.md`** — runtime instructions for the Claude *user* of the deployed MCP server (calls `breath`/`hold`/`grow`/etc. as tools). Do NOT follow that file as if it applied to development work.
- **This file (`CLAUDE.md`)** — instructions for Claude Code instances *developing* this codebase.

If you find yourself wondering whether to call `breath()` before responding — you don't. That's the runtime contract for the deployed server's users.

## Common Commands

```bash
# Install
pip install -r requirements.txt
pip install pytest pytest-asyncio   # test deps

# Run server locally (stdio for Claude Desktop)
python server.py

# Run server in HTTP mode (for Claude.ai / remote)
OMBRE_TRANSPORT=streamable-http python server.py    # listens on :8000

# Run the pytest suite (matches CI exactly — no API key required)
python -m pytest tests/test_scoring.py tests/test_feel_flow.py -v --asyncio-mode=auto

# A single test
python -m pytest tests/test_scoring.py::test_name -v --asyncio-mode=auto

# LLM-quality tests (needs OMBRE_API_KEY, hits real API)
OMBRE_API_KEY=... python -m pytest tests/test_llm_quality.py -v --asyncio-mode=auto

# Legacy smoke / end-to-end scripts (root level, not under tests/)
python test_smoke.py        # hits real bucket dir, exercises full pipeline
python test_tools.py        # calls the @mcp.tool() functions directly; deletes all buckets at end

# Docker
docker compose up -d                                  # local dev (uses ./buckets)
docker compose -f docker-compose.user.yml up -d       # prebuilt image variant

# Backfill embeddings for existing buckets after enabling embedding
OMBRE_API_KEY=... python backfill_embeddings.py --batch-size 20
```

**CI:** `.github/workflows/tests.yml` runs `test_scoring.py` + `test_feel_flow.py` on every push/PR to `main`. `test_llm_quality.py` only runs if the `OMBRE_API_KEY` secret is set. Docs-only commits (`*.md`, `backup_*/**`, `.gitignore`) skip CI.

**Warning:** `test_smoke.py` and `test_tools.py` operate on the *real* `buckets_dir` from `config.yaml` — `test_tools.py` deletes every bucket at the end. The pytest tests under `tests/` use `tmp_path` via `conftest.py` and are safe.

## Architecture

Single-process FastMCP server. `server.py` is the entry point and owns module-level singletons of every subsystem; everything else is plain Python modules with no framework.

```
server.py  ──┬── bucket_manager.py   CRUD + multi-channel search + wikilink injection
             ├── dehydrator.py       LLM compression + auto-tagging + merge (OpenAI-compatible)
             ├── decay_engine.py     Forgetting curve, archive sweep, auto-resolve
             ├── embedding_engine.py Gemini embeddings → embeddings.db (SQLite, 3072-dim)
             ├── import_memory.py    Bulk conversation import engine
             └── utils.py            config / logging / safe paths / id / token estimate
```

**Storage model.** Each memory is a Markdown file with YAML frontmatter, laid out under `buckets/{permanent,dynamic/<domain>,archive,feel}/`. The filesystem *is* the database — there is no SQL store for memories. Embeddings are the one exception: they live in `embeddings.db` next to the buckets dir because 3072-dim float vectors don't belong in YAML. Losing the DB is recoverable via `backfill_embeddings.py`. This design exists so users can open the vault in Obsidian and edit memories directly; preserve that property when changing serialization.

**Tools and HTTP surface.** `server.py` registers 6 MCP tools — `breath`, `hold`, `grow`, `trace`, `pulse`, `dream` — and 17 REST endpoints under `/api/*` plus `/health`, `/breath-hook`, `/dream-hook`, `/dashboard`. The dashboard HTML is the single-file `dashboard.html`, served raw. Tool semantics and parameters are spec'd in `INTERNALS.md` §0 — read that before changing any tool signature.

**Bucket types matter.** Four bucket types (`dynamic`, `permanent`, `feel`, `archived`) have different lifecycle rules:
- `feel` buckets (model self-reflection) live in their own dir, don't participate in decay/merge/surfacing, and are queried only via `breath(domain="feel")`.
- `pinned` / `permanent` / `protected` buckets get a hardcoded score of `999.0` in `decay_engine.calculate_score` and never archive or merge.
- `resolved=True` multiplies score by `0.05`; `resolved + digested` by `0.02`. These aren't deleted — they sink and stay searchable by keyword.

Don't add a new bucket type without auditing `decay_engine.calculate_score`, `bucket_manager.search_multi`, the surfacing logic in `server.py:breath`, and the merge gate in `dehydrator`.

**Search is dual-channel.** `breath(query=...)` runs rapidfuzz keyword match *and* embedding cosine similarity in parallel, then dedupes and applies a 4-dim score (topic ×4 + emotion ×2 + time ×2.5 + importance ×1). Embedding failures degrade silently to keyword-only. When changing scoring weights or thresholds, update both `config.example.yaml` and the hardcoded fallbacks in `bucket_manager.py` / `server.py` — `INTERNALS.md` §3 enumerates every magic number and where it lives.

**Degradation is a feature, not a bug.** Every LLM call (`dehydrator.analyze`/`dehydrate`/`merge`/`digest`, `embedding_engine.embed`) has a local fallback. When the API key is empty or a call fails, the system MUST stay functional with degraded quality. Don't introduce hard dependencies on the LLM — preserve the `api_available` checks and `try/except → local fallback` pattern.

**Config & env vars.** Precedence is `env > config.yaml > built-in defaults in utils.py`. The four runtime env vars that override config: `OMBRE_API_KEY`, `OMBRE_BASE_URL`, `OMBRE_TRANSPORT`, `OMBRE_BUCKETS_DIR`. Never persist `api_key` back to `config.yaml` — the `/api/config` POST endpoint must strip it. Full key table: `INTERNALS.md` §4.

**MCP stdio mode constraint.** In stdio transport, stdout is the protocol channel — all logging MUST go to stderr. `utils.setup_logging` enforces this; don't add `print()` to library code.

## Reference Documents

- **`INTERNALS.md`** — authoritative spec: every tool param, every hardcoded constant, every config key, design rationales. Check here before changing constants or tool behavior.
- **`README.md`** — user-facing deployment guide (Docker Hub / source / Render / Zeabur / Cloudflare Tunnel) and the decay-formula math. Update both this section and the README if deployment changes.
- **`CLAUDE_PROMPT.md`** — the prompt shipped to end-user Claudes. If you change tool names, parameters, or the conversation-start sequence (`breath → dream → breath(domain="feel")`), this file must be updated in lockstep.
- **`backup_20260405_2124/`** — frozen pre-refactor snapshot, kept for reference. Don't edit; it's excluded from CI via `paths-ignore`.

## Conventions

- **Python 3.12** is the CI target (`tests.yml`); the Dockerfile uses `python:3.12-slim`. `README` claims 3.11+ — keep 3.11 working.
- Code and comments mix English and Chinese; module headers are bilingual. Match the style of the file you're editing.
- `safe_path()` from `utils.py` MUST wrap any user-controlled filename joined to `buckets_dir`. There's a path-traversal test in the suite — don't bypass it.
- New buckets get a 12-char hex id (`utils.generate_bucket_id`); names are sanitized to ≤80 chars and stripped of non-`\w\s一-鿿-` characters.
- The Docker image bakes `OMBRE_TRANSPORT=streamable-http` and `OMBRE_BUCKETS_DIR=/app/buckets` as defaults — don't override them in `docker-compose.yml` without reason.
- `.claude/settings.json` installs a `SessionStart` hook (`hooks/session_breath.py`) that pings the running server's `/breath-hook` and `/dream-hook`. The hook is a no-op when the server isn't reachable (silent fail by design); set `OMBRE_HOOK_SKIP=1` to disable.

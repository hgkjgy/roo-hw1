# AI-driven Internal Task Collaboration and Document Processing Platform — DESIGN

## Scope & Constraints (v1)
- Upload: PDF only; OCR out of scope.
- AI: replaceable adapter with mock provider by default; no hard dependency on external AI.
- Notifications: email/webhook stubs; delivery optional in v1.
- Multi-tenant: out of scope.
- API: REST only (/api/v1/**).
- Security: mask sensitive fields (email, phone, token, password, secret values) in audit logs and logs.
- Background: BullMQ on Redis; jobs idempotent with retry/backoff + DLQ.
- Deployment: Docker Compose baseline (PostgreSQL, Redis, backend, frontend, worker).

## Architecture Overview
- Frontend: Next.js (app router), role-aware UI, uses REST via typed client.
- Backend API: NestJS modular monolith (modules: auth, rbac, users, tasks, documents, ai, notifications, scheduler, audit, health).
- Workers: NestJS worker process for BullMQ queues (document-extract, ai-summarize, ai-tag, notification-dispatch).
- Database: PostgreSQL; relational with auditability; migration tool TBD.
- Cache/Queue: Redis for BullMQ and lightweight caching.
- Storage: local volume or object storage placeholder for PDF; path tracked in documents table.

## Module Boundaries
- Auth/RBAC: JWT + refresh; guards; role/permission checks.
- User/Role: CRUD, seed, role binding.
- Task Management: task lifecycle, assignment, attachments (documents), status transitions, task events for audit.
- Document Processing: upload PDF → store → enqueue extract job → enqueue summarize/tag jobs → persist results.
- AI Pipeline: adapter interface + mock provider; pipeline orchestrated by BullMQ; results persisted to ai_results and documents.status.
- Notification: event-driven; email/webhook stubs; preference placeholder.
- Scheduler/Background: cron for stale tasks reminders, retries, cleanup; runs in worker process.
- Audit Log: interceptor for API + selected domain events; masking sensitive fields; queryable endpoint.
- Health/Observability: health checks, structured logging; minimal metrics placeholder.

## Data Model (tables)
- users
- roles
- permissions
- user_roles
- role_permissions
- tasks (status, assignee_id, due_at, priority, title, description)
- task_events (task_id, actor_id, action, before, after, created_at)
- documents (task_id, storage_path, mime, status, uploaded_by, uploaded_at)
- ai_results (document_id, summary, tags JSONB, model, score, started_at, completed_at)
- notifications (user_id, type, payload, status, sent_at)
- notification_templates (code, channel, template body)
- audit_logs (actor, action, resource, resource_id, before, after, masked_fields, trace_id, created_at)

## Queues (BullMQ)
- document-extract: PDF text extraction (no OCR).
- ai-summarize: generate summary via adapter/mock.
- ai-tag: generate tags via adapter/mock.
- notification-dispatch: send email/webhook stubs.
- DLQ per pipeline with retry/backoff policy (exponential).

## API Surface (REST /api/v1)
- /auth: POST /login, POST /refresh, GET /me
- /users: CRUD; role binding
- /roles: CRUD; permissions management
- /tasks: CRUD; status transition; assign; attach documents
- /documents: POST /upload (PDF), GET /:id/status, GET /:id/ai-results
- /notifications: GET list, POST mark-read
- /admin/audit: GET query audit logs (with masking enforced)
- /health: liveness/readiness

## Frontend (Next.js) Pages
- /login, /tasks, /tasks/[id], /documents/[id], /admin/audit, /settings/notifications
- Components: TaskList/Board, TaskDetail, DocumentViewer, NotificationCenter, AuditTable
- Auth handling: HTTP-only cookie preferred; role-based navigation.

## Security & Compliance
- Env validation; secrets via env (no commit); CORS allowlist; helmet; rate limiting.
- Input validation via DTO + class-validator; output typing.
- Audit masking for email/phone/token/password/secret values; deterministic mask function.
- Logging: structured; avoid sensitive fields; correlation id/trace id.

## AI Adapter Strategy
- Define AIAdapter interface with methods for summarize(tags optional) and tag generation.
- Provide MockAIAdapter default; external provider adapter pluggable via config.
- Pipeline resilient to adapter failure; results stored in ai_results with model/source metadata.

## Notification Strategy
- Channels: email, webhook (stubs).
- Event → notification-dispatch job; templating via notification_templates.
- Delivery status tracked; failures retried; DLQ on persistent failure.

## Background & Scheduler
- Cron jobs for stale task reminders, retry of failed jobs, cleanup of temp files.
- Runs in worker container; shares codebase with API but separate process.

## Deployment (Docker Compose)
- Services: backend-api, backend-worker, frontend, postgres, redis.
- Volumes for postgres data and uploaded files.
- Env files: .env.example per service.

## Testing Strategy
- Unit: services/guards/pipes.
- Contract: REST (supertest) against OpenAPI spec.
- E2E happy path: login → create task → upload PDF → AI pipeline → notification stub.
- Workers: job processors tested with mock adapters and in-memory Redis (or test containers).

## Stage Overview (summary)
- Stage 0: scaffold, env, contracts, compose baseline.
- Stage 1: Auth/RBAC/User baseline + audit masking foundation.
- Stage 2: Task core.
- Stage 3: Document + AI pipeline (PDF, mock adapter, no OCR).
- Stage 4: Notification + scheduler (stubs).
- Stage 5: Admin/Audit UI/queries.
- Stage 6: Hardening + tests + CI.

## Mermaid (logical flow)
```mermaid
flowchart LR
  User -->|upload PDF| API
  API -->|enqueue| Q1[document-extract]
  Q1 --> WorkerExtract -->|text| Q2[ai-summarize]
  Q2 --> WorkerSummarize -->|summary/tags| DB[(PostgreSQL)]
  DB --> API --> UI[Frontend]
  API --> QN[notification-dispatch] --> WorkerNotify --> UI
```


# Stage Plan

## Stage 0: Foundation & Contracts
- Outputs:
  - Repository scaffold (frontend/, backend/, infrastructure/, docs/, plans/, shared/)
  - docker-compose.yml baseline (PostgreSQL, Redis, backend-api, backend-worker, frontend)
  - .env.example for services
  - API contract draft (REST /api/v1) in docs/
  - Queue naming and event taxonomy draft

## Stage 1: Auth/RBAC/User Baseline
- Outputs:
  - backend: auth, rbac, users modules (NestJS)
  - JWT + refresh, guards, role/permission model, seed data
  - audit masking foundation (mask email/phone/token/password/secret in logs and audit)
  - frontend: login/logout flow, protected routes scaffold
  - health endpoint

## Stage 2: Task Core
- Outputs:
  - backend: tasks module with CRUD, status transitions, assignment, task_events
  - audit log integration for task actions
  - frontend: task list/detail, status update, assignment UI

## Stage 3: Document + AI Pipeline (PDF, no OCR)
- Outputs:
  - backend: documents module (PDF upload only), storage path tracking
  - BullMQ queues: document-extract, ai-summarize, ai-tag; worker processors
  - AI adapter interface + MockAIAdapter default
  - ai_results persistence; document status updates; retry/DLQ policy
  - frontend: document upload/view, AI summary/tags display

## Stage 4: Notification + Scheduler (stubs)
- Outputs:
  - backend: notifications module; email/webhook stubs; notification-dispatch queue
  - scheduler jobs: stale task reminders, retry of failed jobs, cleanup placeholders
  - frontend: notification center, mark read

## Stage 5: Admin & Audit
- Outputs:
  - backend: audit query endpoint (/api/v1/admin/audit) with masking applied
  - admin dashboard data endpoints
  - frontend: audit log table, basic admin views

## Stage 6: Hardening, Testing, CI
- Outputs:
  - Security baseline: helmet, CORS allowlist, rate limiting, env validation
  - Testing: unit (services/guards), contract (REST), E2E happy path pipeline
  - CI: lint/test/build pipelines; test containers for Postgres/Redis
  - Basic metrics/logging placeholders

## AI & Notification Constraints (v1)
- PDF only; OCR out of scope
- AI via replaceable adapter; default mock
- Notifications: email/webhook stubs; retries + DLQ
- Single-tenant only
- REST only
- Audit masking of sensitive fields


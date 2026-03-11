# PROMPT.md

## Project Scope
本文件記錄我在本專案中使用 Roo Code 進行 orchestration 的 prompt 設計、調整過程與成效分析。

本專案主題為 **AI-driven internal task collaboration platform**。  
本階段以 **Stage 1** 為主，聚焦於以下範圍：

- Backend baseline for `Auth`, `RBAC`, `Users`
- `JWT` / `refresh token` structure
- `audit masking` foundation
- `health check`
- `env validation`
- Frontend `login` scaffold
- Basic protected route scaffold
- `docker-compose` baseline
- `.env.example`
- `PROMPT.md` / `DESIGN.md`

以下功能明確不納入 Stage 1：

- `Task`
- `Document`
- `AI pipeline`
- `Notification`
- `Admin dashboard`
- Any Stage 2+ feature

---

## Prompt Design Principles
我在這次作業中採用以下 prompt 設計原則：

1. **先規劃，後實作**
   - 不讓 Roo Code 一開始就直接產生完整專案
   - 先要求提出架構、模組切分、分階段規劃

2. **明確限制範圍**
   - 每一輪 prompt 都限制只能完成某個 stage 或某些模組
   - 避免 AI 一次做到超出作業要求的內容

3. **要求 orchestration**
   - 要求 Roo Code 先拆子任務、安排順序、分角色
   - 強調這是多步驟、跨模組、需要協作的工程型專案

4. **保留可追蹤性**
   - 要求每個階段完成後回報實際修改檔案
   - 要求提供建議 commit message
   - 方便保留階段性紀錄與 Git 歷史

5. **控制 AI drift**
   - 當 Roo Code開始偏離範圍時，重新下 prompt 把範圍收回 Stage 1
   - 避免它提早做到 Stage 2 之後的功能

---

## Orchestration Role Design
本專案中，我希望 Roo Code 扮演的不只是單一 coder，而是多角色協作系統，包含：

- **Planner**
  - 負責拆解任務、安排階段、定義順序

- **Architect**
  - 負責系統架構、模組邊界、資料流與控制流規劃

- **Coder**
  - 根據規劃建立 scaffold、模組骨架與基礎結構

- **Reviewer**
  - 回報已修改檔案、已完成範圍與尚未完成項目

- **Tool Runner**
  - 執行 CLI、安裝套件、建立 scaffold、進行 build 驗證

---

## Key Prompts and Analysis

### 1. Initial Planning Prompt
#### Prompt
> You are acting as a system architect, project manager, and AI engineering team.  
> I need to build a complex software project for an assignment. The goal is not to generate everything in one step, but to use orchestration-style planning, task decomposition, staged execution, and self-review.  
> Your job now is NOT to write code yet.  
> First, do the following:
> 1. Propose 3 project ideas that are complex enough to reasonably require orchestration mode.
> 2. For each idea, list:
>    - target users
>    - core problem it solves
>    - major modules
>    - backend/API/database/background task needs
>    - why it cannot be completed well in a single prompt
> 3. Recommend the best one for this assignment.
> 4. After that, provide:
>    - system architecture
>    - module breakdown
>    - orchestration roles (planner, coder, reviewer, tool runner, tester)
>    - staged implementation plan
>    - expected repository structure
> Do not write implementation code yet.
> Wait for my approval before starting stage 1.

#### Purpose
這個 prompt 的目的是讓 Roo Code 先進入「規劃模式」，而不是直接開始產生程式碼。

#### Expected Behavior
我預期 Roo Code 先提出多個複雜專案方向，並解釋為什麼需要 orchestration，再進一步提供系統設計與執行計畫。

#### Actual Response
Roo Code 確實先提出可行方向，最後我選擇了 **AI-driven internal task collaboration platform**，並開始形成多模組架構與 staged plan。

#### Adjustment / Reflection
這個 prompt 效果很好，因為它成功避免了 AI 一開始直接「整包生成專案」的情況。  
這一輪 prompt 對整體品質提升最明顯。

---

### 2. Scope Definition Prompt
#### Prompt
> 請用中文和我溝通，但所有程式碼、檔名、資料夾名稱、API 路由、資料表名稱、commit message 一律使用英文。  
> 我想做一個「AI 驅動的內部任務協作與文件處理平台」……  
> 請先不要寫程式碼。  
> 先完成以下工作：
> 1. 判斷這個專案為什麼合理需要 orchestration 模式
> 2. 拆解成多個子任務與多個 agent 角色
> 3. 規劃執行順序與里程碑
> 4. 提出推薦的 repo 結構
> 5. 產出一份可直接放入 DESIGN.md 的系統設計草稿  
> 等我確認後，再開始 stage 1。

#### Purpose
這個 prompt 的目的是：
- 明確指定專案主題
- 要求以中文溝通
- 但保留英文工程命名
- 先產出 `DESIGN.md` 級別的設計內容

#### Expected Behavior
我預期 Roo Code 針對指定主題產出可交作業的架構草稿，而不是只給非常簡略的想法。

#### Actual Response
Roo Code 成功提出模組、分階段執行計畫、資料流方向與 repo 結構，後續成為 `DESIGN.md` 的基礎。

#### Adjustment / Reflection
這個 prompt 很重要，因為它把語言規範和工程命名規範一起固定下來，避免後續輸出混亂。

---

### 3. Stage 1 Constraint Prompt
#### Prompt
> 請開始 Stage 1。  
> 但請嚴格限制範圍，只實作以下內容：
> 1. backend:
>    - Auth module baseline
>    - RBAC baseline
>    - User module baseline
>    - audit masking foundation
>    - health check endpoint
>    - env validation baseline
> 2. frontend:
>    - login page scaffold only
>    - basic auth-related routing scaffold only
> 3. infrastructure:
>    - docker-compose baseline only  
> 請遵守以下規則：
> - 只做 Stage 1，不要提前實作 Task、Document、AI pipeline、Notification、Admin dashboard。
> - 所有檔名、資料夾名稱、模組名稱、API routes、commit messages 使用英文。
> - 先建立最小可運作骨架，不要過度擴張功能。
> - 完成後請先回報：
>   1. 新增或修改的檔案
>   2. Stage 1 完成範圍
>   3. 尚未開始的模組
>   4. 建議的 commit message

#### Purpose
這個 prompt 的目的是把開發範圍鎖死在 Stage 1，防止 Roo Code提早擴張到後續功能。

#### Expected Behavior
我預期 Roo Code 只建立骨架與基礎模組，不做完整業務邏輯。

#### Actual Response
Roo Code 大致遵守了 Stage 1 範圍，先完成 backend scaffold，再逐步補 frontend login、infrastructure、`PROMPT.md`。

#### Adjustment / Reflection
這一類限制型 prompt 非常重要。若沒有這段，Roo Code 有明顯傾向往更完整功能擴張。

---

### 4. Correction Prompt for Drift Control
#### Prompt
> 可以繼續，但請嚴格限制範圍。  
> 安裝 TypeORM/PostgreSQL 相關依賴可以接受，因為這屬於 backend baseline。  
> 但目前 Stage 1 只允許做到：
> - backend auth/rbac/users baseline
> - jwt/refresh structure
> - password hashing baseline
> - guard/strategy skeleton
> - audit masking improvement
> - frontend login scaffold
> - basic auth-related route guard scaffold
> - infrastructure baseline
> - PROMPT.md initial structure  
> 請不要開始實作：
> - Task
> - Document
> - AI pipeline
> - Notification
> - Admin dashboard
> - 完整資料表設計與複雜業務流程

#### Purpose
這個 prompt 用來修正 Roo Code 開始往更完整 DB / 業務流程延伸的傾向。

#### Expected Behavior
我希望 Roo Code 可以保留必要的 package / baseline，但不要直接把複雜商業邏輯一起做掉。

#### Actual Response
Roo Code 後續有把焦點拉回 Stage 1，並在回報中多次強調沒有觸及 Task、Document、AI pipeline 等模組。

#### Adjustment / Reflection
這是典型的「糾偏 prompt」。  
如果沒有這種 prompt，AI 很容易在看到資料庫或 ORM 之後一路往更完整產品開發。

---

### 5. Finalization Prompt for Stage 1
#### Prompt
> 確認，請繼續完成本輪剩餘的 Stage 1，並嚴格限制在既定範圍內。  
> 本輪請完成：
> 1. frontend
>    - basic auth-related route guard scaffold only
> 2. infrastructure
>    - docker-compose baseline
>    - .env.example baseline
> 3. repository documents
>    - PROMPT.md initial structure
> 4. verification
>    - basic build/run validation for frontend and backend  
> 請不要實作：
> - Task
> - Document
> - AI pipeline
> - Notification
> - Admin dashboard
> - 真實 API 串接
> - Stage 2 之後的任何功能  
> 完成後請一次回報：
> 1. 實際新增或修改的檔案
> 2. Stage 1 最終完成範圍
> 3. 尚未開始的模組
> 4. 建議的 commit message

#### Purpose
這個 prompt 的目的是在 Stage 1 尾聲做收斂，把前端、infrastructure 和文件補齊，並要求 build 驗證。

#### Expected Behavior
我預期 Roo Code 完成剩餘骨架並停止在 Stage 1，不往後擴張。

#### Actual Response
Roo Code 最後完成了：
- frontend login scaffold
- protected route scaffold
- `docker-compose.yml`
- `.env.example`
- `PROMPT.md`
- backend/frontend build 驗證

#### Adjustment / Reflection
這類「收尾型 prompt」有助於把分散的工作整合成一個明確階段成果。

---

## Prompt Effectiveness Review

### Which prompts clearly improved quality?
以下 prompt 對品質提升最明顯：

1. **Initial Planning Prompt**
   - 避免一開始就變成單步驟生專案
   - 讓整體流程先規劃再實作

2. **Stage 1 Constraint Prompt**
   - 有效限制範圍
   - 防止 Roo Code 過度擴張

3. **Correction Prompt for Drift Control**
   - 在 AI 開始偏移時重新拉回指定範圍
   - 對維持作業要求特別重要

### Which prompts were less effective or caused drift?
比較容易造成 drift 的情況不是單一 prompt 本身，而是：
- 如果 prompt 太短，只寫「繼續完成」
- 或沒有明講「不要做 Stage 2+」
- Roo Code 就可能自動往更完整產品方向擴張

### Did orchestration actually help?
有幫助。  
如果不用 orchestration，而是直接要求「寫一個完整系統」，很容易出現以下問題：

- 一次產生太多內容，難以控制範圍
- 無法保留清楚的階段性 commit
- 容易漏掉 `DESIGN.md` / `PROMPT.md` 這種作業要求文件
- 跨模組協作順序會混亂
- 更難分析哪些 prompt 有效、哪些 prompt 需要修正

### What would fail without orchestration?
如果不用 orchestration，最可能卡住的地方有：

1. **模組拆分不清楚**
   - Backend、frontend、infrastructure、docs 可能混在一起產生

2. **範圍失控**
   - AI 會傾向直接補齊更多業務邏輯，而不是只做 Stage 1

3. **文件不足**
   - 很可能只生成 code，卻沒有設計文件與 prompt 分析

4. **缺乏可追蹤性**
   - 難以形成清楚的 commit 歷史與階段成果

---

## Safety and Masking Notes
在 prompt 中，我持續強調：
- 不要洩漏 secrets
- 所有敏感資訊要做 masking
- `audit log` 不能直接保留明文 `password`、`token`、`secret`
- `.env.example` 只能放範例值，不能提交真實敏感資訊

這些限制有幫助 Roo Code 在 Stage 1 中建立較安全的 baseline。

---

## Current Stage Summary
目前本專案已完成 **Stage 1 baseline**，包含：

- Backend auth/rbac/users scaffolds
- JWT / refresh structure
- health check
- env validation
- audit masking baseline
- frontend login scaffold
- protected route scaffold
- docker-compose baseline
- `.env.example`
- `PROMPT.md`

尚未開始的內容：
- `Task`
- `Document`
- `AI pipeline`
- `Notification`
- `Admin dashboard`
- Any Stage 2+ implementation


---

## 骨架建立好了，建立可以demo的prompt
請在目前專案中實作一個 Stage 1 / demo-only login refinement，採用「不同測試帳號代表不同角色」的方式，不要在登入畫面手動選角色。

目標：
讓目前的 login scaffold 變成可展示的 demo login flow。
使用者只輸入 email 和 password。
系統根據測試帳號自動判定 role。

Demo accounts:
- employee@test.com
- manager@test.com
- admin@test.com

Demo password:
- demo123

限制：
1. 這是 demo-only behavior，不是真實正式驗證系統。
2. 不要加入真正完整的 session system。
3. 不要加入 Stage 2 之後的模組。
4. 保持在目前小應用 / Stage 1 demo 範圍內。
5. 不要在 login page 加入角色選單。
6. 角色必須由 email 自動決定，而不是前端手動選擇。

Backend requirements:
1. 在現有 auth/users baseline 上加入 demo login behavior。
2. 當 email 為 employee@test.com、manager@test.com、admin@test.com，且 password 為 demo123 時，允許登入。
3. 若帳號或密碼不符，回傳適當錯誤。
4. role 對應如下：
   - employee@test.com -> employee
   - manager@test.com -> manager
   - admin@test.com -> admin
5. 這個 demo login 可以使用 in-memory mapping 或最小 stub，不需要完整正式資料庫流程。
6. 保留目前 Auth / RBAC / Users 結構，不要大改整體架構。

Frontend requirements:
1. 保持 login page 只有 email/password 輸入，不要加入 role selector。
2. 送出表單後呼叫目前的 login endpoint。
3. 登入成功後導向 dashboard placeholder。
4. 在 dashboard 畫面清楚顯示：
   - current user email
   - current role
   - demo mode
5. 若登入失敗，要顯示簡單錯誤訊息。
6. 保持這是 demo scaffold，不要實作完整正式 token persistence。

RBAC demo behavior:
請至少讓 dashboard 畫面有最小差異化顯示：
- employee: show "Employee View"
- manager: show "Manager View"
- admin: show "Admin View"

Documentation:
請更新 PROMPT.md，補一小段說明：
1. 為什麼這裡不用登入時手動選角色。
2. 為什麼目前改用 demo accounts 映射角色。
3. 這仍然屬於 demo / scaffold，不是正式 production auth。

完成後請先回報：
1. 實際新增或修改的檔案
2. 測試方式（要輸入哪些 demo 帳號）
3. 目前仍屬於 demo 的部分
4. 建議的 commit message

不要實作：
- Task
- Document
- AI pipeline
- Notification
- Admin dashboard
- 真正完整的 production auth/session system


## 回報問題與相關事情:
已完成 demo-only login refinement（維持 Stage 1 範圍）：

1) 新增/修改的檔案
- Backend: [`backend/src/auth/auth.service.ts`](backend/src/auth/auth.service.ts:1) — 加入 demo 帳號映射與密碼 `demo123`，email→role 自動判定；不符則 Unauthorized；仍保留原 Users 驗證路徑。
- Frontend:
  - [`frontend/src/app/login/page.tsx`](frontend/src/app/login/page.tsx:1) — 呼叫 `/api/v1/auth/login`，成功即 redirect 至 `/dashboard?email=...`，失敗顯示錯誤；不存 token。
  - [`frontend/src/app/(protected)/layout.tsx`](frontend/src/app/(protected)/layout.tsx:1) — demo-only 放行（提醒未實作真實驗證）。
  - [`frontend/src/app/dashboard/page.tsx`](frontend/src/app/dashboard/page.tsx:1) — 依 query 中 email 推導 role (employee/manager/admin/guest)，顯示 Current user/Role/對應 View 與 demo 提示。
- Docs: [`PROMPT.md`](PROMPT.md:1) — 補充為何用固定 demo accounts 映射角色、仍屬 scaffold。

2) 測試方式
- 使用 demo 密碼 `demo123` 與下列 email：
  - employee@test.com → role: employee
  - manager@test.com → role: manager
  - admin@test.com → role: admin
- 流程：登入頁輸入 email/password → 成功導向 `/dashboard?email=...` → Dashboard 顯示 email、role 與對應 “Employee/Manager/Admin View”。錯誤帳密會顯示錯誤訊息。

3) 仍為 demo 的部分
- 無真實 session/token 持久化，僅前端 redirect；protected layout 為示意放行。
- Backend demo login 使用 in-memory mapping，僅供展示。
- 未涉入任何 Stage 2+ 模組。

4) 建議 commit message
- `chore: add demo login flow with role mapping and dashboard view`

所有變更保持在 Stage 1 demo scaffold 範圍內，未實作真實 production auth/session。








## Final Reflection
這次作業中，我發現 prompt 設計比直接要求「幫我寫系統」更重要。  
真正影響結果品質的不是單一模型能力，而是：

- 要先求規劃(先討論完規劃再執行才不會有有不知道的檔案)
- 可以先明確限制範圍(一次確定寫作範圍，檢查比較方便，不太會漏)
- 出現不符合預期的時候需糾正(如果他有一些不符合預期的行為，立刻停止並糾正，不要被他帶方向，可以等他回饋之後再考慮要不要改進)
- 要求每階段回報實際修改檔案與未完成範圍(這樣對於品質管控比較方便)


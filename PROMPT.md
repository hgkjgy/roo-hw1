# PROMPT.md

## 一、專案說明
本專案的目標不是單純讓 AI 一次性產生程式碼，而是透過 Roo Code 的 orchestration 模式，將一個較複雜的系統需求拆解成多個階段，逐步完成規劃、實作、修正與收尾。

題目是 **AI-driven internal task collaboration and document processing platform**。  
在完整設計上，這個系統包含前端、後端 API、資料庫、背景任務、AI pipeline、通知模組、管理與稽核功能，因此合理需要 orchestration 模式，而不是用單一 prompt 一次完成。

不過，本次實際提交的成果並不是整套系統全部完成，而是先聚焦在 **frontend demo dashboard**，完成可展示、可驗證、可追蹤的階段成果，包括：

- demo login
- role-aware dashboard
- employee / manager / admin 三種角色視圖
- mock auth localStorage persistence
- task localStorage persistence
- manager/admin 任務新增與狀態控制
- employee 任務狀態切換
- reset flow
- form validation
- empty states
- README/demo usage 說明
- Next.js 16 相容修正（searchParams、hook order、localStorage hydration）

---

## 二、為什麼這個專案需要 Orchestration 模式
這個專案不是單一頁面或單一功能，而是包含多個模組與階段的系統型專案。  
從設計文件來看，完整系統原本規劃包含：

- Frontend（Next.js App Router）
- Backend API（NestJS modular monolith）
- PostgreSQL
- Redis / BullMQ worker
- Task module
- Document processing
- AI summarize / tagging pipeline
- Notification module
- Audit / Admin module
- Docker Compose / deployment baseline

如果直接使用單一 prompt 要求「幫我生成整個系統」，很容易出現以下問題：

1. 範圍失控，AI 會直接往完整產品擴張  
2. 模組混雜，前後端與文件同時生成，難以追蹤  
3. 不容易保留清楚的 commit 歷史  
4. 很難控制 Roo Code 的產出方向  
5. 難以分析哪些 prompt 有效、哪些 prompt 導致 drift  

因此，我在這次作業中採用 orchestration 的方式，先要求 Roo Code 做規劃、拆階段、限制範圍，再逐步推進。

---

## 三、Prompt 設計原則
這次使用 Roo Code 時，我主要採用以下幾個 prompt 設計原則：

### 1. 先規劃，後實作
我沒有一開始就要求 Roo Code 直接寫完整專案，而是先要求它先提出架構、模組邊界、階段切分與交付方式。  
這樣做的好處是可以先建立系統全貌，再決定每一輪應該推進到哪個程度。

### 2. 明確限制範圍
在多次 prompt 中都強調：
- 只做目前這一階段
- 不要提前開始下一階段
- 不要自行擴張成完整產品

這種限制型 prompt 很重要，因為 Roo Code 在面對大型專案時，會有自然往「更多功能」擴張的傾向。

### 3. 要求拆子任務與回報
要求 Roo Code：
- 先拆子任務
- 說明執行順序
- 完成後列出修改檔案
- 提供建議 commit message

這讓整個過程更像工程協作，而不是一次性輸出。

### 4. 持續糾偏
當 Roo Code 產出的方向和我預期不一致時，不會直接修改程式碼，而是重新設計 prompt，把它拉回指定範圍。 (作業規定)

---

## 四、Orchestration 的角色設計
在這次作業中，我望 Roo Code 同時扮演以下幾種角色：

### 1. Planner
負責先把整個專案拆成多個階段，安排優先順序與依賴關係。

### 2. Architect
負責提出系統架構、模組邊界、資料流與控制流。

### 3. Coder
負責依照目前階段的限制實作對應功能。

### 4. Reviewer
負責檢查目前產出是否偏離原本要求，並說明哪些地方仍屬於 placeholder。

### 5. Tool Runner
負責透過 repo 掃描、讀檔、執行指令、檢查錯誤訊息等方式協助完成多步驟任務。

這樣的角色分工，能讓 Roo Code 不只是「寫 code」，而是更接近一個可被管理的 AI 工程團隊。

---

## 五、關鍵 Prompt 節錄與分析

下面列出這次作業中幾個最重要的 prompt 類型，說明其目的、預期、實際效果與修正方式。

### Prompt 1：初始規劃 Prompt
#### Prompt 目的
要求 Roo Code 不要一開始直接生成整包專案，而是先完成架構規劃、模組切分、階段設計與文件骨架。

#### 我的預期
希望 Roo Code 先產出：
- 系統架構方向
- 模組邊界
- stage plan
- `DESIGN.md` 初始版本
- 基本 repo scaffold

#### Roo Code 實際回應
Roo Code 有先從系統角度切分 frontend、backend、worker、queue、database、docs 等模組，也建立了 `DESIGN.md` 與 `stage-plan.md` 這類規劃型文件。

#### 反思
這一步非常重要。  
如果沒有先做規劃，後面的 prompt 很容易失去依據，也比較難證明這個專案「合理需要 orchestration」。

---

### Prompt 2：Stage 1 限制型 Prompt
#### Prompt 目的
把 Roo Code 的工作範圍限制在 Stage 1，只允許完成最小可運作骨架，不要提前做 Task、Document、AI pipeline、Notification、Admin dashboard。

#### 我的預期
預期 Roo Code 只完成：
- auth/rbac/users baseline
- frontend login scaffold
- basic protected route scaffold
- docker-compose baseline
- `.env.example`
- 基本文件

#### Roo Code 實際回應
Roo Code 大致遵守了這個限制，先完成骨架性內容，而沒有一開始就把全部業務邏輯都做出來。

#### 反思
這類限制型 prompt 對控制範圍非常有效。  
如果沒有這種 prompt，Roo Code 很容易直接往更完整產品擴張。

---

### Prompt 3：糾偏 Prompt（Drift Control）
#### Prompt 目的
當 Roo Code 開始往更完整的 DB 或業務流程延伸時，用 prompt 把它拉回目前允許的範圍。

#### 我的預期
Roo Code 繼續完成目前骨架，但不要：
- 提前做 Stage 2+
- 把資料表與完整功能一次補齊
- 失去當前階段的 focus

#### Roo Code 實際回應
在重新限制之後，Roo Code 有收斂回比較基礎的 scaffold 與文件補齊。

#### 反思
這種 prompt 讓我很明顯感受到 orchestration 的價值。  
AI 並不是下完 prompt 就永遠不會偏，而是需要持續管理、修正與界定範圍。

---

### Prompt 4：Demo Dashboard 擴充 Prompt
#### Prompt 目的
在 Stage 1 骨架完成後，進一步把前端 demo 做到更能展示的程度，包括：
- employee view
- manager/admin controls
- summary chips
- demo banner
- mock auth persistence
- task persistence
- reset flow
- validation
- empty states

#### 我的預期
希望 Roo Code 可以用多個小 commit，逐步把 dashboard 從單純 scaffold 擴充成一個可展示的 frontend demo。

#### Roo Code 實際回應
Roo Code 後續確實透過多輪 prompt，逐步完成：
- employee 任務切換
- manager/admin 新增與管理 task
- 共享統計 chips
- demo banner
- mock auth localStorage persistence
- task localStorage persistence
- reset / validation / empty states
- README usage notes

#### 反思
好的 prompt 不一定是一次講很大，而是能把需求拆成明確的小階段，每一輪都要求 Roo Code 回報修改檔案與建議 commit message。這樣能讓 commit history 更清楚，也更符合工程協作。

---

### Prompt 5：Debug / Fix Prompt（Next.js 16）
#### Prompt 目的
在前端 demo 基本完成後，修正實際執行時出現的 runtime 問題，包括：
- async `searchParams`
- hook order error
- `Rendered more hooks than during the previous render`
- `localStorage is not defined`
- hydration/client-only API 問題

#### 我的預期
Roo Code 能根據錯誤訊息修正實作方式，並保持現有功能不被破壞。

#### Roo Code 實際回應
Roo Code 透過後續多個 fix 類 prompt，逐步完成：
- 改用 `useSearchParams()` 或移除舊 `searchParams` 依賴
- 修正 hooks 順序
- 將 effects 移到 conditional returns 之前
- 為 localStorage 存取加上 client-side guard
- 將初始化讀取移到 hydration 後處理

#### 反思
這部分很能反映「AI as Engineer」的協作模式。 可以根據實際錯誤設計新的 prompt，要求 Roo Code 修正問題。  

---

## 六、哪些 Prompt 最有效？

### 最有效的 prompt 類型
1. **先規劃再實作的 prompt**  
   能先建立全局架構，避免一開始亂做。

2. **明確限制階段與模組範圍的 prompt**  
   對防止 drift 非常有效。

3. **要求 Roo Code 回報修改檔案與 commit message 的 prompt**  
   有助於建立可追蹤的開發過程。

4. **根據錯誤訊息設計的 debug prompt**  
   能讓 Roo Code 不只是寫功能，也能做收尾與修正。

---

## 七、哪些 Prompt 比較容易失效？
最容易出問題的不是某一個特定 prompt，而是以下情況：

- prompt 太短，只寫「繼續完成」
- 沒有限制不要做下一階段
- 沒有要求回報修改範圍
- 沒有明說目前哪些東西不能碰

在這些情況下，Roo Code 比較容易：
- 自動擴張功能
- 產出超出目前作業範圍的內容
- 讓文件與實作不一致

---

## 八、Orchestration 是否真的有幫助？
有幫助，而且幫助很明顯。

如果不用 orchestration，而是直接要求 AI「寫一個完整系統」，最可能出現的問題有：

1. 一次產生太多內容，難以控管  
2. 無法保留清楚的分階段 commit  
3. 很難同時顧到設計文件與實作  
4. 出錯時不知道該怎麼回頭修正  
5. 無法明確看出 prompt 設計是否有效  

相反地，若使用 orchestration 後，我可以：
- 先規劃，再實作
- 明確限制階段
- 逐輪檢查 Roo Code 的方向
- 用新的 prompt 做糾偏
- 保留清楚的 Git 歷史與文件說明

---

## 九、本次實作成果與完整設計的差異
這次提交的 repo 並不是把整個系統完整做完，而是先完成一個 **frontend-only demo dashboard**。  
目前已完成的部分包括：

- demo login
- role-aware dashboard
- employee / manager / admin 視圖
- mock auth localStorage persistence
- demo task localStorage persistence
- manager/admin 任務管理
- employee 任務狀態切換
- reset flow
- validation
- empty states
- README usage notes
- Next.js 16 相容修正

而完整系統設計中原本規劃的以下模組，目前仍屬於後續擴充方向：
- 真正的 task backend CRUD
- PostgreSQL 持久化
- document processing
- AI summarize / tagging pipeline
- notifications
- admin audit dashboard
- worker / queue pipeline 完整落地

---

## Final Reflection
這次作業中，我發現 prompt 設計比直接要求「幫我寫系統」更重要。  
真正影響結果品質的不是單一模型能力，而是：

- 要先求規劃(先討論完規劃再執行才不會有有不知道的檔案)
- 可以先明確限制範圍(一次確定寫作範圍，檢查比較方便，不太會漏)
- 出現不符合預期的時候需糾正(如果他有一些不符合預期的行為，立刻停止並糾正，不要被他帶方向，可以等他回饋之後再考慮要不要改進)
- 要求每階段回報實際修改檔案與未完成範圍(這樣對於品質管控比較方便)


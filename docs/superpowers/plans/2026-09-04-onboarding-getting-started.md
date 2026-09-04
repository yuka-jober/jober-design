# 시작하기(온보딩) 화면 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 신규 사용자가 알림톡 첫 발송 → 카카오 채널 연동 → 포인트 충전까지 3단계를 클릭만으로 끝까지 진행할 수 있는, 동작하는 시작하기 화면 프로토타입을 만든다.

**Architecture:** 단일 HTML 파일(`prototypes/onboarding-0904/index.html`) 안에 마크업 + 로컬 `<style>` + 인라인 `<script>`를 둔다. 상태는 하나의 평평한 객체로 `localStorage`에 저장하고, 상태가 바뀌면 `render()`가 화면 전체를 다시 그리는 단방향 흐름을 쓴다. 재사용 가치가 있는 세그먼트 토글 하나만 `components.css`로 승격하고, 나머지 레이아웃은 프로토타입 로컬 CSS로 둔다.

**Tech Stack:** 순수 HTML / CSS / ES2015+ 바닐라 JS. 빌드 도구·프레임워크·테스트 러너 없음. `tokens.css` + `components.css` + `assets/icons.js` 스프라이트.

## Global Constraints

이 제약은 **모든 태스크에 예외 없이 적용**된다. 각 태스크의 요구사항에 아래가 암묵적으로 포함된다.

- **설계 문서:** `docs/superpowers/specs/2026-09-04-onboarding-getting-started-design.md`. 문구·상태 전이·에러 메시지는 이 문서를 정본으로 삼는다.
- **raw 값 하드코딩 금지.** hex, rgba, 임의 px 금지. 모든 색·크기·모션 값은 `tokens.css` 변수를 참조한다. 예외: 레이아웃 전용 수치(`flex`, `grid-template-columns`, `max-width`, `z-index`)와 4의 배수 여백.
- **여백(padding·margin·gap)은 4의 배수만** 쓴다.
- **`--palette-*` 직접 참조 금지.** semantic `--color-*`만 쓴다.
- **아이콘은 `<use href="#id">`로만** 참조한다. `icons.svg` 파일 직접 참조 금지(`file://`에서 깨진다). `<script src="../../assets/icons.js">`는 `<body>` 바로 뒤에 둔다.
- **사용 가능한 아이콘(스프라이트 존재 확인 완료):** `message-outlined` `link-outlined` `file-text-outlined` `check-outlined` `down-outlined` `up-outlined` `close-outlined` `search-outlined` `right-outlined` `exclamation-circle-outlined` `check-circle-filled` `plus-outlined`. **이 목록 밖의 아이콘을 쓰려면 먼저 `grep -c 'id="이름"' assets/icons.svg`로 존재를 확인한다.**
- **CSS 로드 순서:** `../../tokens.css` → `../../components.css`.
- **`components.css`를 수정하면 같은 커밋에서 `CLAUDE.md`의 "사용 가능한 컴포넌트" 목록도 갱신한다.** (프로젝트 규칙)
- **기존 컴포넌트 우선.** 새 클래스를 만들기 전에 `components.css`에 있는지 먼저 확인한다.
- **검증 방식:** 이 저장소에는 테스트 러너가 없다. 각 태스크의 검증은 Browser pane 도구로 실제 파일을 열어 확인한다. 검증 URL은 항상 `file:///Users/yuka/jober-design/prototypes/onboarding-0904/index.html`이다.
- **커밋 메시지는 영문**, 기존 히스토리(`Fix mobile layout when the Kakao banner is dismissed`) 스타일을 따른다.

---

## File Structure

| 파일 | 책임 | 태스크 |
|---|---|---|
| `components.css` | `.segmented` 컴포넌트 추가 (TOGGLE 섹션 뒤, MENU 섹션 앞) | 1 |
| `preview.html` | 검수 갤러리에 Segmented 섹션 추가 | 1 |
| `CLAUDE.md` | 컴포넌트 목록에 `.segmented` 반영 | 1 |
| `prototypes/onboarding-0904/index.html` | 화면 전체(마크업 + 로컬 style + 인라인 script). 단일 파일 | 2~8 |

단일 파일을 유지하는 이유: `prototypes/home-0903/index.html`(572줄)과 `home-0825`가 모두 단일 파일이며, `file://`로 더블클릭해 열어야 하므로 모듈 분리 시 CORS로 스크립트가 차단된다.

`index.html` 내부 구획은 아래 순서로 고정한다. 각 태스크는 자기 구획만 채운다.

```
<style>
  1. RESET / LAYOUT      (Task 2)
  2. STEP CARD           (Task 2)
  3. STEP 1 LEFT         (Task 3)
  4. ALIMTALK MOCKUP     (Task 4)
  5. MODAL               (Task 5a)
  6. STEP 2 / STEP 3     (Task 6, 7)
  7. DIALOGS             (Task 6, 7)
</style>
<script>
  1. STATE               (Task 2)
  2. ALIMTALK MARKUP     (Task 4)
  3. MODAL               (Task 5a, 5b)
  4. DIALOG / TOAST      (Task 6)
  5. BOOT                (Task 2)
</script>
```

---

### Task 1: `.segmented` 컴포넌트를 디자인 시스템에 추가

**Files:**
- Modify: `components.css` (TOGGLE 섹션 끝 ~398행과 MENU 섹션 시작 ~401행 사이)
- Modify: `preview.html` (컴포넌트 갤러리)
- Modify: `CLAUDE.md` (사용 가능한 컴포넌트 목록)

**Interfaces:**
- Consumes: 없음
- Produces: `.segmented` (트랙), `.segmented-item` (버튼), `.is-selected` (선택 상태 모디파이어). Task 4가 STEP 1 우측 미리보기 전환에 사용한다.

- [ ] **Step 1: `components.css`의 TOGGLE 섹션 바로 뒤, MENU 섹션 바로 앞에 SEGMENTED 섹션을 추가한다**

`.toggle-sm:checked::after { transform: translateX(16px); }` 줄 다음, `/* MENU (Dropdown) */` 주석 블록 앞에 삽입한다.

```css
/* ==========================================
   SEGMENTED (Tab Toggle)
   .segmented + .segmented-item (+ .is-selected)
   ========================================== */

.segmented {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.segmented-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: var(--control-h);
  padding: 0 var(--control-px-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--r-full);
  background: var(--color-surface);
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--font-base);
  font-size: var(--fs-14);
  font-weight: var(--fw-medium);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color var(--motion-standard) var(--ease-standard),
    border-color     var(--motion-standard) var(--ease-standard),
    color            var(--motion-standard) var(--ease-standard);
}
.segmented-item:hover { color: var(--color-text); }
.segmented-item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--outline-w) var(--color-primary-outline);
}

.segmented-item.is-selected {
  background: var(--color-primary-bg);
  border-color: var(--color-primary-border);
  color: var(--color-primary);
}
.segmented-item.is-selected:hover { color: var(--color-primary); }

.segmented-item:disabled {
  border-color: var(--color-border-split);
  color: var(--color-disabled);
  cursor: not-allowed;
}
```

- [ ] **Step 2: `preview.html`에 검수용 Segmented 섹션을 추가한다**

`preview.html`의 Components 섹션은 `<h3>` 소제목 + `.row` 래퍼 형식이다. Form 소제목 블록이 끝나는 지점, 즉 `<h3>Badge</h3>` 줄(약 116행) **바로 앞**에 삽입한다.

```html
    <h3>Segmented</h3>
    <div class="row">
      <div class="segmented">
        <button class="segmented-item is-selected">메시지</button>
        <button class="segmented-item">링크·문서 연결</button>
      </div>
    </div>

```

들여쓰기는 이웃한 `<h3>Badge</h3>`와 동일하게 공백 4칸이다.

- [ ] **Step 3: `CLAUDE.md`의 컴포넌트 목록에 한 줄 추가한다**

`- **Toggle:**` 항목이 포함된 줄 다음, `- **Menu:**` 줄 앞에 추가한다. (Checkbox/Radio/Toggle이 한 줄에 묶여 있으므로 그 줄 바로 다음)

```markdown
- **Segmented:** `.segmented .segmented-item` (+ `.is-selected`) — 탭 토글. 선택 항목은 primary 약면
```

- [ ] **Step 4: 하드코딩 검사**

추가한 CSS에 raw 값이 없는지 확인한다.

```bash
sed -n '/SEGMENTED (Tab Toggle)/,/MENU (Dropdown)/p' components.css | grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(|--palette-'
```

Expected: 출력 없음 (매칭 0건). 출력이 있으면 해당 값을 토큰으로 교체한다.

- [ ] **Step 5: 브라우저로 렌더링 확인**

`preview_start`를 `{url: "file:///Users/yuka/jober-design/preview.html"}`로 호출한 뒤, `find`로 `메시지`를 찾아 두 버튼이 존재하는지 확인하고 `computer {action:"screenshot"}`으로 Segmented 섹션을 확인한다.

Expected: 알약 두 개가 나란히 보이고, `메시지`는 옅은 파란 면 + 파란 글씨, `링크·문서 연결`은 흰 면 + 회색 테두리.

- [ ] **Step 6: 커밋**

```bash
git add components.css preview.html CLAUDE.md
git commit -m "Add segmented tab toggle to the design system"
```

---

### Task 2: 프로토타입 골격 · 스텝 아코디언 · 상태 머신

**Files:**
- Create: `prototypes/onboarding-0904/index.html`

**Interfaces:**
- Consumes: `tokens.css`, `components.css`, `assets/icons.js`
- Produces (이후 모든 태스크가 의존):
  - `STORAGE_KEY` — `'jober-onboarding-0904'`
  - `state` — `{ step1: Status, step2: Status, step3: Status, freeLeft: number, expanded: number|null }`, `Status = 'pending'|'active'|'done'`
  - `saveState(): void` — `state`를 localStorage에 기록
  - `setStatus(n: 1|2|3, status: Status): void` — 상태 변경 후 `saveState()` + `render()`
  - `expandStep(n: 1|2|3|null): void` — 단일 개폐. `state.expanded` 갱신 후 `saveState()` + `render()`
  - `render(): void` — 스텝 헤더 배지·아이콘·펼침 상태와 `freeLeft` 표시를 모두 다시 그린다. 이후 태스크는 자기 갱신 로직을 이 함수 안에서 호출한다.
  - DOM 규약: 각 스텝은 `<section class="step" data-step="1">`이며, 내부에 `<button class="step-head">`와 `<div class="step-body">`를 갖는다. 스텝 본문 컨테이너 id는 `step1-body` / `step2-body` / `step3-body`.

- [ ] **Step 1: 파일을 생성하고 골격 · 레이아웃 CSS · 스텝 카드 CSS를 작성한다**

```bash
mkdir -p prototypes/onboarding-0904
```

`prototypes/onboarding-0904/index.html`:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>시작하기 — 자버</title>
<link rel="stylesheet" href="../../tokens.css">
<link rel="stylesheet" href="../../components.css">
<style>
/* ── 1. RESET / LAYOUT ─────────────────────── */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-base);
  background: var(--color-page);
  color: var(--color-text);
  /* 좌측 네비게이션 자리(1440 기준 약 80px). 이 프로토타입에서는 그리지 않고 폭만 비워둔다 */
  padding-left: 80px;
}

.page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 40px 64px;
}

.page-title {
  font-size: var(--fs-20);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-tight);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.page-foot {
  margin-top: 12px;
  text-align: right;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-disabled);
}
.page-foot button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-decoration: underline;
}
.page-foot button:hover { color: var(--color-text-secondary); }

/* ── 2. STEP CARD ──────────────────────────── */
.step { padding: 0; overflow: hidden; }

.step-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 20px 24px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-base);
}
.step-head:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 var(--outline-w) var(--color-primary-outline);
}

.step-check { flex-shrink: 0; color: var(--color-success); }

.step-title {
  font-size: var(--fs-16);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text);
}
.step[data-status="pending"] .step-title { color: var(--color-text-secondary); }

.step-dot {
  width: 4px;
  height: 4px;
  border-radius: var(--r-full);
  background: currentColor;
}

.step-chev {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--color-disabled);
  transition: transform var(--motion-standard) var(--ease-standard);
}
.step.is-open .step-chev { transform: rotate(180deg); }

.step-body { padding: 0 24px 24px; }
.step:not(.is-open) .step-body { display: none; }
</style>
</head>
<body>
<script src="../../assets/icons.js"></script>

<div class="page">
  <h1 class="page-title">3분이면 충분해요. 첫 알림톡을 직접 보내보세요.</h1>

  <div class="steps">
    <section class="card step" data-step="1">
      <button class="step-head" aria-expanded="false" aria-controls="step1-body"></button>
      <div class="step-body" id="step1-body"></div>
    </section>

    <section class="card step" data-step="2">
      <button class="step-head" aria-expanded="false" aria-controls="step2-body"></button>
      <div class="step-body" id="step2-body"></div>
    </section>

    <section class="card step" data-step="3">
      <button class="step-head" aria-expanded="false" aria-controls="step3-body"></button>
      <div class="step-body" id="step3-body"></div>
    </section>
  </div>

  <p class="page-foot">시안 확인용 · <button type="button" id="reset-state">상태 초기화</button></p>
</div>

<script>
/* ── 1. STATE ──────────────────────────────── */
const STORAGE_KEY = 'jober-onboarding-0904';

const DEFAULT_STATE = { step1: 'active', step2: 'pending', step3: 'pending', freeLeft: 2, expanded: 1 };

const STEP_TITLES = {
  1: '직접 알림톡 보내기',
  2: '카카오 비즈니스 채널 연동하기',
  3: '포인트 충전하기'
};

const STATUS_LABEL = { pending: '대기', active: '진행 중', done: '완료' };
const STATUS_BADGE = { pending: 'badge-weak-neutral', active: 'badge-weak-warning', done: 'badge-weak-success' };

let state;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return Object.assign({}, DEFAULT_STATE);
    return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
  } catch (e) {
    return Object.assign({}, DEFAULT_STATE);
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function setStatus(n, status) {
  state['step' + n] = status;
  saveState();
  render();
}

function expandStep(n) {
  state.expanded = n;
  saveState();
  render();
}

function renderStepHead(n) {
  const status = state['step' + n];
  const numberClass = status === 'active' ? 'badge-fill-primary' : 'badge-weak-neutral';
  const check = status === 'done'
    ? '<svg class="icon icon-lg step-check"><use href="#check-outlined"></use></svg>'
    : '';
  return check
    + '<span class="badge badge-sm ' + numberClass + '">STEP ' + n + '</span>'
    + '<span class="step-title">' + STEP_TITLES[n] + '</span>'
    + '<span class="badge badge-sm badge-pill ' + STATUS_BADGE[status] + '">'
    +   '<span class="step-dot"></span>' + STATUS_LABEL[status]
    + '</span>'
    + '<svg class="icon icon-lg step-chev"><use href="#down-outlined"></use></svg>';
}

function render() {
  [1, 2, 3].forEach(function (n) {
    const el = document.querySelector('.step[data-step="' + n + '"]');
    const head = el.querySelector('.step-head');
    const open = state.expanded === n;

    el.dataset.status = state['step' + n];
    el.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
    head.innerHTML = renderStepHead(n);
  });
}

/* ── 5. BOOT ───────────────────────────────── */
state = loadState();

document.querySelectorAll('.step-head').forEach(function (head) {
  head.addEventListener('click', function () {
    const n = Number(head.closest('.step').dataset.step);
    expandStep(state.expanded === n ? null : n);
  });
});

document.getElementById('reset-state').addEventListener('click', function () {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  location.reload();
});

render();
</script>
</body>
</html>
```

- [ ] **Step 2: 브라우저로 열어 콘솔 에러가 없는지 확인한다**

`preview_start`를 `{url: "file:///Users/yuka/jober-design/prototypes/onboarding-0904/index.html"}`로 호출한 뒤 `read_console_messages {onlyErrors: true}`.

Expected: 에러 0건.

- [ ] **Step 3: 초기 상태를 확인한다**

`read_page {filter: "all"}`.

Expected: STEP 1은 `진행 중` 배지 + 파란 `STEP 1` 배지 + 펼침(`aria-expanded="true"`), STEP 2·STEP 3은 `대기` 배지 + 접힘.

- [ ] **Step 4: 아코디언 개폐를 확인한다**

`browser_batch`로 STEP 2 헤더를 클릭한 뒤 `read_page`를 실행한다.

Expected: STEP 2가 펼쳐지고 STEP 1이 접힌다(단일 개폐). 셰브론이 180도 회전한다.

- [ ] **Step 5: 상태 저장과 초기화를 확인한다**

`javascript_tool`로 `localStorage.getItem('jober-onboarding-0904')`를 읽는다.

Expected: `expanded`가 `2`인 JSON 문자열.

이어서 `상태 초기화` 버튼을 클릭하고 다시 `read_page`.

Expected: STEP 1이 다시 펼쳐진 초기 상태로 돌아간다.

- [ ] **Step 6: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add getting-started screen shell with step accordion and state machine"
```

---

### Task 3: STEP 1 좌측 패널

**Files:**
- Modify: `prototypes/onboarding-0904/index.html` (style 구획 3, `#step1-body` 마크업)

**Interfaces:**
- Consumes: Task 2의 `#step1-body`, `state.freeLeft`, `render()`
- Produces:
  - `#step1-cta` — 알림톡 발송하기 버튼. Task 5a가 여기에 모달 열기 핸들러를 붙인다.
  - `#free-left` — `freeLeft` 숫자를 담는 `<span>`. `render()`가 갱신한다.
  - `.s1-grid` — STEP 1 본문의 좌우 2단 그리드. Task 4가 우측 열을 채운다.

- [ ] **Step 1: style 구획 3에 STEP 1 좌측 CSS를 추가한다**

`/* ── 2. STEP CARD ─ */` 블록 끝(`.step:not(.is-open) .step-body { display: none; }`) 다음에 삽입한다.

```css
/* ── 3. STEP 1 LEFT ────────────────────────── */
.s1-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.s1-lead {
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}

/* 개인 카카오톡 ↔ 자버 알림톡 대비 표 */
.compare {
  margin-top: 16px;
  border-radius: var(--r-lg);
  overflow: hidden;
}
.compare-row {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 16px;
  padding: 16px 20px;
  background: var(--color-bg-light);
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.compare-row + .compare-row { border-top: 1px solid var(--color-border-split); }
.compare-row dt { font-weight: var(--fw-medium); color: var(--color-text-secondary); }
.compare-row dd { color: var(--color-text); }
.compare-row.is-highlight { background: var(--color-primary-bg); }
.compare-row.is-highlight dt { color: var(--color-primary); font-weight: var(--fw-bold); }

/* 디스클로저 */
.disclosure { margin-top: 16px; }
.disclosure-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: var(--font-base);
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-primary);
}
.disclosure-toggle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--outline-w) var(--color-primary-outline);
  border-radius: var(--r-xs);
}
.disclosure-toggle .icon { transition: transform var(--motion-standard) var(--ease-standard); }
.disclosure.is-open .disclosure-toggle .icon { transform: rotate(180deg); }
.disclosure-panel { display: none; margin-top: 12px; }
.disclosure.is-open .disclosure-panel { display: block; }

/* 알림톡 ↔ 친구톡 3행 비교표 */
.vs-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-light);
  border-radius: var(--r-lg);
  overflow: hidden;
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.vs-table th,
.vs-table td { padding: 12px 20px; text-align: left; font-weight: var(--fw-regular); }
.vs-table thead th { font-weight: var(--fw-medium); }
.vs-table tbody tr { border-top: 1px solid var(--color-border-split); }
.vs-table .vs-label { width: 96px; color: var(--color-text-secondary); }
.vs-table .vs-main { color: var(--color-primary); font-weight: var(--fw-medium); }
.vs-table .vs-sub { color: var(--color-text); }
.vs-table .vs-no { color: var(--color-text-secondary); }
.vs-table .vs-yes { color: var(--color-success); }

/* 유형 3카드 */
.s1-subtitle {
  margin-top: 24px;
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.type-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.type-card {
  padding: 16px;
  border: 1px solid var(--color-border-split);
  border-radius: var(--r-xl);
  background: var(--color-surface);
}
/* 유형별 타일은 크기·모양을 통일하고 색만 구분한다 */
.type-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-lg);
}
.type-tile-message { background: var(--color-accent-orange-bg); color: var(--color-accent-orange-fg); }
.type-tile-link    { background: var(--color-accent-purple-bg); color: var(--color-accent-purple-fg); }
.type-tile-doc     { background: var(--color-accent-blue-bg);   color: var(--color-accent-blue-fg); }
.type-card b {
  display: block;
  margin-top: 12px;
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.type-card span {
  display: block;
  margin-top: 4px;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}

.s1-cta { margin-top: 24px; }
.cta-count {
  background: var(--color-surface-veil);
  color: var(--color-primary);
}
```

- [ ] **Step 2: `#step1-body`에 좌측 열 마크업을 채운다**

`<div class="step-body" id="step1-body"></div>`를 아래로 교체한다. (우측 열 `.s1-preview`는 Task 4에서 채우므로 지금은 빈 `<div>`로 둔다)

```html
<div class="step-body" id="step1-body">
  <div class="s1-grid">
    <div class="s1-left">
      <p class="s1-lead">알림톡은 평소 쓰는 카카오톡과 보내는 방식이 달라요.</p>

      <dl class="compare">
        <div class="compare-row">
          <dt>개인 카카오톡</dt>
          <dd>쓰고 싶은 내용을 그대로 입력해서 보내요.</dd>
        </div>
        <div class="compare-row is-highlight">
          <dt>자버 알림톡</dt>
          <dd>카카오에 승인된 템플릿을 골라서 보내요.</dd>
        </div>
      </dl>

      <div class="disclosure" id="s1-disclosure">
        <button class="disclosure-toggle" type="button" aria-expanded="false" aria-controls="s1-vs">
          알림톡과 친구톡은 뭐가 다른가요?
          <svg class="icon icon-sm"><use href="#down-outlined"></use></svg>
        </button>
        <div class="disclosure-panel" id="s1-vs">
          <table class="vs-table">
            <thead>
              <tr>
                <th class="vs-label"></th>
                <th class="vs-main">알림톡</th>
                <th class="vs-sub">친구톡</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="vs-label">누구에게</td>
                <td class="vs-main">전화번호만 알면 발송 가능</td>
                <td class="vs-sub">채널 친구에게만 발송 가능</td>
              </tr>
              <tr>
                <td class="vs-label">어떻게</td>
                <td class="vs-main">승인된 템플릿으로 발송</td>
                <td class="vs-sub">원하는 내용으로 자유롭게 발송</td>
              </tr>
              <tr>
                <td class="vs-label">광고·마케팅</td>
                <td class="vs-no">× 불가</td>
                <td class="vs-yes">○ 가능</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="s1-subtitle">어떤 알림톡을 보낼 수 있나요?</p>
      <div class="type-cards">
        <div class="type-card">
          <span class="type-tile type-tile-message">
            <svg class="icon icon-lg"><use href="#message-outlined"></use></svg>
          </span>
          <b>메시지</b>
          <span>안내 내용을 알림톡으로 보내요.</span>
        </div>
        <div class="type-card">
          <span class="type-tile type-tile-link">
            <svg class="icon icon-lg"><use href="#link-outlined"></use></svg>
          </span>
          <b>링크 연결</b>
          <span>알림톡에 외부 링크를 연결해요.</span>
        </div>
        <div class="type-card">
          <span class="type-tile type-tile-doc">
            <svg class="icon icon-lg"><use href="#file-text-outlined"></use></svg>
          </span>
          <b>문서 연결</b>
          <span>자버 문서를 연결해 함께 보내요.</span>
        </div>
      </div>

      <button class="btn btn-xl btn-primary btn-block s1-cta" type="button" id="step1-cta">
        알림톡 발송하기
        <span class="badge badge-sm badge-pill cta-count">무료 <span id="free-left">2</span>/2건</span>
      </button>
    </div>

    <div class="s1-preview"></div>
  </div>
</div>
```

- [ ] **Step 3: 디스클로저 토글과 `freeLeft` 표시를 스크립트에 연결한다**

`render()` 함수의 `[1,2,3].forEach(...)` 블록 **다음 줄**에 아래를 추가한다.

```js
  const freeLeftEl = document.getElementById('free-left');
  if (freeLeftEl) freeLeftEl.textContent = String(state.freeLeft);

  const cta = document.getElementById('step1-cta');
  if (cta) cta.disabled = state.freeLeft <= 0;
```

BOOT 구획의 `render();` 호출 **앞**에 디스클로저 핸들러를 추가한다.

```js
const disclosure = document.getElementById('s1-disclosure');
const disclosureToggle = disclosure.querySelector('.disclosure-toggle');
disclosureToggle.addEventListener('click', function () {
  const open = !disclosure.classList.contains('is-open');
  disclosure.classList.toggle('is-open', open);
  disclosureToggle.setAttribute('aria-expanded', String(open));
});
```

- [ ] **Step 4: 브라우저로 확인한다**

`preview_start` 후 `read_console_messages {onlyErrors: true}` → 에러 0건. 이어서 `find {query: "알림톡과 친구톡"}`으로 토글을 찾아 `computer {action:"left_click", ref}`, 그 다음 `read_page`.

Expected: 3행 비교표(`누구에게` / `어떻게` / `광고·마케팅`)가 나타난다. 다시 클릭하면 사라진다.

- [ ] **Step 5: 스크린샷으로 시각 확인**

`computer {action:"screenshot"}`.

Expected: 대비 표의 `자버 알림톡` 행만 옅은 파란 면, 유형 3카드의 아이콘 타일이 **모두 같은 크기·모양**이고 색만 주황/보라/파랑으로 다르다. CTA는 파란 전체폭 버튼에 `무료 2/2건` 배지.

- [ ] **Step 6: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add STEP 1 explanation panel with type cards and comparison tables"
```

---

### Task 4: 알림톡 미리보기 목업 · STEP 1 우측 열

**Files:**
- Modify: `prototypes/onboarding-0904/index.html` (style 구획 4, `.s1-preview` 마크업, script 구획 2)

**Interfaces:**
- Consumes: Task 1의 `.segmented`, Task 3의 `.s1-preview`
- Produces:
  - `alimtalkMarkup(opts): string` — 알림톡 말풍선 HTML 문자열을 반환한다. Task 5b가 모달 미리보기에 재사용한다.
    - `opts.title: string` — 말풍선 제목 (예: `'예약 안내'`)
    - `opts.emoji: string` — 제목 우측 이모지. 빈 문자열이면 생략
    - `opts.lines: string[]` — 본문 문단. 빈 문자열은 빈 줄. 문단 안의 `#{이름}`은 변수 칩으로 치환된다
    - `opts.button: string|null` — 하단 버튼 문구. `null`이면 버튼 행 생략
    - `opts.profile: boolean` — `true`면 상단에 `포유마케팅` + `kakao` 프로필 행을 얹는다
    - `opts.placeholder: string|null` — 값이 있으면 `lines` 대신 흐린 안내 문구 한 줄만 그린다
    - `opts.values: Record<string, string>|undefined` — 변수 이름 → 채워진 값. 값이 있는 변수는 값으로, 없으면 `#{이름}` 그대로 칩에 표시한다. Task 5b가 입력 필드 값을 여기로 넘긴다
  - `PREVIEWS: { message: opts, link: opts }` — STEP 1 우측 세그먼트가 전환하는 두 미리보기 데이터

- [ ] **Step 1: style 구획 4에 알림톡 목업 CSS를 추가한다**

Task 3에서 추가한 `.cta-count` 규칙 다음에 삽입한다.

```css
/* ── 4. ALIMTALK MOCKUP ────────────────────── */
.at-frame {
  padding: 16px;
  border-radius: var(--r-2xl);
  background: var(--color-accent-blue-bg);
}

.at-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.at-profile-name {
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.at-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--r-lg);
  background: var(--color-accent-purple-fg);
  color: var(--color-on-primary);
  font-size: var(--fs-11);
  font-weight: var(--fw-bold);
  line-height: 1.1;
  text-align: center;
}
.at-kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: var(--r-full);
  background: var(--color-text);
  color: var(--color-on-primary);
  font-size: var(--fs-11);
  font-weight: var(--fw-medium);
}

.at-card {
  border-radius: var(--r-lg);
  background: var(--color-surface);
  overflow: hidden;
}
.at-head {
  padding: 8px 16px;
  background: var(--color-kakao);
  color: var(--color-on-kakao);
  font-size: var(--fs-12);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.at-body { padding: 16px; }

.at-title-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}
.at-title {
  flex: 1;
  min-width: 0;
  font-size: var(--fs-16);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.at-emoji { flex-shrink: 0; font-size: var(--fs-20); line-height: 1; }

.at-line {
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text);
  white-space: pre-wrap;
}
.at-line-gap { height: 12px; }
.at-placeholder {
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-disabled);
}

.at-var {
  padding: 0 4px;
  border-radius: var(--r-xs);
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.at-btn {
  margin-top: 16px;
  padding: 8px;
  border-radius: var(--r-sm);
  background: var(--color-bg-base);
  text-align: center;
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}

/* STEP 1 우측 열 */
.s1-preview-head { margin-bottom: 12px; }
.s1-preview-caption {
  margin-top: 12px;
  text-align: center;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
```

- [ ] **Step 2: script 구획 2에 `alimtalkMarkup()`과 `PREVIEWS`를 추가한다**

`/* ── 1. STATE ─ */` 구획의 `render()` 함수 정의 **다음**, BOOT 구획 **앞**에 삽입한다.

```js
/* ── 2. ALIMTALK MARKUP ────────────────────── */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// '#{수신자명}' 을 변수 칩으로 바꾼다. 값이 채워진 변수는 값으로 치환한다.
function renderVars(line, values) {
  return escapeHtml(line).replace(/#\{([^}]+)\}/g, function (match, name) {
    const filled = values && values[name];
    if (filled) return '<span class="at-var">' + escapeHtml(filled) + '</span>';
    return '<span class="at-var">#{' + escapeHtml(name) + '}</span>';
  });
}

function alimtalkMarkup(opts) {
  const o = opts || {};
  let html = '';

  if (o.profile) {
    html += '<div class="at-profile">'
      +   '<span class="at-avatar">FOR<br>U</span>'
      +   '<span class="at-profile-name">포유마케팅</span>'
      +   '<span class="at-kakao">kakao</span>'
      + '</div>';
  }

  let inner = '';
  if (o.placeholder) {
    inner = '<p class="at-placeholder">' + escapeHtml(o.placeholder) + '</p>';
  } else {
    inner = '<div class="at-title-row">'
      +   '<span class="at-title">' + escapeHtml(o.title || '') + '</span>'
      +   (o.emoji ? '<span class="at-emoji">' + o.emoji + '</span>' : '')
      + '</div>';
    inner += (o.lines || []).map(function (line) {
      if (line === '') return '<div class="at-line-gap"></div>';
      return '<p class="at-line">' + renderVars(line, o.values) + '</p>';
    }).join('');
    if (o.button) inner += '<div class="at-btn">' + escapeHtml(o.button) + '</div>';
  }

  html += '<div class="at-card">'
    +   '<div class="at-head">알림톡 도착</div>'
    +   '<div class="at-body">' + inner + '</div>'
    + '</div>';

  return '<div class="at-frame">' + html + '</div>';
}

const PREVIEWS = {
  message: {
    profile: true,
    title: '예약 안내',
    emoji: '📅',
    lines: [
      '안녕하세요, 홍길동님.',
      '포유마케팅입니다.',
      '온라인 상담 예약을 원하신다면, 아래의 내용을 참고해 주세요.',
      '',
      '▶ 예약 방법 : 포유마케팅 고객센터',
      '(02-1234-5678)로 전화 또는 문자로 문의해 주세요.',
      '',
      '문의 내용을 확인한 후 담당자가 상담 가능한 일정을 안내해 드리겠습니다.',
      '',
      '본 메시지는 예약 알림을 신청하신 분께 발송되는 안내 메시지입니다.'
    ],
    button: null
  },
  link: {
    profile: true,
    title: '수업 안내',
    emoji: '📗',
    lines: [
      '안녕하세요, 포유마케팅입니다.',
      '온라인 마케팅 기초 교육 수업은 어떠셨나요?',
      '',
      '더 나은 교육을 위해 여러분의 소중한 의견을 들려주세요.',
      '아래 버튼을 눌러 수업 후기를 남겨주시면 감사하겠습니다.'
    ],
    button: '자세히 보기'
  }
};
```

- [ ] **Step 3: `.s1-preview` 마크업을 채운다**

Task 3에서 남겨둔 `<div class="s1-preview"></div>`를 교체한다.

```html
<div class="s1-preview">
  <div class="segmented s1-preview-head" role="tablist">
    <button class="segmented-item is-selected" type="button" role="tab" aria-selected="true" data-preview="message">메시지</button>
    <button class="segmented-item" type="button" role="tab" aria-selected="false" data-preview="link">링크·문서 연결</button>
  </div>
  <div id="s1-preview-body"></div>
  <p class="s1-preview-caption">지금 발송하면 내 카카오톡에 이 모습 그대로 도착해요.</p>
</div>
```

- [ ] **Step 4: 세그먼트 전환 핸들러를 BOOT 구획에 추가한다**

BOOT 구획의 `render();` 호출 **앞**에 삽입한다.

```js
const previewBody = document.getElementById('s1-preview-body');
const previewTabs = document.querySelectorAll('[data-preview]');

function selectPreview(key) {
  previewTabs.forEach(function (tab) {
    const on = tab.dataset.preview === key;
    tab.classList.toggle('is-selected', on);
    tab.setAttribute('aria-selected', String(on));
  });
  previewBody.innerHTML = alimtalkMarkup(PREVIEWS[key]);
}

previewTabs.forEach(function (tab) {
  tab.addEventListener('click', function () { selectPreview(tab.dataset.preview); });
});

selectPreview('message');
```

- [ ] **Step 5: 브라우저로 확인한다**

`preview_start` 후 `read_console_messages {onlyErrors: true}` → 에러 0건. `computer {action:"screenshot"}`.

Expected: 우측에 옅은 파란 프레임 안 흰 말풍선. 상단에 노란 `알림톡 도착` 바, 보라 `FOR U` 프로필과 어두운 `kakao` 원형 배지, 제목 `예약 안내` + 📅.

- [ ] **Step 6: 세그먼트 전환을 확인한다**

`find {query: "링크·문서 연결"}` → `computer {action:"left_click", ref}` → `get_page_text`.

Expected: 미리보기가 `수업 안내`로 바뀌고 본문 하단에 `자세히 보기` 버튼 행이 생긴다. `링크·문서 연결` 탭이 파란 선택 상태가 된다.

- [ ] **Step 7: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add Kakao alimtalk preview mockup and segmented preview switch"
```

---

### Task 5a: 테스트 발송 모달 — 셸과 받는 사람 입력

**Files:**
- Modify: `prototypes/onboarding-0904/index.html` (style 구획 5, 모달 마크업, script 구획 3)

**Interfaces:**
- Consumes: Task 3의 `#step1-cta`, Task 4의 `alimtalkMarkup()`
- Produces:
  - `#test-modal` — `.dialog-overlay` 요소. `.is-open`으로 개폐
  - `openTestModal(): void` / `closeTestModal(): void`
  - `recipients: string[]` — 최대 2개
  - `addRecipient(raw: string): {ok: true} | {ok: false, msg: string}`
  - `renderRecipients(): void` — 칩 목록을 다시 그린다
  - `refreshModal(): void` — 모달 안 미리보기·필드·CTA를 모두 다시 그린다. Task 5b가 이 함수를 확장한다. 지금은 미리보기 placeholder와 CTA 비활성만 처리한다.

- [ ] **Step 1: style 구획 5에 모달 CSS를 추가한다**

Task 4에서 추가한 `.s1-preview-caption` 규칙 다음에 삽입한다.

```css
/* ── 5. MODAL ──────────────────────────────── */
.dialog-wide { width: 920px; max-width: calc(100vw - 64px); }

.modal-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-split);
}
.modal-head .dialog-title { flex: 1; min-width: 0; }

.modal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  margin-top: 24px;
}
.modal-col { display: flex; flex-direction: column; gap: 8px; }

.field + .field { margin-top: 16px; }
.field .label { margin-bottom: 4px; }

.recipient-row { display: flex; gap: 8px; }
.recipient-row .input { flex: 1; min-width: 0; }

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.chip-remove {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.65;
}
.chip-remove:hover { opacity: 1; }

.modal-section-title {
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}

.modal-empty {
  padding: 24px;
  border-radius: var(--r-lg);
  background: var(--color-bg-light);
  text-align: center;
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}

.modal-cta { margin-top: 24px; }
.modal-hint {
  margin-top: 8px;
  text-align: center;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
```

- [ ] **Step 2: 모달 마크업을 추가한다**

`<p class="page-foot">` 를 감싼 `</div>`(`.page` 닫는 태그) **다음**, `<script>` **앞**에 삽입한다. 우측 열의 템플릿 선택·내용 입력은 Task 5b가 채운다.

```html
<div class="dialog-overlay" id="test-modal">
  <div class="dialog dialog-wide" role="dialog" aria-modal="true" aria-labelledby="test-modal-title">
    <div class="modal-head">
      <h2 class="dialog-title" id="test-modal-title">알림톡 테스트 발송</h2>
      <button class="icon-btn" type="button" id="test-modal-close" aria-label="닫기">
        <svg class="icon icon-lg"><use href="#close-outlined"></use></svg>
      </button>
    </div>

    <div class="modal-grid">
      <div class="modal-col">
        <div class="field">
          <label class="label" for="recipient-input">받는 사람</label>
          <div class="recipient-row">
            <input class="input" type="tel" id="recipient-input" placeholder="번호를 - 없이 입력해주세요.">
            <button class="btn btn-md btn-primary" type="button" id="recipient-add">추가</button>
          </div>
          <p class="input-error-msg" id="recipient-error" hidden></p>
          <div class="chips" id="recipient-chips"></div>
        </div>

        <p class="modal-section-title">알림톡 미리보기</p>
        <div id="modal-preview"></div>
      </div>

      <div class="modal-col" id="modal-right"></div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: script 구획 3에 모달 로직을 추가한다**

`/* ── 2. ALIMTALK MARKUP ─ */` 구획의 `PREVIEWS` 정의 **다음**에 삽입한다.

```js
/* ── 3. MODAL ──────────────────────────────── */
const MAX_RECIPIENTS = 2;
let recipients = [];
let lastFocused = null;

const modalEl = document.getElementById('test-modal');
const recipientInput = document.getElementById('recipient-input');
const recipientError = document.getElementById('recipient-error');
const recipientChips = document.getElementById('recipient-chips');
const modalPreview = document.getElementById('modal-preview');

function addRecipient(raw) {
  const value = String(raw).replace(/[^0-9]/g, '');
  if (!/^0\d{9,10}$/.test(value)) return { ok: false, msg: '올바른 번호를 입력해주세요.' };
  if (recipients.indexOf(value) !== -1) return { ok: false, msg: '이미 추가된 번호입니다.' };
  if (recipients.length >= MAX_RECIPIENTS) return { ok: false, msg: '무료 테스트 발송은 최대 2건까지 가능합니다.' };
  recipients.push(value);
  return { ok: true };
}

function showRecipientError(msg) {
  recipientError.textContent = msg;
  recipientError.hidden = false;
  recipientInput.classList.add('is-error');
}

function clearRecipientError() {
  recipientError.hidden = true;
  recipientInput.classList.remove('is-error');
}

function renderRecipients() {
  recipientChips.innerHTML = recipients.map(function (num, i) {
    return '<span class="badge badge-md badge-pill badge-weak-primary">' + num
      + '<button class="chip-remove" type="button" data-remove="' + i + '" aria-label="' + num + ' 삭제">'
      +   '<svg class="icon icon-sm"><use href="#close-outlined"></use></svg>'
      + '</button></span>';
  }).join('');
}

// Task 5b 가 템플릿 선택·내용 입력·CTA 활성화를 여기에 얹는다.
function refreshModal() {
  renderRecipients();
  modalPreview.innerHTML = alimtalkMarkup({ placeholder: '템플릿을 선택해주세요.' });
}

function openTestModal() {
  lastFocused = document.activeElement;
  recipients = [];
  recipientInput.value = '';
  clearRecipientError();
  refreshModal();
  modalEl.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  recipientInput.focus();
}

function closeTestModal() {
  modalEl.classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}
```

- [ ] **Step 4: 모달 이벤트를 BOOT 구획에 연결한다**

BOOT 구획의 `render();` 호출 **앞**에 삽입한다.

```js
document.getElementById('step1-cta').addEventListener('click', openTestModal);
document.getElementById('test-modal-close').addEventListener('click', closeTestModal);

modalEl.addEventListener('click', function (e) {
  if (e.target === modalEl) closeTestModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalEl.classList.contains('is-open')) closeTestModal();
});

function submitRecipient() {
  const result = addRecipient(recipientInput.value);
  if (!result.ok) { showRecipientError(result.msg); return; }
  clearRecipientError();
  recipientInput.value = '';
  refreshModal();
}

document.getElementById('recipient-add').addEventListener('click', submitRecipient);

recipientInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') { e.preventDefault(); submitRecipient(); }
});

recipientChips.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  recipients.splice(Number(btn.dataset.remove), 1);
  clearRecipientError();
  refreshModal();
});
```

- [ ] **Step 5: 모달 열기와 번호 추가를 확인한다**

`preview_start` 후 `read_console_messages {onlyErrors: true}` → 에러 0건.

`browser_batch`로 다음을 순서대로 실행한다: `find {query:"알림톡 발송하기"}` → 해당 버튼 클릭 → `find {query:"번호를 - 없이"}` → 입력란에 `01000000000` 타이핑 → `추가` 클릭 → `read_page`.

Expected: 모달이 열리고 `01000000000` 칩이 생긴다. 미리보기는 `알림톡 도착` 헤더 + `템플릿을 선택해주세요.`

- [ ] **Step 6: 중복 번호 에러를 확인한다**

같은 번호 `01000000000`을 다시 입력하고 `추가` 클릭 → `get_page_text`.

Expected: `이미 추가된 번호입니다.` 노출. 칩은 여전히 1개.

- [ ] **Step 7: 2건 초과 에러를 확인한다**

`01011111111` 추가(성공, 칩 2개) → `01022222222` 입력 후 `추가` 클릭 → `get_page_text`.

Expected: `무료 테스트 발송은 최대 2건까지 가능합니다.` 노출. 칩은 2개 유지.

- [ ] **Step 8: 형식 에러와 Esc 닫기를 확인한다**

`123` 입력 후 `추가` → Expected: `올바른 번호를 입력해주세요.`
이어서 `computer {action:"key", text:"Escape"}` → `read_page`.

Expected: 모달이 닫히고 배경 스크롤이 복구된다.

- [ ] **Step 9: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add test-send modal shell with recipient input and validation"
```

---

### Task 5b: 테스트 발송 모달 — 템플릿 선택 · 내용 입력 · 발송

**Files:**
- Modify: `prototypes/onboarding-0904/index.html` (style 구획 5 보강, `#modal-right` 마크업, script 구획 3 보강)

**Interfaces:**
- Consumes: Task 5a의 `recipients`, `refreshModal()`, `modalPreview`, `closeTestModal()`; Task 4의 `alimtalkMarkup()`; Task 2의 `state`, `saveState()`, `setStatus()`, `expandStep()`
- Produces:
  - `TEMPLATES: Template[]` — `{ id, name, title, emoji, lines, button, fields }`, `fields`는 `{ key, label, placeholder, type: 'input'|'textarea' }[]`
  - `selectedTemplate: Template|null`
  - `fieldValues: Record<string, string>`
  - `showToast(msg: string): void` — 성공 토스트 3초 노출. Task 6이 재사용한다.
  - `sendTest(): void` — 모달 닫기 + 토스트 + `freeLeft--` + STEP 1 `done` + STEP 2 `active` 펼침

- [ ] **Step 1: style 구획 5에 템플릿 선택 CSS를 추가한다**

Task 5a에서 추가한 `.modal-hint` 규칙 다음에 삽입한다.

```css
.select-search { position: relative; }
.select-search .input { padding-right: 40px; }
.select-search .select-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-secondary);
}
.select-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
  display: none;
  max-height: 240px;
  overflow-y: auto;
}
.select-search.is-open .select-menu { display: block; }
```

- [ ] **Step 2: `#modal-right`에 우측 열 마크업을 채운다**

Task 5a에서 남겨둔 `<div class="modal-col" id="modal-right"></div>`를 교체한다.

```html
<div class="modal-col" id="modal-right">
  <div class="field">
    <label class="label" for="template-input">템플릿 선택</label>
    <div class="select-search" id="template-select">
      <input class="input" type="text" id="template-input" placeholder="템플릿을 선택해주세요." autocomplete="off">
      <svg class="icon select-icon"><use href="#search-outlined"></use></svg>
      <div class="menu select-menu" id="template-menu"></div>
    </div>
  </div>

  <p class="modal-section-title">내용 입력</p>
  <div id="template-fields"></div>

  <button class="btn btn-xl btn-primary btn-block modal-cta" type="button" id="modal-send" disabled>
    알림톡 발송하기
    <span class="badge badge-sm badge-pill cta-count">무료 <span id="modal-free-left">2</span>/2건</span>
  </button>
  <p class="modal-hint" id="modal-hint">받는 번호를 추가하고 템플릿을 고르면 발송할 수 있어요.</p>
</div>
```

- [ ] **Step 3: `TEMPLATES` 데이터를 script 구획 3에 추가한다**

Task 5a의 `const MAX_RECIPIENTS = 2;` **앞**에 삽입한다.

```js
const TEMPLATES = [
  {
    id: 'schedule-1',
    name: '일정 안내 1 (이미지형)',
    title: '일정 안내',
    emoji: '📅',
    lines: [
      '안녕하세요 #{수신자명} 님,',
      '신청하신 #{일정명} 일정을 안내해 드립니다.',
      '',
      '▶ 일정명 : #{일정명}',
      '▶ 일시 : #{일시}',
      '',
      '#{추가메시지}',
      '',
      '이 메시지는 알림 신청하신 분들께만 전송되는 메시지입니다.'
    ],
    button: null,
    fields: [
      { key: '수신자명',   label: '수신자명',   placeholder: '홍길동',                 type: 'input' },
      { key: '일정명',     label: '일정명',     placeholder: '온라인 마케팅 기초 교육', type: 'input' },
      { key: '일시',       label: '일시',       placeholder: '3월 12일 오후 2시',      type: 'input' },
      { key: '추가메시지', label: '추가메시지', placeholder: '잊지 말고 참석해주세요.', type: 'textarea' }
    ]
  },
  {
    id: 'review-1',
    name: '수업 후기 요청 1 (버튼형)',
    title: '수업 안내',
    emoji: '📗',
    lines: [
      '안녕하세요 #{수신자명} 님, 포유마케팅입니다.',
      '#{수업명} 수업은 어떠셨나요?',
      '',
      '아래 버튼을 눌러 수업 후기를 남겨주시면 감사하겠습니다.'
    ],
    button: '자세히 보기',
    fields: [
      { key: '수신자명', label: '수신자명', placeholder: '홍길동',                 type: 'input' },
      { key: '수업명',   label: '수업명',   placeholder: '온라인 마케팅 기초 교육', type: 'input' }
    ]
  },
  {
    id: 'booking-1',
    name: '예약 안내 1 (기본형)',
    title: '예약 안내',
    emoji: '📅',
    lines: [
      '안녕하세요 #{수신자명} 님, 포유마케팅입니다.',
      '#{예약일시} 예약이 확정되었습니다.',
      '',
      '변경이 필요하시면 고객센터로 연락해 주세요.'
    ],
    button: null,
    fields: [
      { key: '수신자명', label: '수신자명', placeholder: '홍길동',            type: 'input' },
      { key: '예약일시', label: '예약일시', placeholder: '3월 12일 오후 2시', type: 'input' }
    ]
  }
];

let selectedTemplate = null;
let fieldValues = {};
```

- [ ] **Step 4: `refreshModal()`을 확장하고 렌더 함수들을 추가한다**

Task 5a가 넣은 `refreshModal()` 함수 전체를 아래로 **교체**하고, 이어지는 함수들을 그 아래에 추가한다.

```js
function renderModalPreview() {
  if (!selectedTemplate) {
    modalPreview.innerHTML = alimtalkMarkup({ placeholder: '템플릿을 선택해주세요.' });
    return;
  }
  modalPreview.innerHTML = alimtalkMarkup({
    title: selectedTemplate.title,
    emoji: selectedTemplate.emoji,
    lines: selectedTemplate.lines,
    button: selectedTemplate.button,
    values: fieldValues
  });
}

function renderModalFields() {
  const wrap = document.getElementById('template-fields');
  if (!selectedTemplate) {
    wrap.innerHTML = '<div class="modal-empty">템플릿을 고르면 입력할 내용이 표시돼요.</div>';
    return;
  }
  wrap.innerHTML = selectedTemplate.fields.map(function (f) {
    const control = f.type === 'textarea'
      ? '<textarea class="textarea" id="f-' + f.key + '" data-field="' + f.key + '" placeholder="' + f.placeholder + '"></textarea>'
      : '<input class="input" type="text" id="f-' + f.key + '" data-field="' + f.key + '" placeholder="' + f.placeholder + '">';
    return '<div class="field"><label class="label" for="f-' + f.key + '">' + f.label + '</label>' + control + '</div>';
  }).join('');
}

function updateSendButton() {
  const btn = document.getElementById('modal-send');
  const hint = document.getElementById('modal-hint');
  const ready = recipients.length > 0 && !!selectedTemplate && state.freeLeft > 0;

  btn.disabled = !ready;
  document.getElementById('modal-free-left').textContent = String(state.freeLeft);

  if (state.freeLeft <= 0) {
    hint.textContent = '무료 테스트 발송을 모두 사용했어요.';
    hint.hidden = false;
  } else if (!ready) {
    hint.textContent = '받는 번호를 추가하고 템플릿을 고르면 발송할 수 있어요.';
    hint.hidden = false;
  } else {
    hint.hidden = true;
  }
}

function renderTemplateMenu(query) {
  const menu = document.getElementById('template-menu');
  const q = String(query || '').trim();
  const list = TEMPLATES.filter(function (t) { return !q || t.name.indexOf(q) !== -1; });

  menu.innerHTML = list.length
    ? list.map(function (t) {
        const on = selectedTemplate && selectedTemplate.id === t.id ? ' is-selected' : '';
        return '<button class="menu-item' + on + '" type="button" data-template="' + t.id + '">' + t.name + '</button>';
      }).join('')
    : '<div class="menu-header">검색 결과가 없어요.</div>';
}

function selectTemplate(id) {
  selectedTemplate = TEMPLATES.filter(function (t) { return t.id === id; })[0] || null;
  fieldValues = {};
  document.getElementById('template-input').value = selectedTemplate ? selectedTemplate.name : '';
  document.getElementById('template-select').classList.remove('is-open');
  renderModalFields();
  renderModalPreview();
  updateSendButton();
}

function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = '<svg class="icon toast-icon"><use href="#check-circle-filled"></use></svg>' + msg;
  container.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3000);
}

function sendTest() {
  closeTestModal();
  state.freeLeft = Math.max(0, state.freeLeft - 1);
  state.step1 = 'done';
  state.step2 = 'active';
  state.expanded = 2;
  saveState();
  render();
  showToast('알림톡을 발송했어요. 카카오톡을 확인해 주세요.');
}

function refreshModal() {
  renderRecipients();
  renderModalPreview();
  renderModalFields();
  updateSendButton();
}
```

- [ ] **Step 5: `openTestModal()`에서 템플릿 선택 상태를 초기화한다**

Task 5a의 `openTestModal()` 안, `recipients = [];` 다음 줄에 삽입한다.

```js
  selectedTemplate = null;
  fieldValues = {};
  document.getElementById('template-input').value = '';
  document.getElementById('template-select').classList.remove('is-open');
```

- [ ] **Step 6: 템플릿·필드·발송 이벤트를 BOOT 구획에 연결한다**

BOOT 구획의 `render();` 호출 **앞**에 삽입한다.

```js
const templateSelect = document.getElementById('template-select');
const templateInput = document.getElementById('template-input');

templateInput.addEventListener('focus', function () {
  renderTemplateMenu(''); 
  templateSelect.classList.add('is-open');
});
templateInput.addEventListener('input', function () {
  renderTemplateMenu(templateInput.value);
  templateSelect.classList.add('is-open');
});

document.getElementById('template-menu').addEventListener('click', function (e) {
  const item = e.target.closest('[data-template]');
  if (item) selectTemplate(item.dataset.template);
});

document.addEventListener('click', function (e) {
  if (!templateSelect.contains(e.target)) templateSelect.classList.remove('is-open');
});

document.getElementById('template-fields').addEventListener('input', function (e) {
  const key = e.target.dataset.field;
  if (!key) return;
  fieldValues[key] = e.target.value;
  renderModalPreview();
});

document.getElementById('modal-send').addEventListener('click', sendTest);
```

- [ ] **Step 7: 템플릿 미선택 상태를 확인한다**

`preview_start` → `read_console_messages {onlyErrors: true}` (에러 0건) → `알림톡 발송하기` 클릭 → `get_page_text`.

Expected: `템플릿을 선택해주세요.`(미리보기), `템플릿을 고르면 입력할 내용이 표시돼요.`(내용 입력), `받는 번호를 추가하고 템플릿을 고르면 발송할 수 있어요.`(하단 안내). 발송 버튼은 `disabled`.

- [ ] **Step 8: 템플릿 선택 후 상태를 확인한다**

번호 `01000000000` 추가 → 템플릿 입력란 클릭 → `일정 안내 1 (이미지형)` 클릭 → `get_page_text` + `computer {action:"screenshot"}`.

Expected: 우측에 `수신자명` / `일정명` / `일시` / `추가메시지` 4개 필드가 생기고, 미리보기 제목이 `일정 안내`로 바뀌며 `#{수신자명}` 등이 옅은 파란 칩으로 보인다. 발송 버튼이 활성화되고 하단 안내는 사라진다.

- [ ] **Step 9: 변수 치환을 확인한다**

`수신자명` 필드에 `홍길동`을 입력하고 `get_page_text`.

Expected: 미리보기의 `#{수신자명}`이 `홍길동`으로 바뀌고 칩 스타일은 유지된다.

- [ ] **Step 10: 발송 흐름을 확인한다**

`알림톡 발송하기`(모달 안) 클릭 → `read_page`.

Expected: 모달이 닫히고 성공 토스트가 뜬다. STEP 1이 `완료`(초록 배지 + 체크 아이콘)로 접히고 STEP 2가 `진행 중`으로 펼쳐진다. STEP 1을 다시 펼치면 CTA 배지가 `무료 1/2건`.

- [ ] **Step 11: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add template picker and send flow to the test-send modal"
```

---

### Task 6: STEP 2 — 채널 연동 패널과 완료 다이얼로그

**Files:**
- Modify: `prototypes/onboarding-0904/index.html` (style 구획 6·7, `#step2-body` 마크업, script 구획 4)

**Interfaces:**
- Consumes: Task 2의 `state`, `saveState()`, `render()`, `expandStep()`
- Produces:
  - `openDialog(id: string): void` / `closeDialog(id: string): void` — `.dialog-overlay` id로 개폐. Task 7이 재사용한다
  - `#dialog-linked` — 채널 연동 완료 다이얼로그
  - `render()` 안에서 STEP 2 CTA가 상태에 따라 `카카오 비즈니스 채널 연동하기` ↔ `✓ 채널 연동 완료`(비활성)로 바뀐다

- [ ] **Step 1: STEP 2 이미지 경로를 확인한다**

```bash
ls -la "assets/카카오 프로필 연동2.png"
```

Expected: 파일이 존재한다. 프로토타입에서의 상대 경로는 `../../assets/카카오 프로필 연동2.png`이다.

- [ ] **Step 2: style 구획 6에 STEP 2 CSS를 추가한다**

Task 5b에서 추가한 `.select-menu` 관련 규칙 다음에 삽입한다.

```css
/* ── 6. STEP 2 / STEP 3 ────────────────────── */
.s2-panel {
  padding: 32px;
  border-radius: var(--r-xl);
  background: var(--color-bg-light);
  text-align: center;
}
.s2-panel-title {
  font-size: var(--fs-16);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
.s2-image {
  display: block;
  width: 100%;
  max-width: 720px;
  height: auto;
  margin: 24px auto 0;
}
.s2-cta { margin-top: 24px; }
.s2-foot {
  margin-top: 16px;
  text-align: right;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
.s2-foot a { color: var(--color-primary); }

.s3-title {
  font-size: var(--fs-16);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.s3-desc {
  margin-top: 4px;
  font-size: var(--fs-14);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
.s3-cta { margin-top: 20px; }

/* ── 7. DIALOGS ────────────────────────────── */
.dialog-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dialog-title-row .icon { flex-shrink: 0; color: var(--color-success); }

.dialog-summary {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: var(--r-lg);
  background: var(--color-bg-light);
}
.dialog-summary-row { display: flex; align-items: baseline; gap: 8px; }
.dialog-summary-row + .dialog-summary-row { margin-top: 16px; }
.dialog-summary-row b {
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.dialog-summary-sub {
  margin-top: 4px;
  margin-left: 68px;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
```

- [ ] **Step 3: `#step2-body`를 채운다**

```html
<div class="step-body" id="step2-body">
  <div class="s2-panel">
    <p class="s2-panel-title">카카오 채널을 연동해 우리 회사 이름으로 알림톡을 발송하세요.</p>
    <img class="s2-image" src="../../assets/카카오 프로필 연동2.png"
         alt="기본 알림톡 발송 프로필과 카카오 프로필 연동 후 비교">
    <button class="btn btn-lg btn-primary s2-cta" type="button" id="step2-cta">
      카카오 비즈니스 채널 연동하기
    </button>
  </div>
  <p class="s2-foot">프로필 연동관련 문의가 있으신가요? <a href="#">자버팀 문의하기</a></p>
</div>
```

- [ ] **Step 4: 채널 연동 완료 다이얼로그 마크업을 추가한다**

Task 5a의 `#test-modal` 닫는 `</div>` 다음에 삽입한다.

```html
<div class="dialog-overlay" id="dialog-linked">
  <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-linked-title">
    <div class="dialog-title-row">
      <svg class="icon icon-lg"><use href="#check-circle-filled"></use></svg>
      <h2 class="dialog-title" id="dialog-linked-title">카카오 비즈니스 채널 연동이 완료되었습니다.</h2>
    </div>
    <p class="dialog-desc">이제 포인트를 충전하면 우리 회사 프로필로 알림톡을 발송할 수 있어요.</p>

    <div class="dialog-summary">
      <div class="dialog-summary-row">
        <span class="badge badge-sm badge-weak-success">✓ STEP 2</span>
        <b>카카오 비즈니스 채널 연동하기</b>
      </div>
      <p class="dialog-summary-sub">연동을 완료했어요.</p>
      <div class="dialog-summary-row">
        <span class="badge badge-sm badge-fill-primary">STEP 3</span>
        <b>포인트 충전하기</b>
      </div>
      <p class="dialog-summary-sub">발송에 사용할 포인트를 충전해 주세요.</p>
    </div>

    <div class="dialog-actions">
      <button class="btn btn-lg btn-default" type="button" data-close-dialog="dialog-linked">닫기</button>
      <button class="btn btn-lg btn-primary" type="button" id="goto-step3">STEP 3 포인트 충전하러 가기</button>
    </div>
  </div>
</div>
```

- [ ] **Step 5: script 구획 4에 다이얼로그 헬퍼를 추가한다**

`/* ── 3. MODAL ─ */` 구획의 `sendTest()` 함수 다음에 삽입한다.

```js
/* ── 4. DIALOG / TOAST ─────────────────────── */
function openDialog(id) {
  document.getElementById(id).classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDialog(id) {
  document.getElementById(id).classList.remove('is-open');
  document.body.style.overflow = '';
}
```

- [ ] **Step 6: STEP 2 CTA 상태 갱신을 `render()`에 추가한다**

Task 3에서 추가한 `cta.disabled = state.freeLeft <= 0;` 다음 줄에 삽입한다.

```js
  const step2Cta = document.getElementById('step2-cta');
  if (step2Cta) {
    const linked = state.step2 === 'done';
    step2Cta.disabled = linked;
    step2Cta.classList.toggle('btn-primary', !linked);
    step2Cta.classList.toggle('btn-default', linked);
    step2Cta.innerHTML = linked
      ? '<svg class="icon"><use href="#check-outlined"></use></svg>채널 연동 완료'
      : '카카오 비즈니스 채널 연동하기';
  }
```

- [ ] **Step 7: STEP 2 이벤트를 BOOT 구획에 연결한다**

BOOT 구획의 `render();` 호출 **앞**에 삽입한다.

```js
document.querySelector('.steps').addEventListener('click', function (e) {
  if (e.target.closest('#step2-cta')) {
    state.step2 = 'done';
    saveState();
    render();
    openDialog('dialog-linked');
  }
});

document.addEventListener('click', function (e) {
  const closer = e.target.closest('[data-close-dialog]');
  if (closer) closeDialog(closer.dataset.closeDialog);
});

document.getElementById('goto-step3').addEventListener('click', function () {
  closeDialog('dialog-linked');
  state.step3 = 'active';
  state.expanded = 3;
  saveState();
  render();
});
```

> `render()`가 `step2-cta`를 `innerHTML`로 다시 그리므로 버튼에 직접 리스너를 붙이면 사라진다. 그래서 `.steps` 컨테이너에 위임한다.

- [ ] **Step 8: 브라우저로 확인한다**

`preview_start` → `read_console_messages {onlyErrors: true}` (에러 0건) → `상태 초기화` 클릭 → STEP 2 헤더 클릭 → `computer {action:"screenshot"}`.

Expected: 비교 이미지가 깨지지 않고 보이며, 하단에 `프로필 연동관련 문의가 있으신가요? 자버팀 문의하기` 링크.

- [ ] **Step 9: 연동 흐름을 확인한다**

`카카오 비즈니스 채널 연동하기` 클릭 → `get_page_text`.

Expected: `카카오 비즈니스 채널 연동이 완료되었습니다.` 다이얼로그. STEP 2 배지가 `완료`로 바뀐다.

`STEP 3 포인트 충전하러 가기` 클릭 → `read_page`.

Expected: 다이얼로그가 닫히고 STEP 3이 `진행 중`으로 펼쳐진다. STEP 2를 다시 펼치면 CTA가 `✓ 채널 연동 완료` 비활성 버튼이다.

- [ ] **Step 10: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add STEP 2 channel linking panel and completion dialog"
```

---

### Task 7: STEP 3 — 포인트 충전과 완료 다이얼로그

**Files:**
- Modify: `prototypes/onboarding-0904/index.html` (style 구획 7 보강, `#step3-body` 마크업, BOOT)

**Interfaces:**
- Consumes: Task 6의 `openDialog()` / `closeDialog()`, `[data-close-dialog]` 위임 핸들러; Task 2의 `state`, `saveState()`, `render()`
- Produces: `#dialog-ready` — "모든 준비가 끝났습니다!" 다이얼로그

- [ ] **Step 1: style 구획 7에 완료 다이얼로그 CSS를 추가한다**

Task 6에서 추가한 `.dialog-summary-sub` 규칙 다음에 삽입한다.

```css
.dialog-xl { width: 760px; max-width: calc(100vw - 64px); }

.ready-hero { text-align: center; }
.ready-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--r-full);
  background: var(--color-success-bg);
  color: var(--color-success);
}
.ready-hero .dialog-title { margin-top: 12px; }
.ready-hero .dialog-desc { margin-top: 8px; }

.addon-title {
  margin-top: 24px;
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.addon-desc {
  margin-top: 4px;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
.addon-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.addon-card {
  padding: 16px;
  border-radius: var(--r-xl);
  background: var(--color-bg-light);
}

/* 이미지 없이 CSS 도형으로 그린 추상 일러스트 */
.addon-art {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 96px;
  border-radius: var(--r-lg);
  background: var(--color-accent-lilac-bg);
}
.addon-sheet {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 40px;
  padding: 8px 4px;
  border-radius: var(--r-sm);
  background: var(--color-surface);
}
.addon-sheet i {
  display: block;
  height: 4px;
  border-radius: var(--r-xs);
  background: var(--color-bg-base);
}
.addon-sheet i.is-accent { background: var(--color-kakao); }
.addon-arrow { color: var(--color-accent-purple-fg); }

.addon-card b {
  display: block;
  margin-top: 12px;
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.addon-card p {
  margin-top: 4px;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
.addon-card a {
  display: inline-block;
  margin-top: 12px;
  font-size: var(--fs-12);
  font-weight: var(--fw-medium);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-primary);
}

.diy-title {
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
}
.diy-desc {
  margin-top: 4px;
  font-size: var(--fs-12);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-text-secondary);
}
.diy-links { display: flex; gap: 24px; margin-top: 12px; }
.diy-links a {
  font-size: var(--fs-12);
  font-weight: var(--fw-medium);
  line-height: var(--lh-base);
  letter-spacing: var(--ls-base);
  color: var(--color-primary);
}
```

- [ ] **Step 2: `#step3-body`를 채운다**

```html
<div class="step-body" id="step3-body">
  <p class="s3-title">필요한 만큼 포인트를 충전해 사용해보세요.</p>
  <p class="s3-desc">메시지·설문폼·계약서 등 발송한 만큼 포인트가 차감됩니다.</p>
  <button class="btn btn-lg btn-primary s3-cta" type="button" id="step3-cta">포인트 충전하기</button>
</div>
```

- [ ] **Step 3: 완료 다이얼로그 마크업을 추가한다**

Task 6의 `#dialog-linked` 닫는 `</div>` 다음에 삽입한다.

```html
<div class="dialog-overlay" id="dialog-ready">
  <div class="dialog dialog-xl" role="dialog" aria-modal="true" aria-labelledby="dialog-ready-title">
    <div class="ready-hero">
      <span class="ready-check">
        <svg class="icon icon-xl"><use href="#check-outlined"></use></svg>
      </span>
      <h2 class="dialog-title" id="dialog-ready-title">모든 준비가 끝났습니다!</h2>
      <p class="dialog-desc">이제 우리 회사 이름으로 알림톡을 발송할 수 있어요.<br>공용 템플릿을 바로 사용하거나, 필요한 부가서비스를 추가해보세요.</p>
    </div>

    <p class="addon-title">부가서비스</p>
    <p class="addon-desc">필요한 부가서비스를 추가해 더욱 편리하게 이용할 수 있습니다.</p>
    <div class="addon-cards">
      <div class="addon-card">
        <div class="addon-art">
          <span class="addon-sheet"><i></i><i></i><i></i><i></i></span>
          <svg class="icon addon-arrow"><use href="#right-outlined"></use></svg>
          <span class="addon-sheet"><i class="is-accent"></i><i></i><i></i></span>
        </div>
        <b>우리 회사 전용 템플릿 신청</b>
        <p>공용 템플릿 외에 우리 회사만의 템플릿이 필요할 때</p>
        <a href="#">전용 템플릿 신청하기 →</a>
      </div>
      <div class="addon-card">
        <div class="addon-art">
          <span class="addon-sheet"><i></i><i></i><i></i><i></i></span>
          <svg class="icon addon-arrow"><use href="#right-outlined"></use></svg>
          <span class="addon-sheet"><i></i><i></i><i></i></span>
        </div>
        <b>계약문서 세팅</b>
        <p>사용 중인 계약서 양식을 자버에서 바로 발송할 수 있게</p>
        <a href="#">계약문서 세팅 요청하기 →</a>
      </div>
      <div class="addon-card">
        <div class="addon-art">
          <span class="addon-sheet"><i></i><i></i><i></i><i></i></span>
          <svg class="icon addon-arrow"><use href="#right-outlined"></use></svg>
          <span class="addon-sheet"><i></i><i></i><i></i></span>
        </div>
        <b>마케팅 문서 세팅</b>
        <p>보내고 싶은 내용을 발송 가능한 마케팅 문서로</p>
        <a href="#">마케팅 문서 세팅 요청하기 →</a>
      </div>
    </div>

    <hr class="divider">

    <p class="diy-title">직접 만들어보고 싶다면?</p>
    <p class="diy-desc">계약문서·마케팅 문서는 직접 만들어 알림톡과 연결해 발송할 수도 있어요.</p>
    <div class="diy-links">
      <a href="#">계약문서 세팅 가이드 ></a>
      <a href="#">마케팅 문서 세팅 가이드 ></a>
    </div>

    <div class="dialog-actions">
      <button class="btn btn-lg btn-default" type="button" data-close-dialog="dialog-ready">닫기</button>
      <button class="btn btn-lg btn-primary" type="button" data-close-dialog="dialog-ready">공용 템플릿으로 시작하기</button>
    </div>
  </div>
</div>
```

- [ ] **Step 4: STEP 3 이벤트를 BOOT 구획에 연결한다**

Task 6에서 추가한 `.steps` 위임 핸들러 안, `if (e.target.closest('#step2-cta')) { ... }` 블록 **다음**에 삽입한다.

```js
  if (e.target.closest('#step3-cta')) {
    state.step3 = 'done';
    saveState();
    render();
    openDialog('dialog-ready');
  }
```

- [ ] **Step 5: 브라우저로 전체 흐름을 확인한다**

`preview_start` → `read_console_messages {onlyErrors: true}` (에러 0건) → `상태 초기화` → 아래를 순서대로 실행한다.

1. `알림톡 발송하기` → 번호 `01000000000` 추가 → 템플릿 `일정 안내 1 (이미지형)` 선택 → 모달 안 `알림톡 발송하기`
2. `카카오 비즈니스 채널 연동하기` → `STEP 3 포인트 충전하러 가기`
3. `포인트 충전하기`

`get_page_text` + `computer {action:"screenshot"}`.

Expected: `모든 준비가 끝났습니다!` 다이얼로그가 뜬다. 부가서비스 3카드 각각에 연보라 면의 도형 일러스트, `.divider` 아래 가이드 링크 2개, 하단에 `닫기` / `공용 템플릿으로 시작하기`.

- [ ] **Step 6: 최종 상태를 확인한다**

`공용 템플릿으로 시작하기` 클릭 → `read_page`.

Expected: 다이얼로그가 닫히고 STEP 1·2·3 모두 `완료` 배지 + 체크 아이콘.

- [ ] **Step 7: 커밋**

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Add STEP 3 point charge and all-set completion dialog"
```

---

### Task 8: 접근성 마무리와 최종 검수

**Files:**
- Modify: `prototypes/onboarding-0904/index.html`

**Interfaces:**
- Consumes: Task 2~7의 전체 화면
- Produces: 없음 (마무리 태스크)

- [ ] **Step 1: 다이얼로그에 Esc 닫기와 배경 클릭 닫기를 추가한다**

Task 6에서 추가한 `[data-close-dialog]` 위임 핸들러 **다음**에 삽입한다.

```js
document.querySelectorAll('.dialog-overlay').forEach(function (overlay) {
  if (overlay.id === 'test-modal') return; // 테스트 발송 모달은 Task 5a 에서 이미 처리했다
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeDialog(overlay.id);
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  const open = document.querySelector('.dialog-overlay.is-open:not(#test-modal)');
  if (open) closeDialog(open.id);
});
```

- [ ] **Step 2: 다이얼로그가 열릴 때 포커스를 옮긴다**

Task 6의 `openDialog()` 함수를 아래로 교체한다.

```js
function openDialog(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const first = overlay.querySelector('.dialog-actions .btn');
  if (first) first.focus();
}
```

- [ ] **Step 3: 하드코딩 값이 없는지 검사한다**

```bash
grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|--palette-' prototypes/onboarding-0904/index.html | grep -v 'href="#'
```

Expected: 출력 없음. 출력이 있으면 해당 값을 semantic 토큰으로 교체한다. (`href="#id"` 아이콘 참조는 제외 대상이므로 위 명령에서 걸러진다)

- [ ] **Step 4: 여백이 모두 4의 배수인지 검사한다**

```bash
grep -oE '(padding|margin|gap)[a-z-]*:[^;]+' prototypes/onboarding-0904/index.html \
  | grep -oE '[0-9]+px' | sort -u | awk -F'px' '{ if ($1 % 4 != 0) print $1 "px  <-- 4의 배수 아님" }'
```

Expected: 출력 없음. 출력이 있으면 가장 가까운 4의 배수로 조정한다.

- [ ] **Step 5: `file://`에서 아이콘이 보이는지 확인한다**

`preview_start {url: "file:///Users/yuka/jober-design/prototypes/onboarding-0904/index.html"}` 후 `javascript_tool`로 실행한다.

```js
Array.from(document.querySelectorAll('svg.icon use')).filter(u => {
  const id = u.getAttribute('href').slice(1);
  return !document.getElementById(id);
}).map(u => u.getAttribute('href'))
```

Expected: `[]` (빈 배열). 값이 나오면 그 심볼 id가 스프라이트에 없다는 뜻이므로 `grep -c 'id="이름"' assets/icons.svg`로 확인 후 존재하는 이름으로 교체한다.

- [ ] **Step 6: 키보드만으로 전체 흐름을 통과할 수 있는지 확인한다**

`상태 초기화` 후 `computer {action:"key", text:"Tab"}`을 반복하며 `javascript_tool`로 `document.activeElement.textContent` 를 읽는다.

Expected: 스텝 헤더 → 디스클로저 → CTA 순으로 포커스가 이동하고, 각 요소에 파란 포커스 링이 보인다. 접힌 스텝의 본문 요소로는 포커스가 들어가지 않는다.

- [ ] **Step 7: 상태 지속을 확인한다**

STEP 1까지 완료한 뒤 `navigate`로 같은 URL을 다시 로드하고 `read_page`.

Expected: STEP 1 `완료`, STEP 2 `진행 중` 펼침 상태가 그대로 복원된다. 이어서 `상태 초기화` 클릭 → 초기 상태로 돌아간다.

- [ ] **Step 8: 최종 스크린샷을 남기고 커밋한다**

`computer {action:"screenshot"}`으로 초기 상태와 완료 상태를 각각 확인한다.

```bash
git add prototypes/onboarding-0904/index.html
git commit -m "Polish onboarding screen accessibility and dialog focus handling"
```

---

## 완료 기준 (설계 문서 10절)

전체 태스크를 마친 뒤 아래를 모두 만족해야 한다.

1. `prototypes/onboarding-0904/index.html`을 `file://`로 직접 열었을 때 아이콘이 모두 보인다 → Task 8 Step 5
2. STEP 1 → 2 → 3 전 흐름이 클릭만으로 끝까지 진행된다 → Task 7 Step 5
3. 모달의 4개 상태(템플릿 선택 전/후, 중복 번호, 2건 초과)가 모두 재현된다 → Task 5a Step 6·7, Task 5b Step 7·8
4. 새로고침해도 진행 상태가 유지되고 `상태 초기화`로 처음으로 돌아간다 → Task 8 Step 7
5. 파일 안에 hex·rgba·팔레트 직접 참조가 없고 여백은 모두 4의 배수다 → Task 8 Step 3·4
6. `components.css`에 `.segmented`가 추가되고 `CLAUDE.md` 컴포넌트 목록에도 반영된다 → Task 1

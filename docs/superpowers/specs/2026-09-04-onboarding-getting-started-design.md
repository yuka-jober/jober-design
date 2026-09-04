# 시작하기(온보딩) 화면 설계

- 작성일: 2026-09-04
- 산출물: `prototypes/onboarding-0904/index.html`
- 목적: 신규 사용자가 알림톡 첫 발송 → 카카오 채널 연동 → 포인트 충전까지 3단계를 스스로 끝내게 하는 온보딩 화면. 동작하는 시안(프로토타입)으로 만들어 흐름까지 검증한다.

## 1. 범위

포함:
- STEP 1~3 아코디언, 상태 전이, 접힘/펼침
- STEP 1 테스트 발송 모달(번호 추가·중복·2건 초과·템플릿 선택 전/후)
- STEP 2 채널 연동 완료 다이얼로그
- STEP 3 충전 완료 다이얼로그("모든 준비가 끝났습니다!")
- 상태 초기화 링크

제외:
- 좌측 GNB·상단 검색바 (home-0903 선례대로 좌측 80px 자리만 비운다)
- 실제 API 연동. 모든 동작은 클라이언트 상태로만 처리한다.

## 2. 파일과 로드 순서

```
prototypes/onboarding-0904/index.html
```

- `<head>`: `../../tokens.css` → `../../components.css` 순서
- `<body>` 직후: `<script src="../../assets/icons.js"></script>`
- 아이콘은 `<use href="#id">`로만 참조한다. `icons.svg` 직접 참조 금지.
- STEP 2 비교 이미지: 기존 `../../assets/카카오 프로필 연동2.png` 재사용
- 알림톡 미리보기 목업: 이미지 없이 HTML + 토큰으로 그린다 (`--color-kakao` / `--color-on-kakao`)

## 3. 디자인 시스템 변경

`components.css`에 세그먼트 토글 `.segmented`를 추가한다. STEP 1 우측 미리보기 전환(메시지 / 링크·문서 연결)에 쓰이며, 탭 토글은 화면을 가리지 않고 재발생하는 표준 패턴이므로 시스템에 올린다.

```html
<div class="segmented">
  <button class="segmented-item is-selected">메시지</button>
  <button class="segmented-item">링크·문서 연결</button>
</div>
```

- 구성: `.segmented`(트랙) + `.segmented-item`(버튼) + `.is-selected`
- 값은 전부 기존 토큰에서 가져온다. 트랙 배경 `--color-bg-base`, 선택 항목 면 `--color-surface`, 선택 텍스트 `--color-primary`, radius `--r-full`, 높이 `--control-h`, 전이 `--motion-standard`/`--ease-standard`, 포커스 링 `--color-primary-outline`/`--outline-w`.

**규칙에 따라 `CLAUDE.md`의 "사용 가능한 컴포넌트" 목록에 `.segmented`를 같은 작업에서 함께 추가한다.**

이외의 패턴(아코디언, 비교표, 알림톡 목업, 모달 2단 레이아웃)은 이 화면 고유의 조합이므로 프로토타입 로컬 `<style>`에 둔다. 단 로컬 CSS라도 raw 값 하드코딩은 금지이며 모든 값은 토큰을 참조한다. 여백은 4의 배수만 쓴다.

## 4. 상태 모델

단일 상태 객체를 `localStorage`(키 `jober-onboarding-0904`)에 저장한다.

```js
{
  step1: 'active',      // 'pending' | 'active' | 'done'
  step2: 'pending',
  step3: 'pending',
  freeLeft: 2,          // 무료 테스트 발송 잔여 건수
  expanded: 1           // 현재 펼쳐진 스텝 번호, 없으면 null
}
```

초기값은 위와 같다. `상태 초기화` 링크는 이 키를 지우고 리로드한다.

### 상태 → 표시 매핑

| 상태 | 상태 배지 | STEP 번호 배지 | 제목 좌측 |
|---|---|---|---|
| 진행 중 | `.badge .badge-sm .badge-pill .badge-weak-warning` | `.badge .badge-sm .badge-fill-primary` | 없음 |
| 완료 | `.badge .badge-sm .badge-pill .badge-weak-success` | `.badge .badge-sm .badge-weak-neutral` | 체크 아이콘(`--color-success`) |
| 대기 | `.badge .badge-sm .badge-pill .badge-weak-neutral` | `.badge .badge-sm .badge-weak-neutral` | 없음 |

배지 문구: `진행 중` / `완료` / `대기`.

### 전이

1. 초기: step1 `active` 펼침, step2·step3 `pending` 접힘
2. STEP 1 테스트 발송 성공 → `freeLeft -= 1`, step1 `done`으로 접힘, step2 `active`로 펼침
3. STEP 2 `카카오 비즈니스 채널 연동하기` 클릭 → 연동 완료 다이얼로그 노출, step2 `done`
   - 다이얼로그 `STEP 3 포인트 충전하러 가기` → step3 `active`로 펼침
   - `닫기` → 다이얼로그만 닫고 step3는 `pending` 유지
4. STEP 3 `포인트 충전하기` 클릭 → "모든 준비가 끝났습니다!" 다이얼로그, step3 `done`

`done` 이후에도 헤더를 클릭해 펼치고 재실행할 수 있다. STEP 1 재발송은 `freeLeft > 0`일 때만 가능하며 0이면 CTA를 `disabled` 처리한다. STEP 2가 `done`이면 CTA는 `✓ 채널 연동 완료` 비활성 버튼으로 바뀐다.

아코디언은 한 번에 하나만 펼쳐지는 단일 개폐 방식이다.

## 5. 화면 구조

페이지 상단 제목: `3분이면 충분해요. 첫 알림톡을 직접 보내보세요.` (`--fs-20` / `--fw-bold`)
본문 폭은 home-0903과 동일한 중앙 정렬 컨테이너, `body`에 `padding-left: 80px`.

### 5.1 스텝 카드 헤더 (공통)

`.card` 위에 로컬 클래스. 왼쪽부터: (완료 시 체크 아이콘) → STEP 배지 → 제목 → 상태 배지 → (우측 끝) 셰브론. 헤더 전체가 클릭 영역이며 `aria-expanded`를 토글한다.

### 5.2 STEP 1 — 직접 알림톡 보내기

좌우 2단. 좌측이 넓고 우측이 미리보기.

좌측:
1. 리드문 `알림톡은 평소 쓰는 카카오톡과 보내는 방식이 달라요.`
2. 대비 표 (`--color-bg-light` 면 위 2행)
   - `개인 카카오톡` / `쓰고 싶은 내용을 그대로 입력해서 보내요.`
   - `자버 알림톡` / `카카오에 승인된 템플릿을 골라서 보내요.` — 이 행만 `--color-primary-bg` 면 + 라벨 `--color-primary`로 강조
3. 디스클로저 `알림톡과 친구톡은 뭐가 다른가요?` (`--color-primary` 링크 + 셰브론). 펼치면 3행 비교표:
   | | 알림톡 | 친구톡 |
   |---|---|---|
   | 누구에게 | 전화번호만 알면 발송 가능 | 채널 친구에게만 발송 가능 |
   | 어떻게 | 승인된 템플릿으로 발송 | 원하는 내용으로 자유롭게 발송 |
   | 광고·마케팅 | × 불가 | ○ 가능 |
   `알림톡` 열은 `--color-primary`로, `× 불가`는 `--color-text-secondary`, `○ 가능`은 `--color-success`로 칠한다.
4. `어떤 알림톡을 보낼 수 있나요?` 3카드. 아이콘 타일은 **크기·모양을 통일**하고 색만 accent 토큰으로 구분한다.
   | 카드 | 아이콘 | 타일 색 |
   |---|---|---|
   | 메시지 / `안내 내용을 알림톡으로 보내요.` | `message-outlined` | `--color-accent-orange-bg` / `-fg` |
   | 링크 연결 / `알림톡에 외부 링크를 연결해요.` | `link-outlined` | `--color-accent-purple-bg` / `-fg` |
   | 문서 연결 / `자버 문서를 연결해 함께 보내요.` | `file-text-outlined` | `--color-accent-blue-bg` / `-fg` |
5. CTA `.btn .btn-xl .btn-primary .btn-block` — `알림톡 발송하기` + 우측에 `무료 {freeLeft}/2건` 배지

우측:
1. `.segmented` — `메시지` / `링크·문서 연결`
2. 알림톡 미리보기 목업 (아래 5.4)
3. 캡션 `지금 발송하면 내 카카오톡에 이 모습 그대로 도착해요.` (`--fs-12`, `--color-text-secondary`)

세그먼트 전환 시 목업 내용이 바뀐다.
- `메시지`: 제목 `예약 안내`, 이모지 📅, 본문은 예약 안내 문구
- `링크·문서 연결`: 제목 `수업 안내`, 이모지 📗, 본문 아래에 `자세히 보기` 버튼 행

### 5.3 STEP 2 / STEP 3

STEP 2: `--color-bg-light` 패널 안에 안내문 `카카오 채널을 연동해 우리 회사 이름으로 알림톡을 발송하세요.` + 비교 이미지 + 중앙 CTA. 패널 우하단에 `프로필 연동관련 문의가 있으신가요? → 자버팀 문의하기` 링크.

STEP 3: 제목문 `필요한 만큼 포인트를 충전해 사용해보세요.` + 보조문 `메시지·설문폼·계약서 등 발송한 만큼 포인트가 차감됩니다.` + `.btn .btn-lg .btn-primary` `포인트 충전하기`.

### 5.4 알림톡 미리보기 목업

`--color-accent-blue-bg` 면 위에 흰 말풍선 카드. 카드 상단에 `--color-kakao` 배경 + `--color-on-kakao` 글자의 `알림톡 도착` 바, 그 아래 본문.

전체 미리보기(STEP 1 우측)에는 카드 위에 발신 프로필 행을 얹는다: 좌측 원형 프로필(`FOR U` / `--color-accent-purple-*`) + `포유마케팅`, 우측 끝에 어두운 원형 `kakao` 배지.

모달 안 미리보기에는 프로필 행 없이 말풍선만 둔다.

`#{수신자명}` 같은 치환 변수는 `--color-primary-bg` 배경 + `--color-primary` 글자의 인라인 칩으로 표시한다.

## 6. 테스트 발송 모달

`.dialog-overlay` + `.dialog`를 쓰되 넓은 2단 레이아웃을 로컬 클래스로 확장한다. 제목 `알림톡 테스트 발송`, 우상단 닫기 `.icon-btn`.

좌측 열:
1. `받는 사람` — `.input`(placeholder `번호를 - 없이 입력해주세요.`) + `추가` 버튼(`.btn .btn-md`). Enter로도 추가된다.
2. 에러 문구는 `.input-error-msg` 재사용
   - 이미 목록에 있는 번호: `이미 추가된 번호입니다.`
   - 이미 2개인데 추가 시도: `무료 테스트 발송은 최대 2건까지 가능합니다.`
   - 숫자 10~11자리가 아니면: `올바른 번호를 입력해주세요.`
3. 번호 칩 목록 — `.badge .badge-md .badge-pill .badge-weak-primary` + 삭제 버튼
4. `알림톡 미리보기` — 5.4의 말풍선

우측 열:
1. `템플릿 선택` — 검색 아이콘이 붙은 `.input`. 클릭 시 `.menu`로 목록을 띄운다. 입력값으로 필터링한다.
   - 옵션: `일정 안내 1 (이미지형)`, `수업 후기 요청 1 (버튼형)`, `예약 안내 1 (기본형)`
2. `내용 입력` — 선택한 템플릿의 변수만큼 `.label` + `.input`이 생성된다
   - `일정 안내 1`: 수신자명 / 일정명 / 일시 / 추가메시지(`.textarea`)
   - `수업 후기 요청 1`: 수신자명 / 수업명
3. CTA `알림톡 발송하기` + `무료 {freeLeft}/2건` 배지

### 모달 상태

**템플릿 미선택**
- 미리보기: `알림톡 도착` 헤더 + `템플릿을 선택해주세요.` (`--color-disabled`)
- 내용 입력: `--color-bg-light` 빈 상자에 `템플릿을 고르면 입력할 내용이 표시돼요.`
- CTA `disabled`, 그 아래 안내 `받는 번호를 추가하고 템플릿을 고르면 발송할 수 있어요.`

**템플릿 선택 후**
- 미리보기에 템플릿 본문과 `#{변수}` 칩이 채워진다
- 변수 입력 필드 노출
- 번호가 1개 이상이면 CTA 활성

**발송**
- 모달을 닫고 `.toast .toast-success` `알림톡을 발송했어요. 카카오톡을 확인해 주세요.` 노출
- `freeLeft` 감소, STEP 1 완료 처리

## 7. 다이얼로그 2종

**채널 연동 완료** — `.dialog`. 제목 `카카오 비즈니스 채널 연동이 완료되었습니다.` + 체크 아이콘(`--color-success`), 설명 `이제 포인트를 충전하면 우리 회사 프로필로 알림톡을 발송할 수 있어요.`, `--color-bg-light` 요약 상자에 STEP 2(완료)·STEP 3(다음) 2행, 액션 `닫기`(`.btn-default`) / `STEP 3 포인트 충전하러 가기`(`.btn-primary`).

**모든 준비 완료** — `.dialog`(더 넓음). 상단 중앙 원형 체크(`--color-success-bg` 면 + `--color-success` 아이콘), 제목 `모든 준비가 끝났습니다!`, 설명 2줄. 이어서 `부가서비스` 3카드(우리 회사 전용 템플릿 신청 / 계약문서 세팅 / 마케팅 문서 세팅) — 각 카드는 `--color-accent-lilac-bg` 면 안에 CSS 도형(둥근 사각형 몇 개 + `--color-accent-purple-fg` 화살표)으로 그린 추상 일러스트 + 제목 + 설명 + 링크로 구성한다. 이미지 파일은 쓰지 않는다. `.divider` 아래 `직접 만들어보고 싶다면?` + 가이드 링크 2개. 액션 `닫기` / `공용 템플릿으로 시작하기`.

## 8. 사용 아이콘

스프라이트에 존재를 확인한 심볼만 쓴다.

`message-outlined` `link-outlined` `file-text-outlined` `check-outlined` `down-outlined` `up-outlined` `close-outlined` `search-outlined` `right-outlined` `exclamation-circle-outlined` `check-circle-filled` `plus-outlined`

## 9. 접근성

- 아코디언 헤더는 `<button>` + `aria-expanded` + `aria-controls`
- 모달은 `role="dialog"` `aria-modal="true"`, 열릴 때 첫 입력으로 포커스 이동, `Esc`로 닫힘, 배경 스크롤 잠금
- 세그먼트는 `role="tablist"` / `role="tab"` + `aria-selected`
- 상태 배지의 색 점은 장식이며 의미는 텍스트가 전달한다
- 모든 인터랙티브 요소는 `:focus-visible` 링을 갖는다 (`--color-primary-outline`, `--outline-w`)

## 10. 완료 기준

1. `prototypes/onboarding-0904/index.html`을 브라우저에서 직접 열었을 때(`file://`) 아이콘이 모두 보인다
2. STEP 1 → 2 → 3 전 흐름이 클릭만으로 끝까지 진행된다
3. 모달의 4개 상태(템플릿 선택 전/후, 중복 번호, 2건 초과)가 모두 재현된다
4. 새로고침해도 진행 상태가 유지되고, `상태 초기화`로 처음으로 돌아간다
5. 파일 안에 hex·rgba·팔레트 직접 참조가 없다. 여백은 모두 4의 배수다
6. `components.css`에 `.segmented`가 추가되고 `CLAUDE.md` 컴포넌트 목록에도 반영된다

# Jober 디자인 시스템 규칙

Connectia와 별개의 독립 토큰 세트. 첨부된 컬러 시스템(Ant Design 프리셋 팔레트 기반)과
타이포 시스템(Spoqa Han Sans Neo)을 출처로 한다.

## 핵심 규칙 (YOU MUST)
- 모든 스타일은 `tokens.css`의 토큰과 `components.css`의 클래스를 **먼저 사용**한다.
- raw 값(hex, rgba, 임의 px 등) **하드코딩 금지**. 항상 토큰 변수 / 유틸 클래스를 참조한다.
- 필요한 스타일이 없으면 일회성으로 만들지 말고 `tokens.css`에 토큰을 추가하거나 `components.css`를 확장한다.
- 색은 semantic 토큰(`--color-*`)만 사용. `--palette-*`는 토큰 정의용이므로 컴포넌트에서 직접 쓰지 않는다.
- 여백(padding·margin·gap)은 **4의 배수**로만 쓴다.
- **`tokens.css` / `components.css`를 변경하면 아래 목록도 같은 작업에서 반드시 함께 갱신한다.**

## 3계층 컬러 구조
```
Palette          Main Token              Semantic Token
--palette-blue-6 → --palette-primary-6 → --color-primary
```
브랜드 색을 바꾸려면 **Main Token 10줄만** 다른 색상군으로 갈아끼운다.

## 파일
- `tokens.css` — 단일 진실 공급원. **반드시 먼저 로드.**
- `components.css` — tokens.css에 의존. 그다음 로드.
- `assets/icons.svg` — 아이콘 스프라이트 833개. **직접 수정 금지 (빌드 산출물).**
- `assets/icons.js` — 같은 스프라이트를 문서에 심어주는 스크립트. **화면에서는 이쪽을 쓴다.**
- `icon/` — Figma export 원본. **스프라이트의 소스이므로 지우지 않는다.** 아이콘 추가/교체는 여기에 넣는다.
- `build-icons.py` — `icon/` → `assets/icons.svg` 빌드. 아이콘 바꾸면 재실행.
- `preview.html` — 팔레트·타이포·컴포넌트·아이콘 갤러리 검수 페이지.
- `prototypes/<주제>-MMDD/` — 화면 작업 폴더. CSS 경로는 `../../tokens.css`, 아이콘은 `../../assets/icons.svg`.

## 사용 가능한 토큰 (tokens.css)

### Palette (컴포넌트에서 직접 사용 금지)
- **12색상군 × 10단계:** `--palette-{red|volcano|orange|gold|yellow|lime|green|cyan|blue|geekblue|purple|magenta}-1`~`-10`
- **Gray 13단계:** `--palette-gray-1`(#ffffff) ~ `--palette-gray-13`(#000000)
- **Black 알파:** `--palette-black-{2|4|6|15|25|35|45|65|85|100}`

### Main Token
- `--palette-primary-1`~`-10` — 현재 Daybreak Blue 별칭. **브랜드 교체 지점.**
- `--outline-fade`(0.2) · `--outline-w`(2px) — focus 링 공통값

### Semantic Color (실제 코드에서 사용)
- **Primary:** `--color-primary / -hover / -active / -bg / -border / -outline`
- **Neutral 텍스트:** `--color-text`(black 85%) `--color-text-secondary`(45%) `--color-disabled`(25%)
- **Neutral 경계:** `--color-border`(15%) `--color-border-split`(6%)
- **Neutral 면:** `--color-surface`(흰색) `--color-surface-sub`(#fafafa) `--color-bg-base`(4%) `--color-bg-light`(2%)
  `--color-page`(불투명 페이지 바닥) `--color-surface-veil`(그라데이션 위 반투명 흰 면)
- **Brand:** `--color-hero-gradient` — 홈 히어로 배경 (sky blue → green)
- **Accent Surface:** `--color-accent-{blue|cyan|purple|orange|lilac}-bg / -fg`
  옅게 강조하는 면 (`-bg` 배경, `-fg` 그 위 아이콘·텍스트).
  blue·cyan·purple·orange 는 팔레트 1단계로 **아이콘 타일**용,
  lilac 은 2단계로 **넓은 안내 패널** 배경용 — 넓은 면은 한 단계 진해야 면으로 읽힌다
- **Inverse:** `--color-on-primary` `--color-on-warning` `--color-scrim`
- **Social Brand:** `--color-kakao` / `--color-on-kakao` — 카카오. 브랜드 가이드상 색 고정이라
  `currentColor` 나 테마 변경의 영향을 받지 않는다
  `--color-jober` / `--color-on-jober` — 자버 알림톡 프로필(검정 바탕 + 흰 워드마크). 마찬가지로 고정
- **Functional:** `--color-{info|success|warning|error}` + 각각 `-hover / -active / -outline / -bg / -border`
  (info는 `-bg / -border`만 — primary의 별칭)

### Typography
- **폰트:** `--font-base` — 한글 Spoqa Han Sans Neo, 라틴/숫자는 시스템 산세리프(SF Pro Text)
- **크기 10단:** `--fs-11 / -12 / -14 / -16 / -20 / -24 / -30 / -38 / -46 / -56`
- **굵기 3단:** `--fw-regular`(400) `--fw-medium`(500) `--fw-bold`(700)
- **행간:** `--lh-base`(1.6, 본문) · `--lh-tight`(1.3, 여러 줄 큰 제목)
- **자간:** `--ls-base`(-0.01em) · `--ls-tight`(-0.02em, 24px~) · `--ls-tighter`(-0.03em, 배너 제목)
- **유틸 클래스:** 크기 `.text-11`~`.text-56` × 굵기 `.font-regular / .font-medium / .font-bold` 조합.
  색 보조 `.text-secondary` `.text-disabled`
  ```html
  <p class="text-16 font-medium">본문</p>
  ```

### Icon
- **크기:** `--icon-sm`(14) `--icon-md`(16, 기본) `--icon-lg`(20) `--icon-xl`(24)
- **액센트:** `--icon-accent` — TwoTone 아이콘의 강조색. 기본값은 `--color-primary`

### 그 외
- **radius:** `--r-xs`(2) `--r-sm`(4) `--r-md`(6, 기본) `--r-lg`(8) `--r-xl`(12)
  `--r-2xl`(16, 카드) `--r-3xl`(20, 히어로·큰 패널) `--r-full`
- **shadow:** `--shadow-1`~`--shadow-4`
- **motion:** `--motion-fast`(100ms) `--motion-standard`(200ms) `--motion-slow`(300ms),
  `--ease-enter / -exit / -standard`
- **form control:** `--control-h-sm`(24) `--control-h`(32) `--control-h-lg`(40) `--control-h-xl`(48),
  `--control-px-sm`(8) `--control-px`(12) `--control-px-lg`(16) `--control-px-xl`(24), `--textarea-py` `--textarea-h`

> radius · shadow · motion · control 치수는 첨부 자료에 명세가 없어 Ant Design 기준값으로 채운 **잠정값**이다.

## 사용 가능한 컴포넌트 (components.css)
모두 클래스 조합 방식. **새로 만들기 전에 여기 있는지 먼저 확인한다.**
- **Card:** `.card` + `.card-lg`(넓은 패딩) + `.card-action`(카드 전체를 클릭 버튼으로, 호버 시 떠오름)
- **Label:** `.label`, 필수표시 `.label-required`
- **Button:** `.btn` + 크기 `.btn-sm/md/lg/xl` + `.btn-block .btn-pill`
  + 스타일 `.btn-primary / -default / -dashed / -text / -link / -white`
    (`-white` 는 색이 깔린 면 위에 얹는 흰 버튼)
  + 모디파이어 `.is-danger` `.is-loading`
- **IconButton:** `.icon-btn` + `.icon-btn-sm/lg` + `.icon-btn-border / -fill`
- **Input:** `.input` + `.input-sm/lg` (+ `.is-error`), 에러문구 `.input-error-msg`
  + 앞·뒤 아이콘 `.input-affix` (+ `.has-start / .has-end`) `.input-affix-start / -end`,
    지우기 버튼 `.input-clear` — `.select` 를 감싸 화살표 자리로도 쓴다
- **TextArea:** `.textarea` (+ `.textarea-auto`, `.is-error`)
- **Select:** `.select` (+ `.select-lg`)
- **Checkbox:** `.checkbox` / **Radio:** `.radio` / **Toggle:** `.toggle` (+ `.toggle-sm`)
- **Segmented:** `.segmented .segmented-item` (+ `.is-selected`) — 탭 토글. 선택 항목은 primary 약면
- **Menu:** `.menu .menu-header .menu-item` (+ `.is-selected .is-danger`)
- **Badge:** `.badge` + `.badge-sm/md/lg` + `.badge-pill`
  + `.badge-fill-*` / `.badge-weak-*` (primary/success/warning/error/neutral)
- **Alert:** `.alert` + `.alert-info/-success/-warning/-error` + `.alert-icon`
- **Dialog:** `.dialog-overlay .dialog .dialog-title .dialog-desc .dialog-actions` (+ `.is-open`)
- **Toast:** `.toast-container .toast` + `.toast-icon` + `.toast-success/-warning/-error/-info`
  (+ `.toast-with-action` `.toast-action`)
- **Avatar:** `.avatar` + `.avatar-xs/sm/md/lg/xl` + `.avatar-rounded`
- **Icon:** `.icon` + `.icon-sm/lg/xl` + 액센트 `.icon-accent-success/-warning/-error`
- **Divider:** `.divider` / `.divider-vertical`

## 아이콘

Ant Design 아이콘 세트(Figma export) + 커스텀 아이콘. 스프라이트 심볼을 `<use>`로 참조한다.

**`<body>` 바로 뒤에 `icons.js` 를 넣고, `<use>` 는 `#id` 만 참조한다.**

```html
<body>
<script src="../../assets/icons.js"></script>

<svg class="icon icon-lg"><use href="#home-outlined"></use></svg>

<!-- 버튼 안 — 색은 부모 글씨색을 따라가므로 따로 지정하지 않는다 -->
<button class="btn btn-md btn-primary">
  <svg class="icon"><use href="#plus-outlined"></use></svg>추가
</button>
```

> **`icons.svg` 를 `<use href="icons.svg#id">` 로 직접 참조하지 말 것.**
> `file://` 로 열면(HTML 파일을 더블클릭) 브라우저가 외부 SVG 참조를 차단해 아이콘이 전부 사라진다.
> 로컬 서버로 열 때만 동작하므로 눈치채기 어렵다. `icons.js` 는 문서 안에 심으므로 두 경우 모두 된다.
> `<body>` 바로 뒤에 둬야 동기 주입돼서, 뒤따르는 인라인 스크립트도 심볼을 볼 수 있다.

- **이름 규칙:** PascalCase 파일명 → kebab-case 심볼 id
  (`HomeOutlined.svg` → `home-outlined`, `HeartTwoTone.svg` → `heart-twotone`)
- **테마별 개수:** outlined 443 · filled 231 · twotone 151 · 커스텀 8 (총 833)
  커스텀: `divider` `form-document` `jober-wordmark` `kakao` `linear-question` `paper-airplane-document`
  `remove-duplicate` `tooltip`
- **색:** 단색 아이콘은 `currentColor`라 부모 `color`를 따라간다. 아이콘에 색을 직접 칠하지 말고
  **부모 요소의 `color`를 바꾼다.**
- **TwoTone:** 액센트가 `--icon-accent`(기본 primary)라 브랜드 색을 바꾸면 함께 따라온다.
  지역적으로 바꾸려면 `.icon-accent-success` 등을 쓴다.
- **브랜드 아이콘(kakao):** 고정색이라 `currentColor`의 영향을 받지 않는다.
- **`jober-wordmark`:** 자버 워드마크(2023 로고 파일). 단색 `currentColor` 라 프로필 타일은
  `--color-jober` 바탕 + `--color-on-jober` 글씨색으로 감싸서 쓴다. 비율 764:250.
- 전체 목록은 `preview.html`의 Icons 섹션에서 검색·복사할 수 있다.

> **미처리 3개** — `간단히 추가` `엑셀 추가` `중복없이 추가` 는 SVG 안에 래스터 비트맵이
> 박혀 있어(각 240~275KB) 스프라이트에서 제외했다. 쓰려면 Figma에서 벡터로 다시 export 해야 한다.

## ✅ 좋은 예 / ❌ 나쁜 예
- ❌ `<button style="background:#1890ff; height:32px">` — 하드코딩
- ✅ `<button class="btn btn-md btn-primary">`
- ❌ `style="color: var(--palette-blue-6)"` — palette 직접 참조
- ✅ `style="color: var(--color-primary)"`
- ❌ `<svg class="icon" style="fill:#ff4d4f">` — 아이콘에 색 직접 지정
- ✅ 부모의 `color`를 바꾼다 (`<span style="color:var(--color-error)">`)

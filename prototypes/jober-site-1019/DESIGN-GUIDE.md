# 자버 사이트(v3) 디자인 가이드 — 새 페이지 만들 때

이 폴더(`prototypes/jober-site-1019`)의 스타일로 새 페이지를 만들 때 읽는 문서다. 미리보기: https://jober-site.vercel.app

## 1. 시작하는 법

1. **비슷한 기존 페이지를 복사해서 시작한다.** 새로 짜지 않는다.
   - 서비스 상세 → `services/hr/index.html` (카드형) 또는 `services/alimtalk/index.html` (단계·사례형)
   - 표·계산이 있는 페이지 → `pricing/index.html`
   - 목록·소개 → `stories/index.html`, `about/index.html`
2. 상단바(`<header class="hd">`)와 푸터(`<footer class="ft">`)는 **복사한 그대로 둔다.** 메뉴·푸터 항목을 바꾸면 모든 페이지 HTML을 같이 바꾼다.
3. CSS 로드 순서 (하위 페이지):
   ```
   Pretendard CDN → style.css → brand.css → (페이지 css) → type.css → v3-shell.css → v3-sub.css → (새 페이지 전용 css)
   ```
   새 페이지 스타일은 **전용 css 파일 하나**(예: `pricing.css`)를 만들어 맨 마지막에 넣는다. `v3-sub.css`가 앞 파일들을 `!important`로 덮으니, 제목 크기 등은 필요하면 `!important`로 맞춘다.
4. 맨 아래 `<script src="../../v3-fall.js"></script>` 유지 (헤더 드롭다운, 모바일 메뉴, 떨어지는 푸터 로고).
5. 아이콘은 `jober-icons.js` 스프라이트: `<svg class="ji"><use href="#arrow-right-outlined"></use></svg>`. 바깥 화살표는 `class="ji ji-ne"`.

## 2. 색

`v3-shell.css` 변수만 쓴다. 새 색을 지어내지 않는다.

| 변수 | 값 | 쓰임 |
|---|---|---|
| `--ink` | #111 | 글자·검정 버튼 |
| `--sub` | #5B6170 | 리드 문구 |
| `--body` | #4B5563 | 카드 본문 |
| `--soft` | #F4F4F6 | 회색 카드·알약 |
| `--lime` #ECFE75 · `--green` #75FBA2 · `--peri` #96AFF9 · `--lilac` #CEADF9 · `--peach` #F3AC6B · `--mint` #A1FCCF | | 서비스 카드 면색 (알림톡 lime, 전자계약 green, 인사관리 peri, 고객관리 peach, 커넥티아 lilac) |
| 자버 파랑 `--jb-primary` | #1890FF | 화면 목업 속 UI, 고른 탭 글자 |
| 키워드 파랑 | #3F5BC4 | 카드 안 키워드·텍스트 링크 |
| 파랑 그라데이션 | `linear-gradient(135deg,#6F8EF3 0%,var(--peri) 60%,#BCCDFF 100%)` | 아이콘 타일, 배너 |

- 요금제·정보성 페이지는 **형광 노랑(라임)을 쓰지 않는다.** 파랑 중심으로.
- 전부 무채색이면 중요한 게 안 보인다. 파스텔 면 + 파랑 포인트로 위계를 만든다.

## 3. 글자 (Pretendard)

| 요소 | 크기 / 굵기 | 비고 |
|---|---|---|
| 페이지 큰 제목 h1 | 56px / 600 | 태블릿 48, 모바일 36 · 자간 -0.045em |
| 섹션 제목 h2 | 44px / 600 | 모바일 30 · 자간 -0.035em |
| 카드 제목 h3 | 24px / 600 | |
| 단계 카드 제목 | 18px / 600 | |
| 리드 문구 | 19px / 400, `--sub` | |
| 카드 본문 | 16px / 400, `--body` | |
| 카드 위 작은 태그 | 14~15px, `--sub` | |

- 제목·라벨은 **600**. 700은 큰 숫자(가격 등)에만.
- 줄바꿈은 `<span class="ph">어절 묶음</span>`으로 묶어 단어 중간에서 끊기지 않게 한다. 긴 인용문은 `word-break:keep-all`.
- 문장 끝 마침표: 카드 제목·리드는 보통 없음, 인용(고객 사례)은 있음. 원문을 따른다.

## 4. 컴포넌트 (있는 것 먼저 쓴다)

- **버튼**: `.pill` (테두리) · `.pill.dark` (검정) · `.pill.sm` (작게). 외부 링크는 `target="_blank" rel="noopener noreferrer"` + `ji-ne` 화살표.
- **흰 카드 (인사관리 카드)**: 흰 바탕, `border-radius:var(--r-card)`(32px), 그림자 `0 24px 56px rgba(31,42,90,.09), 0 4px 14px rgba(31,42,90,.05)`, 왼쪽 위 52px 파랑 그라데이션 아이콘 타일, 제목 → 본문 → 파랑 키워드(`|` 구분) → 오른쪽 아래 회색 알약 "자세히 보기".
- **단계 카드 (알림톡)**: `--soft` 회색 카드, 위에 큰 번호 `01`(48px, `--peri`), 제목 18px, 본문 16px.
- **서비스 카드 (홈)**: 파스텔 면 + 위쪽 화면 목업(`.mock-stage` 안 330×306 화면을 축소) + 태그·제목·본문·`.pill sm`.
- **검정 큰 섹션**: `#111` 배경, 라운드 40px, 흰 글자, 회색 보조 `#9C9CA3`.
- **CTA 상자**: `.ct-cta-box` (그라데이션 면, 라운드 40px, 제목 + 버튼 2개).
- **FAQ**: `.faq-section details` — 위아래 구분선 목록, 아코디언.
- **탭**
  - 페이지 단위 전환: 밑줄 탭 (고른 탭 파란 글자 + 파란 밑줄)
  - 같은 영역 안 옵션 전환: 회색 판 세그먼트 탭 (고른 칸만 흰색). **칸 너비는 똑같이.**
  - 위아래로 탭이 겹치면 두 종류를 섞어 구분한다.
- **배지·태그**: 작은 둥근 알약. 혜택 강조는 화살표 모양 태그.
- **화면 목업**: 실제 서비스 화면처럼 HTML로 그린다(가짜 데이터: 김자버, 홍길동, 한빛제조 등). 캡처 이미지는 자르지 않고 둥근 판 안에 여백을 두고 넣는다.

## 5. 꼭 지킬 것

1. **카드 안에 카드 금지.** 배경 있는 상자 안에 또 상자를 넣지 않는다. 안쪽 구분은 구분선·여백·글자 크기로. (예외: 미리보기 이미지·스크린샷은 카드 안 둥근 판 OK)
2. **설명용 작은 글씨를 임의로 넣지 않는다.** 라벨 밑 힌트·ⓘ 안내는 기본 "없음". 꼭 필요하면 먼저 물어본다.
3. **기존 페이지 컴포넌트를 가져다 쓴다.** 새 색·새 카드 모양을 지어내지 않는다.
4. 여백은 4의 배수, 카드 라운드 32px(작은 판 20~24px), 섹션 사이 120~128px(모바일 80~88px).
5. 줄을 맞춰야 하는 곳(로고가 나란히 있는 카드 등)은 정렬이 맞는 형태를 쓴다. 예: 펠로우즈는 다른 로고와 나란하면 가로형, 단독 히어로만 세로형.
6. 하단 고정 버튼은 그라데이션으로 눈에 띄게, 푸터가 보이면 사라지게.
7. PC 1440 · 태블릿 900 · 모바일 375에서 가로 스크롤 없이 확인한다.

## 6. 링크 규칙

- 도입 문의: `https://jober.io/wall-write-document/7f720549-2d0c-439b-8bfd-8da25e840bfb` (커넥티아만 전화 안내 창 `data-call`)
- 회원가입: `https://jober.io/sign-up`
- 고객관리(CRM): `https://jober-crm-flex.laadt.chatgpt.site/` (새 탭)
- 서비스 소개서: `https://jober-service-guides.neocsv.chatgpt.site/`
- 블로그: `https://blog.naver.com/joberteam`

## 7. 확인·전달

- 미리보기: 이 폴더에서 `python3 -m http.server 4600` → `http://localhost:4600/`
- 화면은 직접 렌더링해서 PC·모바일 스크린샷으로 확인한 뒤 보여준다.
- 작업 원본은 `connectia-design/prototypes/jober-site-1019`(홈 파일명 `index-v3.html`), 전달본은 이 폴더(홈 `index.html`). 원본에서 고치면 `index-v3.html` → `index.html`로 링크를 바꿔 이 폴더에 복사한다.
- 깃허브 푸시와 배포(jober-site.vercel.app)는 요청받았을 때만 한다.

# 자버 사이트 개편 (jober.io) — 정적 HTML 시안

이 폴더만 있으면 그대로 열린다. 다른 폴더(tokens.css 등)에 의존하지 않는다.

## 페이지

| 경로 | 화면 |
|---|---|
| `index.html` | 홈 |
| `services/alimtalk/` | 카카오 알림톡 |
| `services/contract/` | 전자계약 |
| `services/hr/` | 인사관리 |
| `services/attendance/` | 근태 관리 상세 (인사관리 근태 관리 카드의 자세히 보기 → 실제 사이트 `jober.io/tour/attendance` 자리) |
| `services/connectia/` | 커넥티아 (행사·커뮤니티) |
| `services/fellows/` | 펠로우즈 (모임·캠퍼스) |
| `stories/` | 활용 사례 |
| `about/` | 회사 소개 |
| `pricing/` | 요금제 (전자계약·마케팅·HR 탭, `#contract` · `#marketing` · `#hr`) |

## 알림톡 AI 에이전트 랜딩 (services/alimtalk-ai, 2026-11-11 초안)

- 자버 웹의 BETA '알림톡 AI 에이전트'와 자버 MCP(https://github.com/jober-lab/jober-mcp)를 함께 소개하는 페이지. 스타일은 `alimtalk-ai.css`(`.aa-` 접두어), 레이아웃 골격은 `alimtalk.css` 재사용
- 히어로: 문자 붙여넣기 → 알림톡 생성 → '자세히 보기' → 쿠폰 페이지 애니메이션(약 13초 반복). 엑셀 섹션: 채팅창에 파일 올리면 발송까지 애니메이션. 연결 페이지 섹션: 버튼에서 쿠폰 페이지로 빛이 퍼지는 연결 효과
- 알림톡 화면은 HTML로 그림(발신자 럭키피트니스), 쿠폰 페이지는 실제 화면 캡처(`assets/alimtalk-ai/coupon.png`)
- 엑셀 업로드 이후 화면(128명 확인, 보내기, 발송 완료)은 실제 발송 화면을 확인하지 못해 설명용으로 그린 장면
- CTA 링크는 임시로 회원가입(jober.io/sign-up). 에이전트 바로가기 주소가 정해지면 교체
- 확인 필요: '3초만에 완성'(시험 시 쿠폰 페이지 생성에 15~20초 걸림)

## 상단바 '카카오 알림톡' 드롭다운 (2026-11-11)

모든 페이지 상단바의 '카카오 알림톡'을 자버 패밀리처럼 드롭다운으로 바꿈: 카카오 알림톡(전화번호만으로 보내는 단체카톡) / 알림톡 AI 에이전트 BETA. 모바일 메뉴는 `v3-fall.js`가 드롭다운의 `data-group`, `data-label`을 읽어 같은 묶음으로 만든다. 스타일은 `v3-shell.css` 하단.

## 메인 수정 시안 (index-img.html, 2026-11-11)

기존 메인(`index.html`)은 그대로 두고 별도 파일로 만든 시안이다. 확정되면 `index.html`로 바꾼다.

1. 서비스 카드 4개: 애니메이션 대신 대표 장면 정지 이미지 (`assets/svc-cards/`, @2x·@3x). 화면 이미지를 카드 글자 폭에 맞춰 가운데, '자세히 보기'는 카드 하단에 고정
2. 커넥티아·펠로우즈 카드: 펠로우즈 색 주황 → 초록, 카드 안 여백 사방 동일(PC 24px, 모바일 16px), 모바일 두 카드 높이 통일
3. 섹션 순서(PC·모바일 공통): 히어로 → 고객사 로고 2줄 → 서비스 카드 → "업종도 동네도 제각각이지만" 로고 2줄
4. 고객사 로고 줄: 이미지 `loading="lazy"` 제거. 모바일에서 lazy 로고가 늦게 떠 줄 끝이 흰색으로 끊기던 문제 (기존 `index.html`에도 있음)

스타일은 파일 `<head>` 안 `<style>` 한 곳에 모여 있다.

## 요금제 페이지

`pricing/`에 새 스타일로 옮겼다. 전자계약·마케팅 탭의 문구·구성은 최신 요금제 시안(2026-09-22 `jober-pricing-home`)을, HR 탭은 기존 페이지(`jober.io/tour/pricing?type=hr`) 내용을 따른다.

- 충전 플랜에서 금액을 고르면 오른쪽 계산 상자(발송 가능 건수·정가·실제 단가)가 바뀐다. 알림톡/계약문서 기준으로 전환할 수 있다.
- HR 탭은 월 결제/약정 할인 요금(12개월 이상) 버튼으로 금액이 바뀐다.
- 하단에 떠 있는 회원가입 버튼은 탭에 따라 문구가 바뀌고(HR 탭에서는 숨김), 푸터가 보이면 사라진다. 모바일에서 충전 플랜이 화면에 있는 동안에는 계산 요약이 버튼 위에 붙는다.
- 회원가입 버튼과 HR "선택하기"는 `jober.io/sign-up`으로 연결된다(HR "선택하기"는 임시).
- 미리보기 이미지·혜택 배너 일러스트는 `assets/pricing/`에 있다.

## 파일

- `v3-shell.css` · `v3-fall.js` — 모든 페이지 공통: 헤더(자버 패밀리 드롭다운, 모바일 햄버거 메뉴), 푸터(떨어지는 로고), 전화 문의 창, 스크롤 등장 애니메이션
- `v3.css` — 홈 전용
- `v3-sub.css` — 하위 페이지 전용 (마지막에 로드되어 `style.css` · `brand.css` · `type.css` · 페이지별 css를 덮는다)
- `pricing.css` — 요금제 페이지
- `attendance.css` — 근태 관리 상세 (출퇴근 기록·폴더·엑셀 화면 목업 포함)
- `contract.css` · `alim-anim.css` · `hr-anim.css` — 서비스 카드·히어로의 화면 애니메이션
- `jober-icons.js` — 아이콘 스프라이트(jober-design 아이콘 중 쓰는 것만)
- `assets/` — 이미지·로고·폰트

## 외부로 나가는 링크 (확정 전 임시 포함)

- 도입 문의(알림톡·전자계약·인사관리·공통) → 알림톡 문의 폼 `jober.io/wall-write-document/7f720549-…` — 폼 통일 후 주소만 교체
- 커넥티아 도입 문의 → 전화 안내 창 (02-6402-0508, 평일 10:00–18:00)
- 자버 블로그(홈 하단 알약, 푸터) → `blog.naver.com/joberteam`
- 서비스 소개서(하위 페이지 하단 "서비스 소개서 보기" 알약, 푸터 "서비스 소개서") → `jober-service-guides.neocsv.chatgpt.site`
- 커넥티아 바로가기 → `connectia.bio` · 펠로우즈 → `fellows-moim.vercel.app`
- 고객관리(CRM)(상단 메뉴, 푸터, 홈 서비스 카드) → `jober-crm-flex.laadt.chatgpt.site` (새 탭) — 정식 주소가 정해지면 교체
- 요금제 페이지: 엔터프라이즈·HR 도입 문의 → `jober.io/wall-write-document/27863066-…`, 전용 템플릿 신청 → `jober.io/wall-write-document/97eb3e97-…`, 채널 연동 가이드 → `docs.channel.io/jober_guide`, 공용 템플릿 → `jober.io/tour/preview-alimtalk`, 서식 샘플 → `jober.io/tour/documentForm`

## 푸터 회사 정보

모든 페이지 푸터 하단: 주식회사 자버 · 대표 이동욱 · 서울 마포구 양화로 186, 4층 · 사업자등록번호 246-81-00740 · 통신판매업신고 2017-서울마포-2205 · 02-6402-0508

## 미리보기

```
python3 -m http.server 4600
```
`http://localhost:4600/` 로 연다. (파일을 직접 열어도 되지만 일부 스크롤 애니메이션은 서버로 여는 쪽이 정확하다)

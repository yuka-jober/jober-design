# 자버 사이트 개편 (jober.io) — 정적 HTML 시안

이 폴더만 있으면 그대로 열린다. 다른 폴더(tokens.css 등)에 의존하지 않는다.

## 페이지

| 경로 | 화면 |
|---|---|
| `index.html` | 홈 |
| `services/alimtalk/` | 카카오 알림톡 |
| `services/contract/` | 전자계약 |
| `services/hr/` | 인사관리 |
| `services/connectia/` | 커넥티아 (행사·커뮤니티) |
| `services/fellows/` | 펠로우즈 (모임·캠퍼스) |
| `stories/` | 활용 사례 |
| `about/` | 회사 소개 |
| `pricing/` | 요금제 (전자계약·마케팅·HR 탭, `#contract` · `#marketing` · `#hr`) |

## 요금제 페이지

`pricing/`에 새 스타일로 옮겼다. 문구·구성은 최신 요금제 시안(2026-09-22 `jober-pricing-home`)을, HR 탭은 기존 페이지(`jober.io/tour/pricing?type=hr`) 내용을 따른다. HR 탭은 월 결제/약정 할인 요금 버튼으로 금액이 바뀐다. 충전 플랜에서 금액을 고르면 오른쪽 계산(발송 가능 건수·실제 단가, 알림톡/계약문서 기준 전환)이 바뀐다. 하단에 떠 있는 회원가입 버튼과 HR "선택하기"는 회원가입(`jober.io/sign-up`)으로 연결된다(HR "선택하기"는 임시).

## 파일

- `v3-shell.css` · `v3-fall.js` — 모든 페이지 공통: 헤더(자버 패밀리 드롭다운, 모바일 햄버거 메뉴), 푸터(떨어지는 로고), 전화 문의 창, 스크롤 등장 애니메이션
- `v3.css` — 홈 전용
- `v3-sub.css` — 하위 페이지 전용 (마지막에 로드되어 `style.css` · `brand.css` · `type.css` · 페이지별 css를 덮는다)
- `pricing.css` — 요금제 페이지
- `contract.css` · `alim-anim.css` · `hr-anim.css` — 서비스 카드·히어로의 화면 애니메이션
- `jober-icons.js` — 아이콘 스프라이트(jober-design 아이콘 중 쓰는 것만)
- `assets/` — 이미지·로고·폰트

## 외부로 나가는 링크 (확정 전 임시 포함)

- 도입 문의(알림톡·전자계약·인사관리·공통) → 알림톡 문의 폼 `jober.io/wall-write-document/7f720549-…` — 폼 통일 후 주소만 교체
- 커넥티아 도입 문의 → 전화 안내 창 (02-6402-0508, 평일 10:00–18:00)
- 자버 블로그(홈 하단 알약, 푸터) → `blog.naver.com/joberteam`
- 서비스 소개서(하위 페이지 하단 "서비스 소개서 보기" 알약, 푸터 "서비스 소개서") → `jober-service-guides.neocsv.chatgpt.site`
- 커넥티아 바로가기 → `connectia.bio` · 펠로우즈 → `fellows-moim.vercel.app`

## 미리보기

```
python3 -m http.server 4600
```
`http://localhost:4600/` 로 연다. (파일을 직접 열어도 되지만 일부 스크롤 애니메이션은 서버로 여는 쪽이 정확하다)

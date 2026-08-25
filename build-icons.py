#!/usr/bin/env python3
"""
Figma에서 export 한 SVG 아이콘을 스프라이트 하나로 합친다.
아이콘을 추가/수정한 뒤 이 스크립트를 다시 실행하면 된다.

    python3 build-icons.py

입력  : icon/**/*.svg   (Figma export 원본, 건드리지 않는다)
출력  : assets/icons.svg  — 스프라이트. http 로 서빙할 때 <use href="icons.svg#id">
        assets/icons.js   — 같은 스프라이트를 문서에 심어주는 스크립트.
                            file:// 로 열면 외부 SVG 참조가 차단되므로 이쪽을 쓴다.

변환 규칙
  fill="black" fill-opacity="0.85"  →  currentColor       (부모 글씨색을 따라감)
  fill="#1890FF"                    →  var(--icon-accent)  (TwoTone 액센트)
  브랜드 고정색(카카오 등)           →  그대로 둔다
  내부 id(clipPath 등)              →  파일명으로 prefix 해 충돌 방지
  래스터 이미지 내장 파일            →  제외하고 목록으로 보고
"""
import re, sys
from pathlib import Path

BASE = Path(__file__).parent
SRC = BASE / 'icon'
OUT = BASE / 'assets' / 'icons.svg'
OUT_JS = BASE / 'assets' / 'icons.js'

# 브랜드 가이드상 고정돼야 하는 색 — currentColor 로 바꾸지 않는다
BRAND_COLORS = {'#FAE100', '#371D1E'}

def to_kebab(name: str) -> str:
    name = name.replace('TwoTone', 'Twotone')
    name = re.sub(r'(?<!^)(?=[A-Z])', '-', name)
    return re.sub(r'[\s_]+', '-', name).lower()

def round_nums(s: str, nd=2) -> str:
    """Figma 가 뱉는 과한 좌표 정밀도를 줄인다."""
    def r(m):
        v = round(float(m.group(0)), nd)
        return str(int(v)) if v == int(v) else str(v)
    return re.sub(r'-?\d+\.\d+', r, s)

def build():
    files = sorted(SRC.rglob('*.svg'))
    if not files:
        sys.exit(f'ERROR: {SRC} 에 svg 가 없습니다.')

    symbols, skipped, brand = [], [], []
    seen = {}

    for f in files:
        raw = f.read_text(encoding='utf-8')

        # 래스터 비트맵이 박힌 파일은 벡터 심볼로 만들 수 없다
        if '<image' in raw or 'xlink:href="data:image' in raw or 'pattern' in raw:
            skipped.append(f.name)
            continue

        icon_id = to_kebab(f.stem)
        if icon_id in seen:
            skipped.append(f'{f.name} (id 중복: {icon_id})')
            continue
        seen[icon_id] = f.name

        vb = re.search(r'viewBox="([^"]*)"', raw)
        viewbox = vb.group(1) if vb else '0 0 24 24'

        # <svg> 껍데기를 벗기고 알맹이만 꺼낸다
        body = re.sub(r'^.*?<svg[^>]*>', '', raw, flags=re.S)
        body = re.sub(r'</svg>\s*$', '', body, flags=re.S).strip()

        # 내부 id 를 아이콘별로 prefix — 스프라이트 안에서 충돌하면 안 된다
        for old in set(re.findall(r'id="([^"]+)"', body)):
            new = f'{icon_id}-{old}'
            body = body.replace(f'id="{old}"', f'id="{new}"')
            body = body.replace(f'url(#{old})', f'url(#{new})')

        has_brand = any(c in body for c in BRAND_COLORS)
        if has_brand:
            brand.append(icon_id)
        else:
            # 단색 아이콘 — 부모 글씨색을 따라가게
            body = body.replace('fill="black" fill-opacity="0.85"', 'fill="currentColor"')
            body = body.replace('fill="black"', 'fill="currentColor"')
            # TwoTone 액센트 — 기본은 브랜드 primary, CSS 로 덮어쓸 수 있다
            body = re.sub(r'fill="#1890FF"', 'fill="var(--icon-accent, currentColor)"',
                          body, flags=re.I)

        body = round_nums(body)
        body = re.sub(r'\n\s*', '', body)
        symbols.append(f'<symbol id="{icon_id}" viewBox="{viewbox}">{body}</symbol>')

    sprite = ('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n'
              + '\n'.join(symbols) + '\n</svg>\n')

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(sprite, encoding='utf-8')

    # file:// 에서도 쓰려면 외부 참조가 아니라 문서 안에 심어야 한다
    lit = sprite.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    OUT_JS.write_text(
        '/* 자동 생성 — build-icons.py 로 만든다. 직접 수정하지 말 것. */\n'
        '(function () {\n'
        '  var sprite = `' + lit + '`;\n'
        '  function inject() {\n'
        '    document.body.insertAdjacentHTML("afterbegin", sprite);\n'
        '  }\n'
        '  // <body> 바로 뒤에 두면 동기 주입돼, 뒤따르는 인라인 스크립트도 심볼을 볼 수 있다.\n'
        '  // <head> 에 둔 경우엔 body 가 생길 때까지 기다린다.\n'
        '  if (document.body) { inject(); }\n'
        '  else { document.addEventListener("DOMContentLoaded", inject); }\n'
        '})();\n', encoding='utf-8')

    kb = OUT.stat().st_size / 1024
    kbj = OUT_JS.stat().st_size / 1024
    print(f'심볼 {len(symbols)}개  →  {OUT.relative_to(BASE)} ({kb:.0f} KB) '
          f'+ {OUT_JS.relative_to(BASE)} ({kbj:.0f} KB)')
    print(f'브랜드 고정색 유지: {", ".join(brand) if brand else "없음"}')
    if skipped:
        print(f'\n제외 {len(skipped)}개 (래스터 이미지 내장 — Figma 에서 벡터로 다시 export 필요):')
        for s in skipped:
            print(f'  - {s}')

if __name__ == '__main__':
    build()

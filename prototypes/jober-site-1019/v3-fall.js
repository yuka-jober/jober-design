/* .fall-group 안의 [data-fall] 요소가 스크롤로 보이면 위에서 와르르 떨어진다 (v3-shell.css)
   그룹마다 data-fall-at(보여야 하는 비율, 기본 .3)·data-fall-margin(화면 아래쪽 여유)으로 시작 시점을 늦출 수 있다 */
(function(){
  var gs=document.querySelectorAll('.fall-group');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
  gs.forEach(function(g){
    g.classList.add('will-fall');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.disconnect();}});},{threshold:parseFloat(g.dataset.fallAt||.3),rootMargin:g.dataset.fallMargin||'0px'});
    io.observe(g);
  });
})();

/* 상단바 '자버 패밀리' 버튼: 열림 상태를 화면 읽기 도구에 알린다 */
(function(){
  document.querySelectorAll('.hd-dd').forEach(function(dd){
    var btn=dd.querySelector('.hd-dd-btn');
    function sync(open){btn.setAttribute('aria-expanded',open?'true':'false');}
    dd.addEventListener('mouseenter',function(){sync(true);});
    dd.addEventListener('mouseleave',function(){if(!dd.contains(document.activeElement))sync(false);});
    dd.addEventListener('focusin',function(){sync(true);});
    dd.addEventListener('focusout',function(e){if(!dd.contains(e.relatedTarget))sync(false);});
    dd.addEventListener('keydown',function(e){if(e.key==='Escape'){dd.classList.add('is-closed');btn.focus();sync(false);}});
    dd.addEventListener('mouseleave',function(){dd.classList.remove('is-closed');});
    dd.addEventListener('focusout',function(e){if(!dd.contains(e.relatedTarget))dd.classList.remove('is-closed');});
    btn.addEventListener('click',function(){dd.classList.toggle('is-closed');sync(!dd.classList.contains('is-closed'));});
  });
})();

/* [data-call] 버튼: 전화 문의 안내 창을 띄운다 (전화를 걸 수 있는 기기에선 '전화 걸기'로 바로 연결) */
(function(){
  var btns=document.querySelectorAll('[data-call]'); if(!btns.length) return;
  var wrap=document.createElement('div');
  wrap.className='call-ov'; wrap.hidden=true;
  wrap.innerHTML='<div class="call-box" role="dialog" aria-modal="true" aria-labelledby="call-t">'
    +'<button class="call-x" type="button" aria-label="닫기">×</button>'
    +'<p class="call-t" id="call-t">전화로 문의해 주세요</p>'
    +'<a class="call-num" href="tel:0264020508">02-6402-0508</a>'
    +'<p class="call-time">평일 10:00 – 18:00</p>'
    +'<a class="call-go" href="tel:0264020508">전화 걸기</a></div>';
  document.body.appendChild(wrap);
  var last=null;
  function close(){wrap.hidden=true;document.body.style.overflow='';if(last)last.focus();}
  btns.forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();last=b;wrap.hidden=false;document.body.style.overflow='hidden';wrap.querySelector('.call-x').focus();});});
  wrap.addEventListener('click',function(e){if(e.target===wrap)close();});
  wrap.querySelector('.call-x').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!wrap.hidden)close();});
})();

/* 모바일 메뉴: 960px 아래에서 상단 메뉴가 접히면 햄버거 버튼으로 연다. 메뉴 내용은 상단바(.hd-nav·.hd-act)에서 그대로 가져온다 */
(function(){
  var hd=document.querySelector('.hd'); if(!hd) return;
  var nav=hd.querySelector('.hd-nav'), act=hd.querySelector('.hd-act'); if(!nav) return;
  var btn=document.createElement('button');
  btn.className='hd-burger'; btn.type='button'; btn.setAttribute('aria-label','메뉴 열기'); btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','m-menu');
  btn.innerHTML='<span></span><span></span><span></span>';
  (act||hd.querySelector('.w')).appendChild(btn);
  var panel=document.createElement('div'); panel.className='m-menu'; panel.id='m-menu'; panel.hidden=true;
  var html='<nav class="m-menu-nav" aria-label="모바일 메뉴">';
  [].forEach.call(nav.children,function(el){
    if(el.classList.contains('hd-dd')){
      html+='<p class="m-menu-group">자버 패밀리</p>';
      el.querySelectorAll('.hd-dd-menu a').forEach(function(a){html+='<a class="m-menu-sub" href="'+a.getAttribute('href')+'"'+(a.target?' target="_blank" rel="noopener noreferrer"':'')+'>'+(/connectia/.test(a.getAttribute('href'))?'커넥티아':/fellows/.test(a.getAttribute('href'))?'펠로우즈':a.querySelector('img').alt)+'</a>';});
    } else if(el.tagName==='A'){
      html+='<a href="'+el.getAttribute('href')+'"'+(el.target?' target="_blank" rel="noopener noreferrer"':'')+(el.hasAttribute('aria-current')?' aria-current="page"':'')+'>'+el.textContent.trim()+'</a>';
    }
  });
  html+='</nav>';
  var ctas=act?[].filter.call(act.querySelectorAll('a.pill'),function(a){return !a.classList.contains('dark');}):[];
  if(ctas.length){html+='<div class="m-menu-act">';ctas.forEach(function(a){html+=a.outerHTML.replace('pill sm','pill');});html+='</div>';}
  panel.innerHTML=html; hd.appendChild(panel);
  // 패널 안 전화 버튼도 전화 안내 창으로
  panel.querySelectorAll('[data-call]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var src=document.querySelector('.hd-act [data-call]');if(src)src.click();});});
  function set(open){panel.hidden=!open;btn.setAttribute('aria-expanded',open?'true':'false');btn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');btn.classList.toggle('is-open',open);document.body.classList.toggle('m-menu-open',open);}
  btn.addEventListener('click',function(){set(panel.hidden);});
  panel.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){set(false);btn.focus();}});
  window.addEventListener('resize',function(){if(window.innerWidth>960&&!panel.hidden)set(false);});
})();

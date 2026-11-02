const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navlinks');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  nav.classList.toggle('open', open);
});
document.addEventListener('click', e => {
  document.querySelectorAll('header details[open]').forEach(d => { if (!d.contains(e.target)) d.open = false; });
});
document.addEventListener('keydown', e => {
  if(e.key !== 'Escape') return;
  document.querySelectorAll('header details[open]').forEach(d => d.open = false);
  if(toggle?.getAttribute('aria-expanded') === 'true') {toggle.click(); toggle.focus();}
});
const selected = new URLSearchParams(location.search).get('service');
document.querySelectorAll('[data-service]').forEach(card => { if(card.dataset.service === selected) {card.classList.add('selected');const label=document.createElement('span');label.className='selected-label';label.textContent='선택한 서비스';card.prepend(label);} });
document.querySelectorAll('nav > a').forEach(a => {if(a.pathname === location.pathname) a.setAttribute('aria-current','page');});

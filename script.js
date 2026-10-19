
const LIMIT = 4, KEY = 'kafija-v1';
const $ = id => document.getElementById(id);
const today = () => new Date().toISOString().slice(0,10);

function load(){
  try{ const d = JSON.parse(localStorage.getItem(KEY)); return d && typeof d==='object' ? d : {}; }
  catch{ return {}; }
}
let data = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(data));
const n = () => data[today()] || 0;

function render(){
  const c = n();
  $('count').textContent = c;
  $('cups').textContent  = '☕'.repeat(Math.min(c, 12)) + (c > 12 ? ` +${c-12}` : '');
  $('fill').style.width  = Math.min(c / LIMIT * 100, 100) + '%';

  const [col, txt] = c < LIMIT ? ['--green','Droši']
                   : c === LIMIT ? ['--yellow','Robeža sasniegta']
                   : ['--red', `Virs robežas (+${c-LIMIT})`];
  $('fill').style.background = getComputedStyle(document.documentElement).getPropertyValue(col);
  $('dot').style.background  = getComputedStyle(document.documentElement).getPropertyValue(col);
  $('status').textContent    = txt;

  const days = [...Array(7)].map((_,i)=>{
    const d = new Date(); d.setDate(d.getDate() - (6-i));
    return d.toISOString().slice(0,10);
  });
  const max = Math.max(LIMIT, ...days.map(d=>data[d]||0));
  $('hist').innerHTML = days.map(d=>{
    const v = data[d]||0;
    return `<div class="col"><div class="stick" style="height:${v/max*70}px;background:${v>LIMIT?'var(--red)':v===LIMIT?'var(--yellow)':'var(--green)'}"></div>${d.slice(8)}.${d.slice(5,7)}</div>`;
  }).join('');
}

$('add').onclick  = () => { data[today()] = n() + 1; save(); render(); };
$('undo').onclick = () => { if(n()>0){ data[today()] = n()-1; save(); render(); } };
$('clear').onclick= () => { if(confirm('Dzēst šodienas ierakstu?')){ delete data[today()]; save(); render(); } };

render();
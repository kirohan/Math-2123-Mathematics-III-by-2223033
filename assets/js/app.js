
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement;
const savedTheme=localStorage.getItem('math2123-theme'); if(savedTheme) root.dataset.theme=savedTheme;
$$('[data-theme-toggle]').forEach(b=>b.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('math2123-theme',root.dataset.theme)});
const menu=$('[data-mobile-menu]'); $$('[data-menu-toggle]').forEach(b=>b.onclick=()=>menu?.classList.toggle('open'));
// Progress
const boxes=$$('[data-progress]'); function updateProgress(){let n=0;boxes.forEach(b=>{const k='math2123-set-'+b.dataset.progress;b.checked=localStorage.getItem(k)==='1';if(b.checked)n++});const pct=Math.round(n/8*100);const ring=$('[data-progress-ring]');if(ring)ring.style.setProperty('--p',(pct*3.6)+'deg');const num=$('[data-progress-number]');if(num)num.textContent=pct+'%';const count=$('[data-progress-count]');if(count)count.textContent=`${n} / 8 sets`;}
boxes.forEach(b=>b.addEventListener('change',()=>{localStorage.setItem('math2123-set-'+b.dataset.progress,b.checked?'1':'0');updateProgress()}));updateProgress();
// TOC + heading anchors
const toc=$('[data-auto-toc]'); if(toc){$$('.document-content h1,.document-content h2,.document-content h3').forEach(h=>{if(!h.id)h.id=h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-');const a=document.createElement('a');a.href='#'+h.id;a.dataset.level=h.tagName.slice(1);a.textContent=h.textContent.trim().slice(0,84);toc.appendChild(a);const al=document.createElement('a');al.href='#'+h.id;al.className='anchor-link';al.textContent='#';h.appendChild(al);});}
// Back to top
const topBtn=$('[data-to-top]');window.addEventListener('scroll',()=>topBtn?.classList.toggle('show',scrollY>700));if(topBtn)topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
// Solutions filter
const sf=$('#solutionFilter'); if(sf){sf.addEventListener('input',()=>{const q=sf.value.toLowerCase().trim();$$('.question-card').forEach(c=>{const hit=!q||c.textContent.toLowerCase().includes(q);c.style.display=hit?'':'none';if(q&&hit)c.open=true;});});$$('[data-filter-target]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.filterTarget)?.scrollIntoView({behavior:'smooth'}));}
// Global search
const modal=$('[data-search-modal]'), input=$('[data-search-input]'), results=$('[data-search-results]'); let index=[];fetch('assets/js/search-index.json').then(r=>r.json()).then(x=>index=x).catch(()=>{});
function openSearch(){if(!modal)return;modal.hidden=false;setTimeout(()=>input?.focus(),20)}function closeSearch(){if(modal)modal.hidden=true}
$$('[data-search-open]').forEach(b=>b.onclick=openSearch);$$('[data-search-close]').forEach(b=>b.onclick=closeSearch);modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}if(e.key==='Escape')closeSearch()});
input?.addEventListener('input',()=>{const q=input.value.toLowerCase().trim();if(!q){results.innerHTML='<div class="search-hint">Try “convolution”, “A2”, “orthogonal”, “backlog”, or “surface flux”.</div>';return}const words=q.split(/\s+/);const found=index.map(x=>{const hay=(x.title+' '+x.text+' '+x.tags).toLowerCase();let score=words.reduce((s,w)=>s+(hay.includes(w)?1:0),0);if(x.title.toLowerCase().includes(q))score+=3;return {...x,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,18);results.innerHTML=found.length?found.map(x=>`<a class="search-result" href="${x.url}"><b>${x.title}</b><small>${x.text}</small></a>`).join(''):'<div class="search-hint">No match. Try a broader term.</div>';});
// PWA
if('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));

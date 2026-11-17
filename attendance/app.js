
const D=window.__BOOT;
const BASE=JSON.stringify(D.classes);
let tab='att',day=0,ci=0,over='';
let P={S:{},T:{},B:{},dirty:{},url:'',by:'',last:0,ops:{},dops:{}};
try{P=Object.assign(P,JSON.parse(localStorage.getItem('att5_'+window.__K)||'{}'))}catch(e){}
P.url='https://script.google.com/macros/s/AKfycbw5KjXntvX_oraaN0MSvdHD_6u9J6yC3OUUzI6A1n5ZKW5tFXDXjFVEsGAU-k2hsKNp/exec';
const S=P.S,$=id=>document.getElementById(id);
const persist=()=>{try{localStorage.setItem('att5_'+window.__K,JSON.stringify(P))}catch(e){}};
const key=(c,d)=>c+'_'+d;
if(D.only!=null){ci=D.only;if(D.classes[ci].t)P.by=D.classes[ci].t}
P.ops=P.ops||{};P.dops=P.dops||{};(D.ops||[]).forEach(o=>{if(!P.ops[o.k])P.ops[o.k]=o});
function applyAll(){
  D.classes=JSON.parse(BASE);
  Object.values(P.ops).sort((a,b)=>a.t-b.t||(a.k<b.k?-1:a.k>b.k?1:0)).forEach(o=>{
    let x;try{x=JSON.parse(o.s)}catch(e){return}
    const c=D.classes[x.c];if(!c||(D.only!=null&&x.c!==D.only))return;
    if(x.a==='add'){c.s.push([String(x.n),x.m||'',+x.f||0])}
    else{const e=c.s[x.i];if(!e)return;
      if(x.a==='out'){e[3]=+x.f;if(x.m)e[1]=x.m}
      else if(x.a==='in'){e[3]=null}
      else if(x.a==='ren'){e[0]=String(x.n)}}
  });
}
applyAll();
const get=(c,d)=>((S[key(c,d)]||'').replace(/[^hgepwc-]/g,'-')).padEnd(D.classes[c].s.length,'-').slice(0,D.classes[c].s.length);
const ent=(c,i)=>((D.classes[c]||{}).s||[])[i]||[];
const nj=(c,i,d)=>{const e=ent(c,i);return (e[2]||0)>d||(e[3]!=null&&d>=e[3])};
const PL={h:'حاضرة',g:'غائبة',e:'غائبة بإذن',p:'غادرت بإذن',w:'غادرت مع ولي الأمر',c:'غادرت باتصال','-':'—'};
const cnt=(c,d)=>{const v=get(c,d);let n=0,h=0,g=0,e=0,l=0;for(let i=0;i<v.length;i++){if(nj(c,i,d))continue;n++;const x=v[i];if('hpwc'.includes(x)&&x!=='-'){h++;if(x!=='h')l++}else if(x==='g'||x==='e'){g++;if(x==='e')e++}}return{h,g,n,e,l}};
let busy=false,st='';
function save(c,d,v){const k=key(c,d);S[k]=v;P.T[k]=Date.now();P.B[k]=P.by;P.dirty[k]=1;persist();render();sync()}
async function sync(){
  if(!P.url||busy||!navigator.onLine){badge();return}
  busy=true;st='';badge();
  try{
    const keys=Object.keys(P.dirty),oks=Object.keys(P.dops||{});
    if(keys.length||oks.length){
      const rows=keys.map(k=>{const p=k.split('_');return{k,c:D.classes[+p[0]].n,d:D.days[+p[1]],s:S[k],t:P.T[k],by:P.by}});
      const orows=oks.map(k=>{const o=P.ops[k];return o?{k,c:'قائمة الطالبات',d:'تعديل',s:o.s,t:o.t,by:P.by||'المديرة'}:null}).filter(Boolean);
      const r=await fetch(P.url,{method:'POST',body:JSON.stringify({rows:rows.concat(orows),key:D.key||''})});
      const j=await r.json();if(!j.ok||(j.bad&&j.bad.length))throw new Error('post');
      rows.forEach(x=>{if(P.T[x.k]<=x.t)delete P.dirty[x.k]});
      orows.forEach(x=>{delete P.dops[x.k]});
    }
    const r2=await fetch(P.url+(P.url.includes('?')?'&':'?')+'a=all');
    const j2=await r2.json();
    (j2.rows||[]).forEach(x=>{if(!P.dirty[x.k]&&x.t>=1791582733871&&(!P.T[x.k]||x.t>P.T[x.k])){S[x.k]=x.s;P.T[x.k]=x.t;if(x.by)P.B[x.k]=x.by}});
    if(D.key){
      const r3=await fetch(P.url+(P.url.includes('?')?'&':'?')+'a=ops&k='+encodeURIComponent(D.key));
      const j3=await r3.json();
      if(j3&&j3.ok){let ch=0;(j3.ops||[]).forEach(o=>{if(!P.ops[o.k]){P.ops[o.k]={k:o.k,s:o.s,t:o.t};ch=1}});if(ch)applyAll()}
    }
    P.last=Date.now();st='ok';
  }catch(e){st='err'}
  busy=false;persist();render();
}
function badge(){
  const n=Object.keys(P.dirty).length+Object.keys(P.dops||{}).length,e=$('sync');if(!e)return;
  e.textContent=!P.url?'📱 على هذا الجهاز فقط (المزامنة غير مضبوطة)':busy?'🔄 جارٍ المزامنة...':st==='err'?`⚠️ لا اتصال – بانتظار الإرسال: ${n}`:n?`⏳ بانتظار الإرسال: ${n}`:P.last?'🟢 متزامن '+new Date(P.last).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}):'🟢 جاهز';
}
function setv0(){return`<div class="card"><h2>إعدادات المزامنة</h2><label>اسم المعلمة</label><input id="by" onchange="P.by=this.value;persist()"><label>رابط المزامنة (Apps Script)</label><input id="u" dir="ltr" onchange="P.url=this.value.trim();persist();sync()"><button onclick="sync()" style="width:100%;margin-top:8px">مزامنة الآن</button><p class="mut" style="font-size:12px">التسجيل يُحفظ على الجوال فوراً حتى بدون إنترنت، ويُرسل تلقائياً عند توفر الاتصال.</p></div>`}
function gate(){return`<div class="card"><h2>مرحباً 👋 الصف: ${D.classes[D.only].n}</h2><label>اكتبي اسمك (اسم المعلمة)</label><input id="nm" placeholder="الاسم"><button class="on" style="width:100%;margin-top:10px" onclick="const v=$('nm').value.trim();if(v.length<2){alert('اكتبي اسمك أولاً');return}P.by=v;persist();sync();render()">ابدأ التسجيل</button></div>`}

let impMsg='';
function setv(){
  let h=setv0();
  h+=`<div class="card"><h2>رقم المديرة (لرسالة SMS)</h2><input id="ph" dir="ltr" inputmode="tel" placeholder="05XXXXXXXX" value="${esc2(P.ph||D.phone||'')}" onchange="P.ph=this.value.trim();persist()"></div>`;
  if(D.only==null)h+=`<div class="card"><h2>استيراد رسائل المعلمات (SMS)</h2><p class="mut" style="font-size:12px">انسخي الرسائل التي وصلتك والصقيها هنا (أكثر من رسالة معاً)، ثم اضغطي استيراد.</p><textarea id="imp" rows="6" dir="ltr" style="width:100%;font:inherit;padding:8px;border-radius:10px;border:1px solid var(--brd);background:var(--card);color:var(--tx)"></textarea><button class="on" style="width:100%;margin-top:8px" onclick="importSms()">استيراد</button><label style="margin-top:12px">أو استيراد ملف/ملفات استلمتِها من المعلمات (بلوتوث أو غيره):</label><input type="file" accept=".txt,text/plain" multiple onchange="importFiles(this)"><div id="impres" style="margin-top:8px;font-size:13px">${impMsg}</div></div>`;
  if(D.only==null)h+=`<div class="card"><h2>أرقام معلمات الصفوف (للتذكير)</h2>${D.classes.map((c,i)=>`<label>${c.n} – ${esc2(c.t||'')}</label><input dir="ltr" inputmode="tel" placeholder="05XXXXXXXX" value="${esc2((P.tel||{})[i]||c.tel||'')}" onchange="setTel(${i},this.value)">`).join('')}<p class="mut" style="font-size:12px">تُحفظ الأرقام على جوالك فقط، ولا تُرسل لأي جهة.</p></div>`;
  return h;
}
function esc2(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function tokens(v,c,d){const Tk={g:[],e:[],p:[],w:[],c:[]};v.split('').forEach((x,i)=>{if(nj(c,i,d))return;if(Tk[x])Tk[x].push(i+1)});return Tk}
function sendSms(){
  const n=D.classes[ci].s.length,v=get(ci,day).split('').map((x,i)=>x==='-'&&!nj(ci,i,day)?'h':x).join(''),Tk=tokens(v,ci,day);
  const ex=['e','p','w','c'].filter(k=>Tk[k].length).map(k=>' '+k+'='+Tk[k].join(',')).join('');
  const na=Tk.g.length+Tk.e.length,nl=Tk.p.length+Tk.w.length+Tk.c.length;
  const txt='ATT c='+ci+' d='+day+' n='+n+' g='+(Tk.g.join(',')||'0')+ex+' t='+Date.now()+'\n'+D.classes[ci].n+' | '+D.days[day]+' | غائبات: '+na+(Tk.e.length?' (بإذن '+Tk.e.length+')':'')+(nl?' | غادرن: '+nl:'');
  const ph=(P.ph||D.phone||'').trim();
  save(ci,day,v);
  location.href='sms:'+ph+(/iPhone|iPad/i.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(txt);
}
function importSms(){
  const txt=($('imp')||{}).value||'';const re=/ATT c=(\d+) d=(\d+) n=(\d+)([^\n]*?) t=(\d+)/g;
  let m,ok=0,bad=[],okn=[];
  while((m=re.exec(txt))){
    const c=+m[1],d=+m[2],n=+m[3],t=+m[5];
    if(!D.classes[c]||!D.days[d]||n>D.classes[c].s.length){bad.push('رسالة غير مطابقة لقائمة الصف (حدّثي قائمة الصف أولاً)');continue}
    const k=key(c,d),L=D.classes[c].s.length;
    if((P.T[k]||0)>t){bad.push(D.classes[c].n+' – '+D.days[d]+' (يوجد تسجيل أحدث)');continue}
    const v=Array(L).fill('-');for(let i=0;i<n;i++)if(!nj(c,i,d))v[i]='h';
    const tk=/([gepwcu])=([\d,]+)/g;let q;
    while((q=tk.exec(m[4]))){if(q[2]==='0')continue;q[2].split(',').forEach(x=>{const i=+x;if(i>=1&&i<=n)v[i-1]=q[1]==='u'?'-':q[1]})}
    S[k]=v.join('');P.T[k]=t;P.B[k]=D.classes[c].t||'';P.dirty[k]=1;ok++;okn.push(D.classes[c].n+' – '+D.days[d]);
  }
  persist();
  impMsg=(ok?'✅ تم استيراد '+ok+' تسجيل:<br>'+okn.join('<br>'):'لم يُستورد شيء.')+(bad.length?'<br>⚠️ تخطّيت:<br>'+bad.join('<br>'):'');
  render();sync();
}

function remind(i,d){
  P.tel=P.tel||{};P.R=P.R||{};
  const c=D.classes[i];
  let ph=(P.tel[i]||c.tel||'').trim();
  if(!ph){ph=(prompt('اكتبي رقم جوال '+(c.t||c.n)+' (يُحفظ على جوالك فقط):')||'').trim();if(!ph)return;P.tel[i]=ph}
  const txt='السلام عليكم'+(c.t?' أ. '+c.t:'')+'، لم يصلني تسجيل حضور وغياب صف '+c.n+' ليوم '+D.days[d]+'. نرجو تسجيله وإرساله في أقرب وقت. شكراً';
  P.R[i+'_'+d]=Date.now();persist();render();
  location.href='sms:'+ph+(/iPhone|iPad/i.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(txt);
}
function setTel(i,v){P.tel=P.tel||{};P.tel[i]=v.trim();persist()}

async function exportFile(){
  const c=D.classes[ci];
  const lines=['# '+c.n+' | '+(P.by||c.t||'')];
  D.days.forEach((_,j)=>{
    const q=cnt(ci,j);if(q.h+q.g===0)return;
    const v=get(ci,j),Tk=tokens(v,ci,j),u=[];
    v.split('').forEach((x,i)=>{if(!nj(ci,i,j)&&x==='-')u.push(i+1)});
    const ex=['e','p','w','c'].filter(k=>Tk[k].length).map(k=>' '+k+'='+Tk[k].join(',')).join('');
    lines.push('ATT c='+ci+' d='+j+' n='+v.length+' g='+(Tk.g.join(',')||'0')+ex+(u.length?' u='+u.join(','):'')+' t='+(P.T[key(ci,j)]||Date.now())+'  # '+D.days[j]+' غائبات '+(Tk.g.length+Tk.e.length));
  });
  const text=lines.join('\n'),fname='attendance_'+c.n.replace(' ','-')+'.txt';
  try{
    const f=new File([text],fname,{type:'text/plain'});
    if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:c.n});return}
  }catch(e){if(e&&e.name==='AbortError')return}
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=fname;
  document.body.appendChild(a);a.click();a.remove();
}
function importFiles(inp){
  const fs=Array.from(inp.files||[]);if(!fs.length)return;
  Promise.all(fs.map(f=>f.text())).then(a=>{const e=$('imp');if(e){e.value=a.join('\n');importSms()}});
}

let rci=0,rmod=null,opSeq=0;
const effDefault=()=>{const t=ISOd(new Date());let a=D.dates.findIndex(x=>x>=t);if(a<0)a=D.dates.length-1;return Math.max(S0,a)};
function dayOpts(sel){let o='';const ti=todayIdx();for(let j=Math.max(S0,ti-12);j<=Math.min(D.days.length-1,ti+3);j++)o+=`<option value="${j}" ${j===sel?'selected':''}>${D.days[j]}</option>`;return o}
function addOp(o){const t=Date.now(),k='R'+t+'_'+(opSeq++);P.ops[k]={k,s:JSON.stringify(o),t};P.dops[k]=1}
function fin(){persist();applyAll();render();sync()}
function addStu(){const n=($('sn').value||'').trim();if(n.length<3){alert('اكتبي اسم الطالبة');return}
  const dup=D.classes.some(c=>c.s.some(e=>e[0]===n&&!(e[3]!=null)));if(dup&&!confirm('يوجد اسم مطابق في القوائم. هل تريدين الإضافة رغم ذلك؟'))return;
  addOp({a:'add',c:rci,n,f:+$('sf').value,m:($('sm').value||'').trim()});fin()}
function renStu(i){const e=ent(rci,i),n=prompt('تعديل اسم الطالبة',e[0]);if(n&&n.trim()&&n.trim()!==e[0]){addOp({a:'ren',c:rci,i,n:n.trim()});fin()}}
function inStu(i){addOp({a:'in',c:rci,i});fin()}
function openMod(i,kind){rmod={i,kind};render()}
function doMod(){const {i,kind}=rmod,f=+$('md').value,r=($('mr')||{}).value||'';const e=ent(rci,i);
  if(kind==='out'){addOp({a:'out',c:rci,i,f,m:r.trim()||'خرجت من القائمة'})}
  else{const to=+$('mc').value;if(to===rci){alert('اختاري صفاً آخر');return}
    addOp({a:'out',c:rci,i,f,m:'نُقلت إلى '+D.classes[to].n});addOp({a:'add',c:to,n:e[0],f,m:'منقولة من '+D.classes[rci].n})}
  rmod=null;fin()}
function modHtml(){const e=ent(rci,rmod.i),mv=rmod.kind==='move';
  return `<div class="sheet" onclick="if(event.target===this){rmod=null;render()}"><div><h2>${mv?'نقل':'إخراج'}: ${escN(e[0])}</h2>`+
  (mv?`<label>الصف الجديد</label><select id="mc">${D.classes.map((x,j)=>j===rci?'':`<option value="${j}">${x.n}</option>`).join('')}</select>`:`<label>السبب (اختياري: فصل، انتقلت لمدرسة أخرى...)</label><input id="mr" placeholder="مثال: فصل / انتقلت لمدرسة أخرى">`)+
  `<label>يُحتسب ذلك اعتباراً من يوم</label><select id="md">${dayOpts(effDefault())}</select><p class="mut" style="font-size:12px">كل الحضور والغياب والتقارير قبل هذا اليوم تبقى كما هي، ولن تُحتسب الطالبة في أي يوم من هذا اليوم فصاعداً.</p><button class="on" style="text-align:center" onclick="doMod()">تأكيد</button><button onclick="rmod=null;render()" style="text-align:center">إلغاء</button></div></div>`}
function opText(o){let x;try{x=JSON.parse(o.s)}catch(e){return''}const c=(D.classes[x.c]||{}).n||'',nm=x.a==='add'?x.n:(ent(x.c,x.i)[0]||'');
  const w={add:'إضافة',out:'إخراج',in:'إعادة',ren:'تعديل اسم'}[x.a]||x.a;return `${new Date(o.t).toLocaleDateString('ar',{day:'numeric',month:'numeric'})} – ${w}: ${escN(nm)} (${c})${x.f!=null&&x.a!=='ren'&&x.a!=='in'?' من '+(D.days[x.f]||''):''}`}
function stu(){
  const c=D.classes[rci];
  let h='<div class="lab">الصف</div><div class="chips">'+D.classes.map((x,i)=>`<button class="${i==rci?'on':''}" onclick="rci=${i};render()">${x.n}</button>`).join('')+'</div>';
  const td=effDefault();
  const act=[],gone=[];c.s.forEach((e,i)=>{if(e[3]!=null&&(e[2]||0)>=e[3])return;(e[3]!=null?gone:act).push(i)});
  h+=`<div class="card"><h2>＋ إضافة طالبة جديدة إلى ${c.n}</h2><label>الاسم</label><input id="sn" placeholder="اسم الطالبة"><label>تُحتسب في الحضور اعتباراً من يوم</label><select id="sf">${dayOpts(td)}</select><label>ملاحظة (اختياري)</label><input id="sm" placeholder="مثال: منقولة من مدرسة ..."><button class="on" style="width:100%;margin-top:10px" onclick="addStu()">إضافة</button></div>`;
  h+=`<div class="card"><h2>${c.n} – الطالبات الفعّالات (${act.length})</h2>`+act.map(i=>{const e=c.s[i];return `<div style="display:flex;gap:6px;align-items:center;border-bottom:1px solid var(--brd);padding:6px 0"><span class="mut" style="width:24px;font-size:12px">${i+1}</span><span style="flex:1;font-size:14px">${escN(e[0])}${(e[2]||0)>0?`<span class="nt" style="display:block;font-size:11px;color:var(--mut)">منذ ${D.days[e[2]]||''}${e[1]?' – '+escN(e[1]):''}</span>`:(e[1]?`<span class="nt">${escN(e[1])}</span>`:'')}</span><button class="sm" onclick="renStu(${i})">✏</button><button class="sm" onclick="openMod(${i},'move')">↔ نقل</button><button class="sm" onclick="openMod(${i},'out')">🗑 إخراج</button></div>`}).join('')+'</div>';
  if(gone.length)h+=`<div class="card"><h2>خرجن من ${c.n} (${gone.length}) – سجلّهن السابق محفوظ</h2>`+gone.map(i=>{const e=c.s[i];return `<div style="display:flex;gap:6px;align-items:center;border-bottom:1px solid var(--brd);padding:6px 0"><span style="flex:1;font-size:14px">${escN(e[0])}<span class="nt" style="display:block;font-size:11px;color:var(--mut)">اعتباراً من ${D.days[e[3]]||''}${e[1]?' – '+escN(e[1]):''}</span></span><button class="sm" onclick="inStu(${i})">↩ إعادة</button></div>`}).join('')+'</div>';
  const L=Object.values(P.ops).sort((a,b)=>b.t-a.t).slice(0,12);
  if(L.length)h+=`<div class="card"><h2>آخر التغييرات</h2>`+L.map(o=>`<div style="font-size:12.5px;padding:3px 0">${opText(o)}${P.dops&&P.dops[o.k]?' ⏳':''}</div>`).join('')+'</div>';
  if(rmod)h+=modHtml();
  return h;
}
function setTab(t){tab=t;render();scrollTo(0,0)}
let shI=-1;
function cycle(i){if(nj(ci,i,day))return;const v=get(ci,day).split('');const x=v[i];if('epwc'.includes(x)){openSheet(i);return}v[i]=x==='-'?'h':x==='h'?'g':'-';save(ci,day,v.join(''))}
function openSheet(i){shI=i;render()}
function setSt(ch){const v=get(ci,day).split('');v[shI]=ch;shI=-1;save(ci,day,v.join(''))}
function sheetHtml(){const s=D.classes[ci].s[shI];return `<div class="sheet" onclick="if(event.target===this){shI=-1;render()}"><div><h2>${escN(s[0])} – ${D.days[day]}</h2>`+[['h','✅ حاضرة'],['g','❌ غائبة'],['e','📝 غائبة بإذن'],['p','🚪 حضرت وغادرت بإذن'],['w','👨‍👩‍👧 حضرت وغادرت مع ولي الأمر'],['c','📞 حضرت وغادرت باتصال من ولي الأمر'],['-','↩ مسح التسجيل']].map(x=>`<button onclick="setSt('${x[0]}')">${x[1]}</button>`).join('')+`<button onclick="shI=-1;render()" style="text-align:center">إلغاء</button></div></div>`}
function fillAll(){const n=D.classes[ci].s.length;const v=get(ci,day).split('').map((x,i)=>x==='-'&&!nj(ci,i,day)?'h':x);save(ci,day,v.join(''))}
function clearAll(){if(confirm('مسح تسجيل هذا الصف لهذا اليوم؟'))save(ci,day,'-'.repeat(D.classes[ci].s.length))}
let wsel=null;
const wkOf=i=>Math.floor((i-S0)/3);
function wkGo(n){wsel=n;const ti=todayIdx();let f=S0+n*3;if(f>ti)f=ti;day=f;render()}
function weekBar(ti,nd){
  const cw=wsel==null?wkOf(ti):wsel,cur=wkOf(ti),f=S0+cw*3,iso=ISOd(nd);
  let b='<div class="lab" style="color:var(--pri);font-weight:700">'+(cw==cur?'هذا الأسبوع':'أسبوع سابق')+(D.only==null?' &nbsp; <button onclick="wkGo('+(cw-1)+')" '+(cw<=0?'disabled':'')+'>◀ السابق</button> <button onclick="wkGo('+(cw+1)+')" '+(cw>=cur?'disabled':'')+'>التالي ▶</button>':'')+'</div><div class="chips">';
  for(let i=f;i<f+3&&i<D.days.length;i++){
    const fut=i>ti,q=cnt(ci,i),done=q.h+q.g>0;
    b+=fut?`<button disabled style="opacity:.4">${D.days[i]} 🔒</button>`:`<button class="${i==day?'on':''}" onclick="day=${i};render()">${D.days[i]}${D.dates&&D.dates[i]===iso?' ★':''}${done?' ✔':''}</button>`;
  }
  b+='</div>';
  if(D.only!=null&&cw==cur){let x='';for(let i=S0;i<f;i++){const q=cnt(ci,i);if(q.h+q.g===0)x+=`<button class="${i==day?'on':''}" onclick="day=${i};render()">${D.days[i]} ⚠ لم يُسجَّل</button>`}
    if(x)b+='<div class="lab" style="color:var(--bad)">أيام سابقة لم تُسجَّل:</div><div class="chips">'+x+'</div>'}
  return b;
}
function att(){
  const c=D.classes[ci],k=cnt(ci,day),v=get(ci,day);
  const ti=Math.max(0,todayIdx()),lo=Math.max(S0,ti-5),nd=new Date(),ARD=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const tl=ARD[nd.getDay()]+' '+nd.getDate()+'/'+(nd.getMonth()+1)+'/'+nd.getFullYear();
  let h='<div class="lab" style="font-size:14px;color:var(--pri);font-weight:700">📅 اليوم: '+tl+(D.dates&&D.dates[ti]===ISOd(nd)?'':' – ليس يوم تسجيل، المعروض آخر يوم دوام')+'</div>'+weekBar(ti,nd);
  h+='<div class="lab">الصف</div><div class="chips">'+D.classes.map((x,i)=>`<button class="${i==ci?'on':''}" onclick="ci=${i};render()">${x.n}</button>`).join('')+'</div>';
  h+=`<div class="bar"><div style="color:var(--ok)"><b>${k.h}</b>حاضرات</div><div style="color:var(--bad)"><b>${k.g}</b>غائبات</div><div><b>${k.n-k.h-k.g}</b>بلا تسجيل</div></div>`;
  if(k.e||k.l)h+=`<div class="lg">منهن: غائبات بإذن ${k.e} · غادرن مبكراً ${k.l}</div>`;
  h+='<div class="acts"><button onclick="fillAll()">✔ الكل حاضرات (غير المسجّلات)</button><button onclick="clearAll()">مسح</button></div>';
  if(k.h+k.g>0)h+=`<div class="card" style="margin:0 12px 8px"><button class="on" style="width:100%" onclick="sendSms()">📩 إرسال التسجيل للمديرة برسالة SMS</button><p class="mut" style="font-size:12px;margin:6px 0 0">تعمل بدون إنترنت. الباقيات غير المسجّلات يُعتبرن حاضرات.</p></div>`;
  if(D.days.some((_,j)=>{const q=cnt(ci,j);return q.h+q.g>0}))h+=`<div class="card" style="margin:0 12px 8px"><button style="width:100%" onclick="exportFile()">💾 حفظ/مشاركة ملف التسجيل (بلوتوث أو Quick Share)</button><p class="mut" style="font-size:12px;margin:6px 0 0">يُنشئ ملفاً بكل أيام هذا الصف، تشاركينه مع المديرة بالبلوتوث أو المشاركة القريبة بدون إنترنت.</p></div>`;
  let vn=0;h+=c.s.map((s,i)=>{const jn=nj(ci,i,day);if(s[3]!=null&&(s[2]||0)>=s[3])return'';if(jn&&s[3]!=null&&day>=s[3])return'';const m=v[i];const cl=jn?'':m==='-'?'':m==='h'?'h':m==='g'?'g':m==='e'?'e':'l';const lbl=jn?((s[2]||0)>day?'لم تنضم':'خرجت'):({h:'حاضرة',g:'غائبة',e:'بإذن',p:'غادرت بإذن',w:'مع ولي الأمر',c:'غادرت باتصال'}[m]||'—');return`<div class="row ${cl}" style="${jn?'opacity:.45':''}" ${jn?'':`onclick="cycle(${i})"`}><span class="n">${++vn}</span><span class="nm">${escN(s[0])}${s[1]?`<span class="nt">${escN(s[1])}</span>`:''}</span><span class="pill">${lbl}</span>${jn?'':`<button class="dots" onclick="event.stopPropagation();openSheet(${i})">⋯</button>`}</div>`}).join('');
  if(shI>=0)h+=sheetHtml();
  if(D.only!=null)h=h.replace(/<div class="lab">الصف<\/div><div class="chips">.*?<\/div>/,'<div class="lab" style="font-size:15px;color:var(--pri);font-weight:700">الصف: '+D.classes[D.only].n+'</div>');
  return h;
}
const ISOd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const S0=(()=>{let s=0;(D.dates||[]).some((x,i)=>x>=(D.start||'')&&(s=i,1));return s})();function todayIdx(){const t=ISOd(new Date());let a=-1;(D.dates||[]).forEach((x,i)=>{if(x<=t)a=i});return Math.max(S0,a)}
function auto(){return todayIdx()}
const escN=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const absN=(c,d)=>{const v=get(c,d),s=D.classes[c].s;const a=[];for(let i=0;i<v.length;i++){if((v[i]==='g'||v[i]==='e')&&!nj(c,i,d))a.push(escN(s[i][0])+(v[i]==='e'?' (بإذن)':''))}return a.join('، ')};
const lvN=(c,d)=>{const v=get(c,d),s=D.classes[c].s,R={p:'بإذن',w:'مع ولي الأمر',c:'باتصال'};const a=[];for(let i=0;i<v.length;i++){if(R[v[i]]&&!nj(c,i,d))a.push(escN(s[i][0])+' ('+R[v[i]]+')')}return a.join('، ')};

function recList(d){
  const th=+(P.rth||3),bas=P.rbas||'all',out=[];
  D.classes.forEach((c,i)=>{c.s.forEach((s,k)=>{
    if(s[3]!=null&&(s[2]||0)>=s[3])return;
    let u=0,x=0;const ds=[];
    for(let j=S0;j<=d;j++){if(nj(i,k,j))continue;const ch=(get(i,j)||'')[k];
      if(ch==='g'){u++;ds.push(D.days[j])}else if(ch==='e'){x++;if(bas==='all')ds.push(D.days[j]+' (بإذن)')}}
    const n=bas==='all'?u+x:u;
    if(n>=th)out.push({c:i,k,cn:c.n,name:s[0],n,u,x,ds,ph:s[4]||''})});});
  out.sort((a,b)=>b.n-a.n||a.c-b.c);return out;
}
function recText(d){
  const L=recList(d),th=+(P.rth||3);
  let t='الغياب المتكرر ('+th+' أيام فأكثر'+((P.rbas||'all')==='all'?'':' – بدون إذن')+') حتى '+D.days[d]+' – '+L.length+' طالبة';
  let last='';L.forEach(r=>{if(r.cn!==last){t+='\n'+r.cn+':';last=r.cn}t+='\n- '+r.name+' ('+r.n+')'});
  return t;
}

function saveBlob(name,blob){
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),1500);
}
const CRC=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zipStore(files){
  const te=new TextEncoder(),parts=[],cd=[];let off=0;
  const u16=n=>[n&255,(n>>8)&255],u32=n=>[n&255,(n>>8)&255,(n>>16)&255,(n>>>24)&255];
  files.forEach(([nm,txt])=>{
    const nb=te.encode(nm),db=te.encode(txt),c=crc32(db);
    const lh=new Uint8Array([0x50,0x4b,3,4,20,0,0,8,0,0,0,0,0x21,0,...u32(c),...u32(db.length),...u32(db.length),...u16(nb.length),0,0]);
    parts.push(lh,nb,db);
    cd.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,0,0,0x21,0,...u32(c),...u32(db.length),...u32(db.length),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),nb);
    off+=lh.length+nb.length+db.length;
  });
  let cs=0;cd.forEach(x=>cs+=x.length);
  const end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0]);
  return new Blob([...parts,...cd,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
const xe=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');
function colL(i){let s='';i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=(i-m-1)/26|0}return s}
function saveXlsx(name,rows,widths,sheet){
  const sd=rows.map((r,ri)=>`<row r="${ri+1}">`+r.map((v,ci)=>{const ref=colL(ci)+(ri+1),st=ri===0?' s="1"':'';return typeof v==='number'?`<c r="${ref}"${st}><v>${v}</v></c>`:`<c r="${ref}"${st} t="inlineStr"><is><t xml:space="preserve">${xe(v)}</t></is></c>`}).join('')+'</row>').join('');
  const cols='<cols>'+widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')+'</cols>';
  const H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  saveBlob(name,zipStore([
    ['[Content_Types].xml',H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml',H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="'+xe(sheet||'تقرير')+'" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/styles.xml',H+'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9E8F5"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf/><xf fontId="1" fillId="2" applyFont="1" applyFill="1"/></cellXfs></styleSheet>'],
    ['xl/worksheets/sheet1.xml',H+'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'+cols+'<sheetData>'+sd+'</sheetData></worksheet>']
  ]));
}
function savePdf(title,rows,landscape){
  const hd=rows[0],bd=rows.slice(1);
  const html='<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>'+xe(title)+'</title><style>@page{size:A4 '+(landscape?'landscape':'portrait')+';margin:10mm}body{font-family:Tahoma,Arial,sans-serif;font-size:'+(landscape?'9':'12')+'px;color:#000}h3,h4,p{text-align:center;margin:2px 0}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #555;padding:3px 4px;text-align:center}th{background:#e6eef6}tr{page-break-inside:avoid}td.n{text-align:right}</sty'+'le></head><body><p><b>وكالة الغوث الدولية – برنامج التربية والتعليم</b></p><p><b>منطقة غرب الوسطى التعليمية – مدرسة النصيرات المشتركة الإعدادية</b></p><h3>'+xe(title)+'</h3><table><thead><tr>'+hd.map(x=>'<th>'+xe(x)+'</th>').join('')+'</tr></thead><tbody>'+bd.map(r=>'<tr>'+r.map((v,i)=>'<td'+(hd[i]==='الطالبة'?' class="n"':'')+'>'+xe(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></body></html>';
  let f=document.getElementById('pf');if(f)f.remove();
  f=document.createElement('iframe');f.id='pf';f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
  f.srcdoc=html;f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){alert('تعذّرت الطباعة')}};
}
function recRows(d){
  const L=recList(d);
  return [['م','الصف','الشعبة','الطالبة','عدد الأيام','منها بإذن','الجوال']].concat(L.map((r,i)=>[i+1,r.cn.split(' ')[0],r.cn.split(' ')[1]||'',r.name,r.n,r.x,(r.ph||'').replace('/',' / ')]));
}
function daysRows(d){
  const days=[];for(let j=S0;j<=d;j++)days.push(j);
  const sym={h:'ح',g:'غ',e:'غ إذن',p:'خ إذن',w:'خ ولي',c:'خ اتصال','-':''};
  const rows=[['الصف','الشعبة','الطالبة'].concat(days.map(j=>D.days[j])).concat(['حاضرة','غائبة','بإذن','الجوال'])];
  D.classes.forEach((c,i)=>c.s.forEach((s,k)=>{
    if(s[3]!=null&&(s[2]||0)>=s[3])return;
    let h=0,g=0,e=0;
    const cells=days.map(j=>{if(nj(i,k,j))return'';const ch=(get(i,j)||'')[k]||'-';if(ch==='g')g++;else if(ch==='e'){g++;e++}else if(ch!=='-')h++;return sym[ch]||''});
    rows.push([c.n.split(' ')[0],c.n.split(' ')[1]||'',s[0]].concat(cells).concat([h,g,e,(s[4]||'').replace('/',' / ')]))}));
  return rows;
}
const fnm=d=>D.dates[d];
function recXlsx(d){saveXlsx('الغياب_المتكرر_'+fnm(d)+'.xlsx',recRows(d),[5,9,8,34,11,10,26],'الغياب المتكرر')}
function recPdf(d){savePdf('كشف الغياب المتكرر ('+(+(P.rth||3))+' أيام فأكثر) حتى '+D.days[d],recRows(d),false)}
function daysXlsx(d){const r=daysRows(d);saveXlsx('ايام_الحضور_والغياب_'+fnm(d)+'.xlsx',r,[8,8,32].concat(r[0].slice(3,-4).map(()=>9)).concat([8,8,8,24]),'الحضور والغياب')}
function daysPdf(d){savePdf('سجل أيام الحضور والغياب حتى '+D.days[d],daysRows(d),true)}
const DMSG='السلام عليكم، نفيدكم بأن ابنتكم {الاسم} ({الصف}) غابت {العدد} أيام عن المدرسة. نرجو التواصل مع إدارة المدرسة وإفادتنا بسبب الغياب. مدرسة النصيرات المشتركة الإعدادية';
function gMsg(r){return (P.rmsg||DMSG).replace(/\{الاسم\}/g,r.name).replace(/\{الصف\}/g,r.cn).replace(/\{العدد\}/g,r.n)}
function smsG(d,idx){
  const r=recList(d)[idx];if(!r)return;
  const ph=(r.ph||'').split('/')[0];
  if(!ph){alert('لا يوجد رقم جوال لهذه الطالبة');return}
  P.G=P.G||{};P.G[r.cn+'|'+r.name]=Date.now();persist();
  location.href='sms:'+ph+(/iPhone|iPad/i.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(gMsg(r));
}
function recSms(d){
  let ph=(P.rph||P.ph||D.phone||'').trim();
  if(!ph){ph=(prompt('اكتبي رقم الجوال لإرسال القائمة إليه:')||'').trim();if(!ph)return;P.rph=ph;persist()}
  location.href='sms:'+ph+(/iPhone|iPad/i.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(recText(d));
}
function recCopy(d){
  const t=recText(d);
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert('تم النسخ'),()=>{prompt('انسخي النص:',t)});
}
function recCard(d){
  const th=+(P.rth||3),bas=P.rbas||'all',L=recList(d);
  let b='',last='';
  L.forEach(r=>{b+=`<tr><td>${r.cn}</td><td style="text-align:right">${escN(r.name)}</td><td class="bad">${r.n}</td><td dir="ltr" style="font-size:12px">${escN(r.ph||'—')}</td><td>${r.ph?`<button onclick="smsG(${d},${L.indexOf(r)})" style="min-height:34px;padding:4px 8px">📩 ولي الأمر</button>${(P.G||{})[r.cn+'|'+r.name]?'<div class="mut" style="font-size:11px">أُرسل ✔</div>':''}`:''}</td></tr>`});
  return `<div class="card"><h2>الغياب المتكرر حتى ${D.days[d]}</h2>
<label>عدد أيام الغياب (فأكثر)</label><select onchange="P.rth=+this.value;persist();render()">${[2,3,4,5,6,7,8,10,12,15,20].map(n=>`<option value="${n}" ${n===th?'selected':''}>${n} أيام فأكثر</option>`).join('')}</select>
<label>طريقة الاحتساب</label><select onchange="P.rbas=this.value;persist();render()"><option value="all" ${bas==='all'?'selected':''}>كل الغياب (مع بإذن)</option><option value="u" ${bas==='u'?'selected':''}>الغياب بدون إذن فقط</option></select>
<label>رسالة ولي الأمر (يمكن تعديلها: {الاسم} {الصف} {العدد})</label><textarea rows="3" style="width:100%;font:inherit;padding:8px;border-radius:10px;border:1px solid #ccc" onchange="P.rmsg=this.value.trim();persist()">${escN(P.rmsg||DMSG)}</textarea>
<label>إرسال القائمة كاملة إلى رقم (مثل جوال المديرة)</label><input dir="ltr" inputmode="tel" placeholder="05XXXXXXXX" value="${esc2(P.rph||P.ph||D.phone||'')}" onchange="P.rph=this.value.trim();persist()">
${L.length?`<table><tr><th>الصف والشعبة</th><th>الطالبة</th><th>عدد الأيام</th><th>الجوال</th><th></th></tr>${b}</table>`:'<p class="mut">لا توجد طالبات بهذا العدد.</p>'}
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button onclick="recSms(${d})">📩 إرسال SMS</button><button onclick="recCopy(${d})">📋 نسخ</button><button onclick="recXlsx(${d})">⬇ كشف الغياب Excel</button><button onclick="recPdf(${d})">⬇ كشف الغياب PDF</button><button onclick="daysXlsx(${d})">⬇ أيام الحضور والغياب Excel</button><button onclick="daysPdf(${d})">⬇ أيام الحضور والغياب PDF</button></div>
<p class="mut" style="font-size:12px;margin:8px 0 0">زر «ولي الأمر» يفتح الرسائل برقم ولي الأمر ونص جاهز، دون إنترنت. ملف Excel يُحفظ مباشرة في الجهاز. وPDF: اختاري «حفظ بصيغة PDF» من نافذة الطباعة.</p></div>`;
}
function rep(){
  const d=over!==''?+over:auto();
  const W=[];for(let j=Math.max(S0,d-8);j<=d;j++)W.push(j);
  const rows=[];const lv={};
  D.classes.forEach((c,i)=>{const k=cnt(i,d);(lv[c.lv]=lv[c.lv]||[]).push({n:c.n,t:k.n,h:k.h,g:k.g,e:k.e,l:k.l,i})});
  const pct=(g,h)=>g+h?((g/(g+h))*100).toFixed(1)+'%':'—';
  const st=r=>r.h+r.g===0?'<span class="mut">لم يُسجَّل</span>':r.h+r.g<r.t?`ناقص (${r.t-r.h-r.g})`:'مكتمل';
  let all={t:0,h:0,g:0,e:0,l:0};let body='';
  Object.keys(lv).forEach(l=>{
    const s={t:0,h:0,g:0,e:0,l:0};
    lv[l].forEach(r=>{s.t+=r.t;s.h+=r.h;s.g+=r.g;s.e+=r.e;s.l+=r.l;body+=`<tr><td>${r.n}</td><td>${r.t}</td><td>${r.h}</td><td class="${r.g?'bad':''}">${r.g}</td><td>${r.e||''}</td><td>${r.l||''}</td><td>${pct(r.g,r.h)}</td><td>${st(r)}</td><td style="text-align:right;font-size:12px">${r.g?absN(r.i,d):''}</td><td style="text-align:right;font-size:12px">${r.l?lvN(r.i,d):''}</td></tr>`});
    all.t+=s.t;all.h+=s.h;all.g+=s.g;all.e+=s.e;all.l+=s.l;
    body+=`<tr class="lv"><td>مجموع ${l}</td><td>${s.t}</td><td>${s.h}</td><td>${s.g}</td><td>${s.e||''}</td><td>${s.l||''}</td><td>${pct(s.g,s.h)}</td><td></td><td></td><td></td></tr>`;
  });
  body+=`<tr class="tt"><td>إجمالي المدرسة</td><td>${all.t}</td><td>${all.h}</td><td>${all.g}</td><td>${all.e||''}</td><td>${all.l||''}</td><td>${pct(all.g,all.h)}</td><td></td><td></td><td></td></tr>`;
  let h=`<div class="card"><h2>اليوم المعروض: ${D.days[d]}</h2><select onchange="over=this.value;render()"><option value="">تلقائي (اليوم)</option>${D.days.map((x,i)=>i>todayIdx()||i<S0?'':`<option value="${i}" ${String(over)===String(i)?'selected':''}>${x}</option>`).join('')}</select></div>`;
  h+=`<div class="card"><h2>التقرير اليومي</h2><table><tr><th>الصف</th><th>الطالبات</th><th>حاضرات</th><th>غائبات</th><th>منهن بإذن</th><th>غادرن مبكراً</th><th>الغياب</th><th>الحالة</th><th>أسماء الغائبات</th><th>أسماء من غادرن</th></tr>${body}</table></div>`;
  h+=recCard(d);
  let rm='';
  D.classes.forEach((c,i)=>{const k=cnt(i,d);if(k.h+k.g>=k.n)return;
    const stt=k.h+k.g===0?'لم يُسجَّل':'ناقص ('+(k.n-k.h-k.g)+')';
    const lr=(P.R||{})[i+'_'+d];
    rm+=`<tr><td>${c.n}</td><td>${c.t||'—'}</td><td class="bad">${stt}</td><td><button onclick="remind(${i},${d})" style="min-height:36px;padding:6px 10px">📩 تذكير</button>${lr?`<div class="mut" style="font-size:11px">أُرسل ${new Date(lr).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'})}</div>`:''}</td></tr>`});
  h+=`<div class="card"><h2>تذكير معلمات الصفوف – ${D.days[d]}</h2>${rm?`<table><tr><th>الصف</th><th>المعلمة</th><th>الحالة</th><th></th></tr>${rm}</table><p class="mut" style="font-size:12px;margin:8px 0 0">يفتح الزر رسالة SMS جاهزة للمعلمة (بدون إنترنت). رقمها يُسأل مرة واحدة ويُحفظ على جوالك.</p>`:'<span class="ok">✔ كل الصفوف سجّلت لهذا اليوم</span>'}</div>`;
  let m='';const lt={};let tot=D.days.map(()=>null);
  D.classes.forEach((c,i)=>{m+=`<tr><td>${c.n}</td>`+D.days.map((_,j)=>{const k=cnt(i,j);if(k.h+k.g===0)return'<td class="mut">·</td>';lt[c.lv]=lt[c.lv]||D.days.map(()=>null);lt[c.lv][j]=(lt[c.lv][j]||0)+k.g;tot[j]=(tot[j]||0)+k.g;return`<td class="${k.g?'bad':''}">${k.g}</td>`}).filter((_,j)=>W.includes(j)).join('')+'</tr>'});
  m+=Object.keys(lt).map(l=>`<tr class="lv"><td>مجموع ${l}</td>${lt[l].filter((_,j)=>W.includes(j)).map(x=>`<td>${x===null?'·':x}</td>`).join('')}</tr>`).join('');
  m+=`<tr class="tt"><td>إجمالي المدرسة</td>${tot.filter((_,j)=>W.includes(j)).map(x=>`<td>${x===null?'·':x}</td>`).join('')}</tr>`;
  h+=`<div class="card"><h2>عدد الغائبات – آخر 9 أيام دوام</h2><table><tr><th>الصف</th>${W.map(j=>`<th>${D.days[j].replace(' ','<br>')}</th>`).join('')}</tr>${m}</table></div>`;
  let f='';D.classes.forEach((c,i)=>{let nm='—',lt=-1;D.days.forEach((_,j)=>{const k=key(i,j);if(P.B[k]&&(P.T[k]||0)>lt){lt=P.T[k]||0;nm=P.B[k]}});
    f+=`<tr><td>${c.n}</td><td>${c.t||nm}</td>`+W.map(j=>{const k=cnt(i,j);return k.h+k.g===0?'<td class="bad">✖</td>':k.h+k.g<k.n?'<td>◐</td>':'<td style="color:var(--ok)">✔</td>'}).join('')+'</tr>'});
  h+=`<div class="card"><h2>متابعة التسجيل (✔ مكتمل، ◐ ناقص، ✖ لم يُسجَّل)</h2><table><tr><th>الصف</th><th>المعلمة</th>${W.map(j=>`<th>${D.days[j].replace(' ','<br>')}</th>`).join('')}</tr>${f}</table></div>`;
  return h;
}
function render(){
  $('t1').className=tab==='att'?'on':'';$('t2').className=tab==='rep'?'on':'';$('t3').className=tab==='set'?'on':'';$('t4').className=tab==='stu'?'on':'';
  const y=scrollY;$('app').innerHTML=(D.only!=null&&!P.by)?gate():(tab==='att'?att()+(D.only!=null?`<div style="margin:0 12px">${recCard(auto())}</div>`:''):tab==='rep'?rep():tab==='stu'?stu():setv());if(tab==='set'){$('by').value=P.by||'';$('u').value=P.url||''}if(D.only!=null){$('t2').style.display='none';$('t4').style.display='none'}scrollTo(0,y);badge();
}
day=todayIdx();render();sync();setInterval(sync,30000);addEventListener('online',sync);

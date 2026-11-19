import {el,node,link,option,download,source,fail} from './dom.mjs';
import {parseMX,subset} from './model.mjs';
let data,filtered;
const p=new URLSearchParams(location.search);
function drawCard(id){
 const r=data.rows.find(x=>x.id===id);const c=node('article');
 c.append(node('small',r.region+' · '+r.kind,'kicker'),node('h3',r.service),node('p',r.org),node('p',r.operator,'strong'),node('p','Storage evidence · '+r.location),node('p',r.detail),link('Read the service disclosure ↗',r.url+(r.pdf_page?'#page='+r.pdf_page:'')));
 if(r.mx){
   const mx=parseMX(r.mx.answers.join('\n'));
   c.append(node('p','Incoming mail · '+[...new Set(mx.map(x=>x.provider))].join(', ')),link('Public MX answer ↗',r.mx.url));
 }
 if(r.historical)c.append(node('p',r.historical.date+' · '+r.historical.detail),link('Read archived statement ↗',r.historical.url));
 return c;
}
function render(){
 el('pair').replaceChildren(...[...new Set([el('first').value,el('second').value])].map(drawCard));
 filtered=subset(data.rows,el('region').value,el('scope').value);
 el('matches').textContent=filtered.length+' matching services. Select a service below to compare it.';
 el('rows').replaceChildren(...filtered.map(r=>{
   const tr=node('tr'), td=node('td'), button=node('button',r.org+' · '+r.service);
   button.onclick=()=>{el('first').value=r.id;render();el('first').focus();};
   td.append(button);tr.append(td,node('td',r.operator),node('td',r.location));return tr;
 }));
 const url=new URL(location.href);for(const id of ['first','second','region','scope'])url.searchParams.set(id,el(id).value);
 history.replaceState(null,'',url);
}
function explain(){
 try{
  const rows=parseMX(el('mx').value);
  el('mxout').textContent=rows.length?rows.map(r=>'Priority '+r.priority+' · '+r.host+' · '+r.provider).join(' | '):'No recognizable MX rows. Paste the MX answer section with a numeric priority and mail host.';
 }catch(err){el('mxout').textContent=err.message;}
}
async function start(){
 data=await source();for(const id of ['first','second'])for(const r of data.rows)option(id,r.id,r.org+' · '+r.service);
 for(const region of [...new Set(data.rows.map(r=>r.region))].sort())option('region',region,region);
 el('first').value='dal-mail';el('second').value='uvic-files';
 for(const id of ['first','second','region','scope']){
   if([...el(id).options].some(o=>o.value===p.get(id)))el(id).value=p.get(id);
   el(id).onchange=render;
 }
 el('status').textContent=data.count+' service disclosures · Records checked '+data.retrieved;
 el('interpret').onclick=explain;
 el('load').onclick=()=>{el('mx').value=data.rows.find(r=>r.id==='dal-mail').mx.answers.join('\n');explain();};
 el('csv').onclick=()=>download('hosting-evidence.csv',['Institution','Region','Service','Provider or operator','Published location','Source','Reviewed'],filtered.map(r=>[r.org,r.region,r.service,r.operator,r.location,r.url,data.retrieved]));
 render();
}
start().catch(fail);

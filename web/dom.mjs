export const el = id => document.getElementById(id);
export function node(tag,text,className) {
  const result=document.createElement(tag);
  if (text !== undefined) result.textContent=text;
  if (className) result.className=className;
  return result;
}
export function link(label,url) {
  const a=node('a',label); a.href=url; return a;
}
export function option(id,value,label) { el(id).add(new Option(label,value)); }
export async function source() {
  const response=await fetch('./data.json');
  if (!response.ok) throw new Error('Missing edition');
  return response.json();
}
export function fail() { el('status').textContent='The published edition could not be loaded. Reload to retry or open the source guide.'; }
export function download(name,columns,rows) {
  const cell=value=>'"'+String(value??'').replaceAll('"','""')+'"';
  const contents=[columns,...rows].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
  const url=URL.createObjectURL(new Blob([contents],{type:'text/csv;charset=utf-8'}));
  const a=link('',url);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

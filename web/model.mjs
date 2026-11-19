function gateway(host) {
  if (host.endsWith('.mail.protection.outlook.com')) return 'Microsoft Exchange Online Protection';
  if (host==='smtp.google.com'||/^(aspmx|alt[1-5]\.aspmx)\.l\.google\.com$/.test(host)) return 'Google mail gateway';
  if (host.endsWith('.pphosted.com')) return 'Proofpoint mail gateway';
  if (host.endsWith('.mimecast.com')) return 'Mimecast mail gateway';
  return 'Provider unclassified';
}
export function parseMX(input) {
  let raw=input.trim();
  if(!raw) return [];
  if(raw.length>200000)throw new Error('Paste up to 200,000 characters.');
  if(raw.startsWith('{')){
    let json;try{json=JSON.parse(raw)}catch{throw new Error('The DNS JSON could not be read.')}
    if(!Array.isArray(json.Answer))throw new Error('The JSON has no Answer array.');
    raw=json.Answer.filter(r=>r.type===15&&typeof r.data==='string').map(r=>r.data).join('\n');
  }
  const records=[];
  for(const line of raw.split(/\r?\n/)){
    const match=line.trim().match(/^(?:[^;]*?\sMX\s+)?(\d{1,5})\s+(\.|[a-z\d](?:[a-z\d.-]*[a-z\d])?\.?)$/i);
    if(!match||Number(match[1])>65535)continue;
    const server=match[2].toLowerCase().replace(/\.$/,'');
    records.push({priority:Number(match[1]),host:server||'.',provider:server?gateway(server):(Number(match[1])===0?'Null MX (domain declines incoming mail)':'Unclassified MX')});
  }
  return records.sort((a,b)=>a.priority-b.priority);
}
export function subset(rows,region,scope) {
 return rows.filter(r=>(!region||r.region===region)&&(!scope||(scope==='unknown')===(r.location==='Unspecified')));
}

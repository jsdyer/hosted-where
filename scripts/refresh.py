"""Verify the published evidence for a small, explicitly listed set of services."""
import concurrent.futures
import hashlib
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen, Request
ROOT=Path(__file__).resolve().parents[1]

def read(url):
    with urlopen(Request(url,headers={'User-Agent':'CoolCode service evidence review'}),timeout=30) as response:
        return response.read()

class Words(HTMLParser):
    def __init__(self):super().__init__();self.text=[]
    def handle_data(self,data):self.text.append(data)

def check_page(url,terms):
    contents=Words();contents.feed(read(url).decode('utf-8','replace'))
    words=' '.join(' '.join(contents.text).split()).casefold()
    if not all(t.casefold() in words for t in terms):
        raise ValueError('Source needs editorial review: '+url)

def verify(row, today):
    if row.get('pdf_sha256'):
        if hashlib.sha256(read(row['url'])).hexdigest()!=row['pdf_sha256']:
            raise ValueError('PDF changed; review its cited page before updating')
    else:
        check_page(row['url'],row['terms'])
    entry={k:v for k,v in row.items() if k!='terms'}
    historical=row.get('historical')
    if historical:
        check_page(historical['url'],historical['terms'])
        entry['historical']={k:v for k,v in historical.items() if k!='terms'}
    if row.get('mail'):
        url='https://dns.google/resolve?'+urlencode({'name':row['mail'],'type':'MX'})
        response=json.loads(read(url))
        if response.get('Status')!=0: raise ValueError('MX source unavailable')
        answers=sorted({r['data'] for r in response.get('Answer',[]) if r['type']==15})
        if not answers: raise ValueError('Empty MX answer')
        entry['mx']={'url':url,'answers':answers,'retrieved':today}
    return entry

def main():
    today=datetime.now(timezone.utc).date().isoformat()
    inputs=json.loads((ROOT/'sources/services.json').read_text())
    with concurrent.futures.ThreadPoolExecutor(4) as p:
        rows=list(p.map(lambda row:verify(row,today),inputs))
    if len(set(r['id'] for r in rows))!=len(rows):raise ValueError('Duplicate service')
    result={'retrieved':today,'count':len(rows),'rows':rows}
    p=ROOT/'web/data.json';tmp=p.with_suffix('.tmp')
    tmp.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');tmp.replace(p)
    print('Verified services',len(rows))
if __name__=='__main__':main()

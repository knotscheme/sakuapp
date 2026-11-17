import json,urllib.request,urllib.parse,sys,wave,subprocess,re,os
SP=30;RATE=24000;D='/home/user/sakuapp-src/tsurete'
A=json.load(open(D+'/src/lib/lp-voice.json'))
REP=[("TSURETE","ツレテ"),("日本で","にほんで"),("Shopify","ショッピファイ"),("BASE","ベイス"),("Amazon","アマゾン"),("CSV","シーエスブイ"),("URL","ユーアールエル"),("SNS","エスエヌエス"),("1.5倍","1.5ばい"),("何百回","なんびゃっかい"),("10件","じゅっけん"),("1週間","いっしゅうかん"),("1商品","ひとしょうひん"),("翌週","よくしゅう")]
def fix(t):
  for a,b in REP: t=t.replace(a,b)
  return t
def sents(t): return [s for s in re.split(r"(?<=[。！？])",t) if s.strip()]
def chunks(ss,limit=140):
  out=[];cur=''
  for s in ss:
    if cur and len(cur)+len(s)>limit: out.append(cur);cur=''
    cur+=s
  if cur: out.append(cur)
  return out
def syn(t):
  q=json.load(urllib.request.urlopen(urllib.request.Request(f'http://127.0.0.1:50021/audio_query?speaker={SP}&text='+urllib.parse.quote(t),method='POST')))
  q['speedScale']=1.05;q['prePhonemeLength']=0.05;q['postPhonemeLength']=0.12;q['pauseLengthScale']=1.1;q['outputSamplingRate']=RATE
  return urllib.request.urlopen(urllib.request.Request(f'http://127.0.0.1:50021/synthesis?speaker={SP}',data=json.dumps(q).encode(),headers={'Content-Type':'application/json'})).read()
only=sys.argv[1:];tmp='/tmp/vtmp.wav';tot=0
for x in A:
  if only and x['id'] not in only: continue
  frames=b''
  for c in chunks(sents(fix(x['text']))):
    open(tmp,'wb').write(syn(c))
    with wave.open(tmp) as f: frames+=f.readframes(f.getnframes())
    frames+=b'\0\0'*int(RATE*0.3)
  w=tmp.replace('vtmp','v-'+x['id'])
  with wave.open(w,'wb') as o: o.setnchannels(1);o.setsampwidth(2);o.setframerate(RATE);o.writeframes(frames)
  subprocess.run(['ffmpeg','-y','-loglevel','error','-i',w,'-af','loudnorm=I=-16:TP=-1.5','-ac','1','-ar','24000','-b:a','48k',f'{D}/public/audio/lp-{x["id"]}.mp3'],check=True)
  s=len(frames)/2/RATE;tot+=s;print(x['id'],round(s,1),flush=True)
print('total',round(tot))

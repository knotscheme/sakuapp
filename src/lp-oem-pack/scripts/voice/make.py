import json,urllib.request,urllib.parse,sys,wave,subprocess
sys.path.insert(0,'vg');from fix import fix,sents
A=json.load(open('vg/all.json'));SP=30;RATE=24000
only=sys.argv[1:]  # 例：manual-start
def syn(t,title=False):
  q=json.load(urllib.request.urlopen(urllib.request.Request(f'http://127.0.0.1:50021/audio_query?speaker={SP}&text='+urllib.parse.quote(t),method='POST')))
  if title:
    # 最初の文（タイトル）の声の高さを、続く本文の平均にそろえる
    ap=q['accent_phrases'];end=next((i for i,a in enumerate(ap) if a.get('pause_mora')),0)
    head=[m for a in ap[:end+1] for m in a['moras'] if m['pitch']>0];rest=[m for a in ap[end+1:] for m in a['moras'] if m['pitch']>0]
    if head and rest:
      d=sum(m['pitch'] for m in head)/len(head)-sum(m['pitch'] for m in rest)/len(rest)
      for m in head: m['pitch']-=d+0.02
  q['speedScale']=1.0;q['prePhonemeLength']=0.05;q['postPhonemeLength']=0.12;q['pauseLengthScale']=1.1;q['outputSamplingRate']=RATE
  return urllib.request.urlopen(urllib.request.Request(f'http://127.0.0.1:50021/synthesis?speaker={SP}',data=json.dumps(q).encode(),headers={'Content-Type':'application/json'})).read()
# タイトルだけで作ると声が高くなるので、次の文とつなげ、数文ずつまとめて作る（話の流れの中で同じ高さに）
def chunks(ss,limit=140):
  out=[];cur=''
  for i,s in enumerate(ss):
    if cur and len(cur)+len(s)>limit and i>1: out.append(cur);cur=''
    cur+=s
  if cur: out.append(cur)
  return out
for k in A:
  for x in A[k]:
    name=f'{k}-{x["id"]}'
    if only and name not in only: continue
    frames=b''
    for j,c in enumerate(chunks(sents(fix(x['text'])))):
      open('vg/wav/tmp.wav','wb').write(syn(c,title=(j==0 and k=='manual')))
      with wave.open('vg/wav/tmp.wav') as f: frames+=f.readframes(f.getnframes())
      frames+=b'\0\0'*int(RATE*0.35)
    out=f'vg/wav/{name}.wav'
    with wave.open(out,'wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(frames)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',out,'-af','loudnorm=I=-16:TP=-1.5','-ac','1','-ar','24000','-b:a','48k',f'/home/user/sakuapp-src/lp-oem/public/audio/{name}.mp3'],check=True)
    print(name,round(len(frames)/2/RATE,1),flush=True)

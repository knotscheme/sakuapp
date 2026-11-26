const {chromium,devices}=require("playwright");const fs=require("fs");
(async()=>{const b=await chromium.launch();const c=await b.newContext(devices["iPhone 13"]);const p=await c.newPage();
await p.goto("http://127.0.0.1:8765/sakuapp/works/lp-oem-pack/cms/manual/");await p.waitForTimeout(1500);
const out=await p.evaluate(()=>{
 const textOf=(id)=>{const el=document.getElementById(id);if(!el)return "";const c=el.cloneNode(true);
  c.querySelectorAll("[data-nosay], script, style, svg, button, input, select, textarea").forEach(x=>x.remove());
  c.querySelectorAll("[data-say]").forEach(x=>{x.textContent=x.dataset.say||""});
  c.querySelectorAll("h1,h2,h3,p,li,dt,dd").forEach(x=>x.append("。"));
  return (c.textContent||"").replace(/\s*→\s*/g,"、").replace(/。\s*。+/g,"。").replace(/([、。])\s*[、。]+/g,"$1").replace(/\s+/g," ").trim();};
 const ids=[...document.querySelectorAll("main section[id]")].map(s=>s.id);
 return ids.map(id=>({id,text:textOf(id)}));});
fs.writeFileSync("vg/manual.json",JSON.stringify(out,null,1));console.log(out.map(x=>x.id+":"+x.text.length).join(" "));await b.close()})()

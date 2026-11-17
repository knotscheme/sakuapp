// 作品例のスクリーンショット（パソコン 1280×800・スマホ 390×844）を作る
// 使い方：ビルドしたものをローカルで配信してから node scripts/shots.js <出力先>
const { chromium } = require("playwright");
const B = process.env.BASE || "http://127.0.0.1:8765/sakuapp/works/lp-builder";
const OUT = process.argv[2];
(async () => {
  const br = await chromium.launch();
  const p0 = await br.newPage();
  for (const id of ["sorae", "craft", "abyssia"]) {
    await p0.goto(`${B}/works/view/?id=${id}`); await p0.waitForTimeout(1500);
    const doc = await p0.locator("iframe").first().getAttribute("srcdoc");
    for (const [kind, w, h] of [["pc", 1280, 800], ["sp", 390, 844]]) {
      const p = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      await p.setContent(doc, { waitUntil: "networkidle" }); await p.waitForTimeout(5500);
      await p.screenshot({ path: `${OUT}/${id}-${kind}.png` });
      await p.close();
    }
  }
  await br.close();
})();

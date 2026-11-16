# CRAFT OEM（革財布ロゴ入れOEMのLP・制作サンプル）

Next.js（App Router）+ TypeScript + Tailwind CSS + Lucide React で作ったLPです。
静的ファイルに書き出して、ポートフォリオ（`works/lp-oem/`）に置いています。

## ローカルで動かす

```
cd src/lp-oem
npm install
npm run dev
```

ブラウザで http://localhost:3000/sakuapp/works/lp-oem/ を開きます。

## 公開用に書き出す

```
npm run build
rm -rf ../../works/lp-oem && cp -r out ../../works/lp-oem
```

## 構成

- `src/app/page.tsx` … セクションの並び
- `src/components/` … セクションごとの部品（Hero / Pains / Features / Models / Simulator / Options / FlowFaq / ContactForm など）
- `src/lib/models.ts` … ベースモデルの情報と、利益の計算（ロット割引）
- `src/components/WalletArt.tsx` … 商品写真の代わりのイラスト。実際の写真に差し替えるときは、ここを `<img>` に置き換えます

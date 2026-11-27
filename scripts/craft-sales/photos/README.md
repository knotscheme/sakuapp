# サンプル案に使う写真

ロゴの入っていないベース製品の写真を置き、`config.json` に登録すると、`mock.mjs` が写真にロゴを合成します。
登録がないアイテム・色は、これまでどおり描いたイメージになります。

- ファイル名：`<アイテム>-<色>.jpg`（例：`wallet-camel.jpg`）。アイテムは wallet / cardcase / keycase、色は black / camel / choco / navy / red / green / ivory / gray
- 写真：正面から、背景は無地、刻印を入れる面がはっきり見えるもの。横長なら幅2000px程度
- `config.json` の例：

```json
{
  "wallet-camel": { "file": "wallet-camel.jpg", "logo": { "x": 0.5, "y": 0.62, "w": 0.3 } }
}
```

x, y はロゴの中心（写真の幅・高さに対する割合）、w はロゴの幅（写真の幅に対する割合）。明るい色の革は `"light": true` を付けると刻印が薄めになります。

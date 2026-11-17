# LPの音声ガイドの作り方（VOICEVOX）

- 声：VOICEVOX「九州そら（ノーマル）」（speaker=16）、速さ 1.3・間 0.55（この声はもともとゆっくりなので、速めにしている）
- 利用条件：ページに「VOICEVOX:九州そら」と書けば、商用でも使える（LPの一番下に表記済み）。声を変えるときは、その声の利用規約を必ず確かめる（例：No.7は商用だと事前確認が必要）
- 読み上げる文章は `src/lib/lp-voice.json`（章ごと。`sec` はLPの何番目のセクションから、その章を読むか）
- 文章を直したら、音声も作り直す（`public/audio/lp-*.mp3`）
  1. VOICEVOX エンジンを起動（http://127.0.0.1:50021）
  2. `python3 scripts/voice/make.py`（1章だけなら `python3 scripts/voice/make.py now`）
- 読みがおかしい言葉は、make.py の `REP` に置きかえを足す（例：日本で→にほんで、Shopify→ショッピファイ）

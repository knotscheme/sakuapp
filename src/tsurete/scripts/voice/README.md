# LPの音声ガイドの作り方（VOICEVOX）

- 声：VOICEVOX「No.7 アナウンス」（speaker=30）、速さ 1.05
- 読み上げる文章は `src/lib/lp-voice.json`（章ごと。`sec` はLPの何番目のセクションへ動かすか）
- 文章を直したら、音声も作り直す（`public/audio/lp-*.mp3`）
  1. VOICEVOX エンジンを起動（http://127.0.0.1:50021）
  2. `python3 scripts/voice/make.py`（1章だけなら `python3 scripts/voice/make.py now`）
- 読みがおかしい言葉は、make.py の `REP` に置きかえを足す（例：日本で→にほんで、Shopify→ショッピファイ）

# 音声ガイドの作り方（VOICEVOX）

- 声：VOICEVOX「No.7 アナウンス」（speaker=30）、速さ 1.0
- 文章を直したら、音声も作り直す（public/audio/*.mp3）
  1. VOICEVOX エンジンを起動（http://127.0.0.1:50021）
  2. `node extract-manual.js` でマニュアルの読み上げ文を書き出す（まとめページは overview/page.tsx の VOICE）
  3. `fix.py` の置きかえ（素押し→すおし など）で読みを直し、文ごとに合成してつなぎ、mp3（48kbps）にする
- タイ語・英語は VOICEVOX が対応していないため、端末の読み上げで読む

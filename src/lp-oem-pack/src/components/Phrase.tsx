import { Fragment } from "react";

// 「|」で区切った文節ごとに改行させる（日本語が1文字だけ次の行に落ちるのを防ぐ）
export default function Phrase({ text }: { text: string }) {
  return (
    <>
      {text.split("|").map((p, i) => (
        <Fragment key={i}>
          <span className="inline-block">{p}</span>
          <wbr />
        </Fragment>
      ))}
    </>
  );
}

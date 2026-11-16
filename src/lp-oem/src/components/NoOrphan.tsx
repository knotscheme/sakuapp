// 文章の最後の数文字を1行にまとめて、「ます。」だけが次の行に落ちないようにする
export default function NoOrphan({ text, n = 6 }: { text: string; n?: number }) {
  if (text.length <= n + 4) return <>{text}</>;
  return (
    <>
      {text.slice(0, -n)}
      <span className="whitespace-nowrap">{text.slice(-n)}</span>
    </>
  );
}

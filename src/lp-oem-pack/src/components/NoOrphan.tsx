import { Ph } from "./cms/Ph";

// 文章を文節の切れ目でだけ改行させ（「ユニ|セックス」のような単語の途中の改行を防ぐ）、
// 最後の数文字（「ます。」など）だけが次の行に落ちないようにする
export default function NoOrphan({ text, n = 6 }: { text: string; n?: number }) {
  return <Ph tail={n}>{text}</Ph>;
}

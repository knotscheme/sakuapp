// サクアプ 月額型サービスの毎日の自動処理（GitHub Actions から1日1回実行）
//  1. 無料お試しが「明日」終わるお客様に、前日のお知らせメールを送る
//     （7日前のお知らせは Stripe の自動メールに任せる）
//  2. 前日からの新しいお申し込みを、運営者へまとめてメールで知らせる
//     （同じメールアドレスで過去に申し込みがある場合は「お試し2回目の可能性」と表示）
//
// 必要な環境変数（GitHub の Secrets に登録）
//   STRIPE_SECRET_KEY  Stripe のシークレットキー（制限付きキー推奨）
//   RESEND_API_KEY     メール送信サービス Resend の APIキー
//   MAIL_FROM          送信元（例: サクアプ <billing@example.com>）
//   OWNER_EMAIL        運営者の受信アドレス
// 任意
//   DRY_RUN=1          メールを送らず、内容をログに出すだけ
//   ACCOUNT_URL        お支払い・解約ページのURL

const env = process.env;
const DRY = env.DRY_RUN === "1";
const ACCOUNT_URL = env.ACCOUNT_URL || "https://knotscheme.github.io/sakuapp/account/";
const NAMES = { menu: "モバイルメニュー", salon: "サロン予約" };
const PLANS = { self: "セルフ", omakase: "おまかせ" };

for (const k of ["STRIPE_SECRET_KEY", "RESEND_API_KEY", "MAIL_FROM", "OWNER_EMAIL"]) {
  if (!env[k]) {
    console.log(`環境変数 ${k} が未設定のため、何もせずに終了します。`);
    process.exit(0);
  }
}

async function stripe(path, params = {}, method = "GET") {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => body.append(k, x));
    else if (v !== undefined) body.append(k, String(v));
  }
  const url = "https://api.stripe.com/v1" + path + (method === "GET" && [...body].length ? "?" + body : "");
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: "Bearer " + env.STRIPE_SECRET_KEY,
      ...(method === "GET" ? {} : { "Content-Type": "application/x-www-form-urlencoded" }),
    },
    body: method === "GET" ? undefined : body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Stripe ${path}: ${json.error && json.error.message}`);
  return json;
}

async function listAll(path, params) {
  const out = [];
  let starting_after;
  for (;;) {
    const page = await stripe(path, { ...params, limit: 100, starting_after });
    out.push(...page.data);
    if (!page.has_more) return out;
    starting_after = page.data[page.data.length - 1].id;
  }
}

async function mail(to, subject, text) {
  if (DRY) {
    console.log(`--- [DRY_RUN] to: ${to}\n件名: ${subject}\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, text }),
  });
  if (!res.ok) throw new Error(`メール送信に失敗しました（${to}）: ${await res.text()}`);
}

const jp = (sec) =>
  new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric" }).format(new Date(sec * 1000));
const yen = (n) => n.toLocaleString("ja-JP") + "円";

// ---------- 1. 無料お試しの前日のお知らせ ----------
async function remindTrialEnding() {
  const now = Math.floor(Date.now() / 1000);
  const subs = await listAll("/subscriptions", { status: "trialing", "expand[]": ["data.customer"] });
  let sent = 0;
  for (const s of subs) {
    if (!s.trial_end || s.cancel_at_period_end) continue; // 解約済みは送らない
    const left = s.trial_end - now;
    if (left <= 0 || left > 36 * 3600) continue; // 36時間以内に終わるものだけ（毎日1回の実行で漏れなく1回）
    if (s.metadata && s.metadata.reminded_1d) continue; // 送信済み
    const c = s.customer || {};
    if (!c.email) continue;
    const item = s.items && s.items.data && s.items.data[0];
    const amount = item && item.price && item.price.unit_amount != null ? yen(item.price.unit_amount) : "1,980円";
    const service = NAMES[(s.metadata && s.metadata.service) || ""] || "サクアプ";
    await mail(
      c.email,
      `【サクアプ】無料お試しがまもなく終わります（${jp(s.trial_end)}に初回のご請求）`,
      [
        `${c.name || "お客"}様`,
        "",
        `${service}の無料お試し期間が、まもなく終わります。`,
        `そのままお使いいただく場合は、手続きは必要ありません。${jp(s.trial_end)}に初回の月額${amount}をご登録のクレジットカードに請求し、以降1か月ごとに自動で更新します。`,
        "",
        "続けない場合は、それまでに下のページから解約してください。期間中の解約なら料金はかかりません。",
        ACCOUNT_URL,
        "",
        "サクアプ",
      ].join("\n")
    );
    if (!DRY) await stripe(`/subscriptions/${s.id}`, { "metadata[reminded_1d]": now }, "POST");
    sent++;
  }
  return sent;
}

// ---------- 2. 新しいお申し込みのまとめ（運営者あて） ----------
async function digestNewSignups() {
  const since = Math.floor(Date.now() / 1000) - 24 * 3600;
  const sessions = await listAll("/checkout/sessions", { "created[gte]": since, status: "complete" });
  if (!sessions.length) return 0;
  const lines = [];
  for (const ss of sessions) {
    const [svc, plan] = String(ss.client_reference_id || "").split("_");
    const email = (ss.customer_details && ss.customer_details.email) || "";
    const fields = (ss.custom_fields || []).map((f) => `${f.label && f.label.custom}: ${(f.text && f.text.value) || (f.dropdown && f.dropdown.value) || ""}`);
    let flag = "";
    if (email) {
      const prev = await listAll("/customers", { email });
      if (prev.length > 1) flag = "  ※同じメールアドレスで過去にも登録あり（お試し2回目の可能性）";
    }
    lines.push(
      `・${NAMES[svc] || "不明なサービス"} / ${PLANS[plan] || "不明なプラン"} / ${email}${flag}` +
        (fields.length ? `\n  ${fields.join(" / ")}` : "") +
        `\n  支払い済み: ${yen(ss.amount_total || 0)}` +
        (plan === "omakase" ? "  → 入力フォームのご案内を送ってください（1営業日以内）" : "  → 管理画面のご案内を送ってください（1営業日以内）")
    );
    // サブスクリプションに サービス・プラン を記録（前日メールの文面に使う）
    if (ss.subscription && svc && !DRY) {
      await stripe(`/subscriptions/${ss.subscription}`, { "metadata[service]": svc, "metadata[plan]": plan || "" }, "POST");
    }
  }
  await mail(env.OWNER_EMAIL, `【サクアプ】新しいお申し込み ${sessions.length}件`, lines.join("\n\n"));
  return sessions.length;
}

const reminded = await remindTrialEnding();
const signups = await digestNewSignups();
console.log(`前日のお知らせ: ${reminded}件 / 新しいお申し込み: ${signups}件`);

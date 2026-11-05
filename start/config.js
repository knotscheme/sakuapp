/*
  サクアプ 申し込み設定（飲食店「モバイルメニュー」・サロン「サロン予約」）
  --------------------------------------------------------------
  正式受付を始めるときは、Stripe で作った Payment Link の URL を入れて OPEN を true にします。
  手順は docs/billing-setup.md を見てください。
  URL が空のプランは「受付前」の表示になり、申し込みボタンは押せません。
*/
window.SAKUAPP_BILLING = {
  OPEN: false,                 // true にすると申し込みを受け付けます
  OPEN_NOTE: "正式受付は2027年6月ごろからです。先行のご案内はLINEで受け付けています。",
  TRIAL_DAYS: 30,
  MONTHLY: 1980,
  OMAKASE: 9800,
  LINE_URL: "https://lin.ee/vC2S0M9",
  // Stripe の Payment Link（月額1,980円・30日無料お試し）
  LINKS: {
    menu:  { self: "", omakase: "" },
    salon: { self: "", omakase: "" }
  },
  // Stripe カスタマーポータルのログインURL（解約・カード変更・領収書）
  PORTAL_URL: ""
};

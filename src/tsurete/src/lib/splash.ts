// 読みこみ画面を、同じブラウザで2回目以降は最初から隠すための小さなスクリプト
export const SPLASH_SKIP = `;try{if(sessionStorage.getItem("tsr-splash"))document.documentElement.setAttribute("data-splash","skip")}catch(e){}`;

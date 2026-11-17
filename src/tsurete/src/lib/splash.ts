// 読みこみ画面を、同じタブで2回目以降は短い版にするための小さなスクリプト
export const SPLASH_SKIP = `;try{if(sessionStorage.getItem("tsr-splash"))document.documentElement.setAttribute("data-splash","short")}catch(e){}`;

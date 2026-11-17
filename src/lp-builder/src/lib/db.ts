// 作りかけのLPを、このブラウザの中（IndexedDB）に保存する。サーバーには送らない
const DB = "lp-builder";
const STORE = "kv";

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await open();
  return new Promise((res, rej) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => { res(req ? (req.result as T) : undefined); db.close(); };
    t.onerror = () => { rej(t.error); db.close(); };
  });
}

export const dbGet = <T>(key: string) => tx<T>("readonly", (s) => s.get(key) as IDBRequest<T>);
export const dbSet = (key: string, val: unknown) => tx("readwrite", (s) => { s.put(val, key); });
export const dbDel = (key: string) => tx("readwrite", (s) => { s.delete(key); });
export async function dbClearImages() {
  await tx("readwrite", (s) => {
    const r = s.openCursor();
    r.onsuccess = () => { const c = r.result; if (!c) return; if (String(c.key).startsWith("img:")) c.delete(); c.continue(); };
  });
}

// 画像は「元の画像」と「切り抜いたあとの画像」を分けて持つ（切り抜きの位置を後から直せるように）
export type StoredImg = { orig: Blob; out: Blob };
export const imgKey = (slot: string) => `img:${slot}`;

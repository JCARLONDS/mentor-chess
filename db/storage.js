const DB_NAME = "mentor_chess_db";
const DB_VERSION = 1;
const STORE = "kv";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function get(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const st = tx.objectStore(STORE);
    const r = st.get(key);
    r.onsuccess = () => resolve(r.result ?? null);
    r.onerror = () => reject(r.error);
  });
}

async function set(key, val) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const st = tx.objectStore(STORE);
    const r = st.put(val, key);
    r.onsuccess = () => resolve(true);
    r.onerror = () => reject(r.error);
  });
}

// -------------------
// Usuário atual
// -------------------
export async function getCurrentUser() {
  return await get("currentUser");
}

export async function setCurrentUser(username) {
  return await set("currentUser", username);
}

export async function resetCurrentUser() {
  return await set("currentUser", null);
}

// -------------------
// Perfil por usuário
// -------------------
export async function ensureProfile(username) {
  const key = `profile:${username}`;
  const existing = await get(key);
  if (existing) return existing;

  const profile = {
    username,
    createdAt: Date.now(),
    lastLogin: Date.now(),

    // Treino diário
    streak: 0,
    lastTrainDay: null,

    // Futuro: repetição espaçada (flashcards)
    flashcardState: {},

    // Futuro: stats de drills
    drillStats: {},

    // Futuro: partidas importadas do chess.com
    games: []
  };

  await set(key, profile);
  return profile;
}

export async function loadProfile(username) {
  const p = await get(`profile:${username}`);
  if (!p) return ensureProfile(username);

  p.lastLogin = Date.now();
  await set(`profile:${username}`, p);
  return p;
}

export async function saveProfile(username, profile) {
  await set(`profile:${username}`, profile);
  return true;
}

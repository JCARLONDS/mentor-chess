import { loadProfile, saveProfile } from "../db/storage.js";

function sameDay(a, b) {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export async function renderHome(root, username, goToTab) {
  const profile = await loadProfile(username);

  root.innerHTML = `
    <div class="card">
      <div class="h1">Treino do dia</div>
      <p class="p">
        Constância vence talento.
        Hoje só <b>5 minutos</b>.
      </p>

      <div style="margin-top:10px">
        <span class="badge">🔥 Streak: ${profile.streak}</span>
      </div>

      <div style="margin-top:14px">
        <button class="btn" id="btnStart" style="width:100%">
          Começar treino
        </button>
      </div>
    </div>

    <div class="card">
      <div class="h1">Atalhos</div>
      <p class="p">Ir direto para uma área.</p>

      <div style="margin-top:10px;display:flex;gap:10px">
        <button class="btn" id="btnFlash">Flashcards</button>
        <button class="btn" id="btnDrill">Drill</button>
      </div>
    </div>
  `;

  const btnStart = root.querySelector("#btnStart");

  btnStart.addEventListener("click", async () => {
    const today = Date.now();
    const yesterday = today - 24 * 60 * 60 * 1000;

    if (!sameDay(profile.lastTrainDay, today)) {
      profile.streak = sameDay(profile.lastTrainDay, yesterday)
        ? profile.streak + 1
        : 1;

      profile.lastTrainDay = today;
      await saveProfile(username, profile);
    }

    goToTab("flashcards");
  });

  root.querySelector("#btnFlash").onclick = () => goToTab("flashcards");
  root.querySelector("#btnDrill").onclick = () => goToTab("drill");
}

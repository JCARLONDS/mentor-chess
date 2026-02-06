import { getCurrentUser, setCurrentUser, ensureProfile, resetCurrentUser } from "./db/storage.js";
import { renderLogin } from "./ui/login.js";
import { renderHome } from "./ui/home.js";
import { renderFlashcards } from "./ui/flashcards.js";
import { renderDrill } from "./ui/drill.js";
import { renderPartidas } from "./ui/partidas.js";
import { renderAnalise } from "./ui/analise.js";

const view = document.getElementById("view");
const subtitle = document.getElementById("subtitle");
const btnSwitchUser = document.getElementById("btnSwitchUser");
const tabs = [...document.querySelectorAll(".tab")];

let state = {
  tab: "home",
  user: null,
};

function setActiveTab(tab) {
  state.tab = tab;
  tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  render();
}

async function bootstrap() {
  // Registrar Service Worker (PWA)
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./pwa/service-worker.js");
    } catch (e) {
      // se falhar, o app ainda funciona (só sem offline)
    }
  }

  state.user = await getCurrentUser();

  btnSwitchUser.addEventListener("click", async () => {
    await resetCurrentUser();
    state.user = null;
    setActiveTab("home");
  });

  tabs.forEach(t => t.addEventListener("click", () => setActiveTab(t.dataset.tab)));

  render();
}

async function onLogin(username) {
  await ensureProfile(username);
  await setCurrentUser(username);
  state.user = username;
  setActiveTab("home");
}

async function render() {
  subtitle.textContent = state.user
    ? `Usuário: ${state.user} • 5 min/dia`
    : "Treino rápido • 5 min/dia";

  // Se não está logado, mostra login
  if (!state.user) {
    view.innerHTML = "";
    renderLogin(view, onLogin);
    return;
  }

  view.innerHTML = "";

  if (state.tab === "home") return renderHome(view, state.user, setActiveTab);
  if (state.tab === "flashcards") return renderFlashcards(view, state.user);
  if (state.tab === "drill") return renderDrill(view, state.user);
  if (state.tab === "partidas") return renderPartidas(view, state.user);
  if (state.tab === "analise") return renderAnalise(view, state.user);
}

bootstrap();

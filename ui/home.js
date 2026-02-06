export function renderHome(root, username) {
  root.innerHTML = `
    <div class="card">
      <div class="h1">Bem-vindo ao Mentor Chess</div>
      <p class="p">
        Treine aberturas, padrões e posições críticas todos os dias.
      </p>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <span class="badge">👤 ${username}</span>
        <span class="badge">♟️ Tabuleiro ativo</span>
        <span class="badge">✨ Animações</span>
      </div>
    </div>

    <div class="board-wrap">
      <div id="home-board"></div>
    </div>

    <div class="card">
      <div class="h1">Experimente</div>
      <p class="p">
        Faça um lance no tabuleiro ou use os botões abaixo.
      </p>

      <div style="margin-top:12px;display:flex;gap:10px">
        <button class="btn" id="btnHomeReset"
          style="flex:1;background:#EAF1FF;color:#0B5FFF;border:1px solid #E6ECF5">
          Reset
        </button>
        <button class="btn" id="btnHomeMove" style="flex:1">
          Animar e2–e4
        </button>
      </div>

      <p class="p" style="margin-top:10px;font-size:12px">
        Em breve: lições guiadas, transposições e análise automática.
      </p>
    </div>
  `;

  const ground = window.Chessground(
    document.getElementById("home-board"),
    {
      coordinates: true,
      animation: { enabled: true, duration: 220 },
      highlight: { lastMove: true, check: true },
      movable: {
        free: false,
        color: "white",
        showDests: true,
        events: {
          after: (orig, dest) => {
            ground.move(orig, dest);
          }
        }
      },
      fen: "start"
    }
  );

  root.querySelector("#btnHomeMove").onclick = () => {
    ground.set({ fen: "start" });
    ground.move("e2", "e4");
  };

  root.querySelector("#btnHomeReset").onclick = () => {
    ground.set({ fen: "start" });
  };
}

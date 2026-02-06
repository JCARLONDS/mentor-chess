export function renderDrill(root, username) {
  root.innerHTML = `
    <div class="card">
      <div class="h1">Drill</div>
      <p class="p">Tabuleiro com peças e animações (estilo Lichess/Lotus).</p>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <span class="badge">👤 ${username}</span>
        <span class="badge">♟️ Chessground</span>
        <span class="badge">✨ Animação</span>
      </div>
    </div>

    <div class="board-wrap">
      <div id="board"></div>
    </div>

    <div class="card">
      <div class="h1">Teste rápido</div>
      <p class="p">Toque em uma peça branca para ver as casas. Faça um lance para ver a animação.</p>

      <div style="margin-top:12px;display:flex;gap:10px">
        <button class="btn" id="btnReset" style="flex:1;background:#EAF1FF;color:#0B5FFF;border:1px solid #E6ECF5">
          Reset
        </button>
        <button class="btn" id="btnMove" style="flex:1">
          Animar e2-e4
        </button>
      </div>

      <p class="p" style="margin-top:10px;font-size:12px">
        Próximo passo: validar lances (chess.js) e ligar Stockfish (WASM).
      </p>
    </div>
  `;

  // Chessground é global (carregado no index.html)
  const ground = window.Chessground(document.getElementById("board"), {
    coordinates: true,
    animation: { enabled: true, duration: 220 },
    highlight: { lastMove: true, check: true },
    movable: {
      free: false,
      color: "white",
      showDests: true,
      events: {
        after: (orig, dest) => {
          // movimenta no tabuleiro com animação
          ground.move(orig, dest);
        }
      }
    },
    fen: "start"
  });

  root.querySelector("#btnMove").onclick = () => {
    ground.set({ fen: "start" });
    ground.move("e2", "e4");
  };

  root.querySelector("#btnReset").onclick = () => {
    ground.set({ fen: "start" });
  };
}

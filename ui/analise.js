export function renderAnalise(root, username) {
  root.innerHTML = `
    <div class="card">
      <div class="h1">Análise (Stockfish)</div>
      <p class="p">
        Nesta etapa MVP, a tela já existe.
        No próximo passo vamos rodar Stockfish no navegador e analisar partidas/posições.
      </p>

      <div style="margin-top:10px">
        <span class="badge">⚙️ Engine</span>
        <span class="badge">📈 Avaliação</span>
      </div>

      <div style="margin-top:14px">
        <button class="btn" id="btnTest" style="width:100%">
          Testar análise
        </button>
      </div>

      <p class="p" style="margin-top:10px;font-size:12px">
        Depois você vai abrir uma partida e clicar “Analisar”.
      </p>
    </div>
  `;

  root.querySelector("#btnTest").onclick = () => {
    alert("Próximo passo: plugar Stockfish.js (WASM) e analisar PGN/FEN.");
  };
}

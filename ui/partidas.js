export function renderPartidas(root, username) {
  root.innerHTML = `
    <div class="card">
      <div class="h1">Minhas partidas (Chess.com)</div>
      <p class="p">
        Nesta etapa MVP, a tela já existe.
        No próximo passo vamos integrar a API pública do Chess.com para importar PGNs.
      </p>

      <div style="margin-top:10px">
        <span class="badge">👤 ${username}</span>
        <span class="badge">🌐 Importação</span>
      </div>

      <div style="margin-top:14px">
        <button class="btn" id="btnImport" style="width:100%">
          Importar últimas partidas
        </button>
      </div>

      <p class="p" style="margin-top:10px;font-size:12px">
        Depois, você poderá clicar numa partida e mandar para Análise.
      </p>
    </div>
  `;

  root.querySelector("#btnImport").onclick = () => {
    alert("Próximo passo: integrar Chess.com (importar partidas e PGN).");
  };
}

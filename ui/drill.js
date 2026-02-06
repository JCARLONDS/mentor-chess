export function renderDrill(root, username) {
  root.innerHTML = `
    <div class="card">
      <div class="h1">Drill (MVP)</div>
      <p class="p">
        Nesta versão inicial, o drill é conceitual.
        Depois vamos ligar ao tabuleiro e ao Stockfish.
      </p>
    </div>

    <div class="card">
      <div class="h1">Pergunta</div>
      <p class="p"><b>Você deve atacar agora ou desenvolver/rocar?</b></p>

      <div style="margin-top:12px;display:flex;gap:10px">
        <button class="btn" id="a">Atacar</button>
        <button class="btn" id="b" style="background:#EAF1FF;color:#0B5FFF;border:1px solid #E6ECF5">
          Desenvolver/rocar
        </button>
      </div>

      <p class="p" id="out" style="margin-top:12px"></p>
    </div>
  `;

  const out = root.querySelector("#out");

  root.querySelector("#a").onclick = () => {
    out.textContent =
      "❌ Normalmente não. Sem rei seguro e sem peças bem desenvolvidas, você entrega tempo e cria fraquezas.";
  };

  root.querySelector("#b").onclick = () => {
    out.textContent =
      "✅ Boa. Desenvolvimento e rei seguro deixam seu ataque real, não improvisado.";
  };
}

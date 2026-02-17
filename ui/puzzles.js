window.UI_PUZZLES = (() => {

  function toast(msg){
    let t = document.querySelector(".toast");
    if(!t){
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"), 1400);
  }

  function clearHL(boardEl){
    boardEl.querySelectorAll(".hl-from,.hl-to,.hl-bad,.hl-pulse,.hl-last")
      .forEach(el => el.classList.remove("hl-from","hl-to","hl-bad","hl-pulse","hl-last"));
  }
  function addHL(boardEl, square, cls){
    const sq = boardEl.querySelector(`.square-${square}`);
    if(sq) sq.classList.add(cls);
  }

  function render(container) {
    const user = DB.getActiveUser();
    if (!user) { window.router.go("login"); return; }

    const puzzles = window.PUZZLES || [];
    const p = puzzles[Math.floor(Math.random() * puzzles.length)];

    container.innerHTML = `
      <div class="topbar">
        <div class="brand" style="font-size:26px">Puzzles</div>
        <div class="top-icons">
          <div class="pill"><span class="dot"></span><strong>${user.stats?.streak ?? 1}</strong></div>
          <div class="iconbtn" id="back" title="Voltar">←</div>
        </div>
      </div>

      <div class="card">
        <div style="font-weight:900; font-size:18px">${p.tema}</div>
        <div class="note">Dica: ${p.dica}</div>
      </div>

      <div class="board-card">
        <div id="puzzleBoard"></div>
      </div>

      <div class="card">
        <div class="row">
          <div class="kpi">
            <strong>${user.stats?.puzzlesRating ?? 700}</strong>
            <small>Rating</small>
          </div>
          <div class="kpi">
            <strong>${user.stats?.puzzlesSolved ?? 0}</strong>
            <small>Resolvidos</small>
          </div>
        </div>

        <div style="height:12px"></div>
        <button class="btn primary" id="btnShow">Mostrar solução</button>
        <button class="btn orange" id="btnClaim" disabled style="margin-top:10px; width:100%">Confirmar (+XP)</button>
        <div class="note" id="solutionBox"></div>
      </div>
    `;

    container.querySelector("#back").onclick = () => window.router.go("home");

    const game = new Chess(p.fen);

    const board = Chessboard("puzzleBoard", {
      draggable: true,
      position: game.fen(),
      moveSpeed: 260,
      snapbackSpeed: 220,
      snapSpeed: 120,
      showNotation: false,
      pieceTheme: "https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/img/chesspieces/wikipedia/{piece}.png"
    });

    const boardEl = document.getElementById("puzzleBoard");
    let solvedFirstMove = false;

    function expectedMoveFromSAN(san){
      const legal = game.moves({ verbose: true });
      return legal.find(m => m.san === san) || null;
    }

    function showExpectedHighlight(){
      clearHL(boardEl);
      const expected = expectedMoveFromSAN(p.solucaoSAN[0]);
      if(!expected) return;
      addHL(boardEl, expected.from, "hl-from");
      addHL(boardEl, expected.to, "hl-to");
      addHL(boardEl, expected.to, "hl-pulse");
    }

    function markLastMove(from, to){
      addHL(boardEl, from, "hl-last");
      addHL(boardEl, to, "hl-last");
    }

    board.config.onDrop = (source, target) => {
      const expected = expectedMoveFromSAN(p.solucaoSAN[0]);
      const attempt = { from: source, to: target, promotion: "q" };

      if(expected){
        if(!(attempt.from === expected.from && attempt.to === expected.to)){
          clearHL(boardEl);
          addHL(boardEl, source, "hl-bad");
          addHL(boardEl, target, "hl-bad");
          toast("Não é esse 👀 tenta o lance destacado");
          return "snapback";
        }
      }

      const mv = game.move(attempt);
      if (mv === null) return "snapback";
      board.position(game.fen());

      clearHL(boardEl);
      markLastMove(mv.from, mv.to);

      solvedFirstMove = true;
      container.querySelector("#btnClaim").disabled = false;
      toast("Boa! ✅");

      setTimeout(() => {
        const nextSAN = p.solucaoSAN[1];
        if(!nextSAN) return;
        const next = expectedMoveFromSAN(nextSAN);
        if(!next) return;
        clearHL(boardEl);
        addHL(boardEl, next.from, "hl-from");
        addHL(boardEl, next.to, "hl-to");
        addHL(boardEl, next.to, "hl-pulse");
      }, 450);
    };

    showExpectedHighlight();

    container.querySelector("#btnShow").onclick = () => {
      container.querySelector("#solutionBox").innerHTML =
        `<div style="margin-top:10px"><strong>Solução:</strong> ${p.solucaoSAN.join(" • ")}</div>`;
      showExpectedHighlight();
      toast("Solução exibida 👀");
    };

    container.querySelector("#btnClaim").onclick = () => {
      if(!solvedFirstMove){
        toast("Acerte o lance destacado primeiro 🙂");
        return;
      }
      DB.awardXP(25, "mastery");
      DB.updateUser(u => {
        u.stats.puzzlesSolved = (u.stats.puzzlesSolved || 0) + 1;
        u.stats.puzzlesRating = (u.stats.puzzlesRating || 700) + 8;
      });
      toast("+25 XP ✅");
      window.router.go("home");
    };
  }

  return { render };
})();
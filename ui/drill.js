window.UI_DRILL = (() => {

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

  function pickLine(openingId) {
    const fc = window.FLASHCARDS || [];
    const chosen = openingId ? fc.find(x => x.id === openingId) : null;
    if(chosen) return chosen;
    return fc[Math.floor(Math.random() * fc.length)];
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

    const openingId = window.router.params?.openingId;
    const line = pickLine(openingId);

    container.innerHTML = `
      <div class="topbar">
        <div class="brand" style="font-size:26px">Drill</div>
        <div class="top-icons">
          <div class="pill"><span class="dot"></span><strong>${user.stats?.streak ?? 1}</strong></div>
          <div class="iconbtn" id="back" title="Voltar">←</div>
        </div>
      </div>

      <div class="card">
        <div style="font-weight:900; font-size:18px">${line.title}</div>
        <div class="note">${line.focus || ""}</div>
      </div>

      <div class="board-card">
        <div id="drillBoard"></div>
        <div class="note" id="drillHint" style="margin-top:10px;"></div>
      </div>

      <div class="card">
        <div class="row" style="gap:10px;">
          <button class="btn primary" id="btnHint">Dica</button>
          <button class="btn" id="btnReset">Reiniciar</button>
        </div>
        <div style="height:10px"></div>
        <button class="btn orange" id="btnFinish">Concluir treino (+XP)</button>
        <div class="note" id="drillExplain"></div>
      </div>
    `;

    container.querySelector("#back").onclick = () => window.router.go("home");

    const game = new Chess();
    let step = 0;

    const board = Chessboard("drillBoard", {
      draggable: true,
      position: game.fen(),
      moveSpeed: 260,
      snapbackSpeed: 220,
      snapSpeed: 120,
      showNotation: false,
      pieceTheme: "https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/img/chesspieces/wikipedia/{piece}.png",
      onDrop: (src, dst) => {
        const expected = line.moves[step];
        if (!expected) return "snapback";

        const legal = game.moves({ verbose: true });
        const targetMove = legal.find(m => m.san === expected.san);
        const attempted = { from: src, to: dst, promotion: "q" };
        const boardEl = document.getElementById("drillBoard");

        if (targetMove) {
          if (!(attempted.from === targetMove.from && attempted.to === targetMove.to)) {
            clearHL(boardEl);
            addHL(boardEl, src, "hl-bad");
            addHL(boardEl, dst, "hl-bad");
            toast("Ainda não! 👀 segue o lance destacado");
            return "snapback";
          }
        }

        const move = game.move(attempted);
        if (move === null) return "snapback";

        board.position(game.fen());

        clearHL(boardEl);
        addHL(boardEl, move.from, "hl-last");
        addHL(boardEl, move.to, "hl-last");

        container.querySelector("#drillExplain").innerHTML =
          `<div style="margin-top:10px"><strong>Por quê:</strong> ${expected.explain || ""}</div>`;

        step++;

        // auto move (if next exists and it's opponent move)
        const next = line.moves[step];
        if (next) {
          const legal2 = game.moves({ verbose: true });
          const auto = legal2.find(m => m.san === next.san);
          if (auto) {
            setTimeout(() => {
              const mv2 = game.move({ from: auto.from, to: auto.to, promotion: "q" });
              board.position(game.fen());

              clearHL(boardEl);
              addHL(boardEl, mv2.from, "hl-last");
              addHL(boardEl, mv2.to, "hl-last");

              container.querySelector("#drillExplain").innerHTML =
                `<div style="margin-top:10px"><strong>Resposta:</strong> ${next.san}</div>` +
                (next.explain ? `<div style="margin-top:6px"><strong>Ideia:</strong> ${next.explain}</div>` : "");

              step++;
              showHintHighlight();
            }, 420);
          } else {
            showHintHighlight();
          }
        } else {
          showHintHighlight();
        }
      }
    });

    function showHintHighlight() {
      const boardEl = document.getElementById("drillBoard");
      const expected = line.moves[step];
      if (!expected) {
        container.querySelector("#drillHint").textContent = "Linha concluída ✅";
        clearHL(boardEl);
        return;
      }
      container.querySelector("#drillHint").innerHTML =
        `Próximo lance: <strong>${expected.san}</strong> ${expected.explain ? "— " + expected.explain : ""}`;

      const legal = game.moves({ verbose: true });
      const mv = legal.find(m => m.san === expected.san);
      clearHL(boardEl);
      if (mv) {
        addHL(boardEl, mv.from, "hl-from");
        addHL(boardEl, mv.to, "hl-to");
        addHL(boardEl, mv.to, "hl-pulse");
      }
    }

    container.querySelector("#btnHint").onclick = showHintHighlight;

    container.querySelector("#btnReset").onclick = () => {
      step = 0;
      game.reset();
      board.position(game.fen());
      container.querySelector("#drillHint").textContent = "";
      container.querySelector("#drillExplain").textContent = "";
      toast("Reiniciado 🔁");
      showHintHighlight();
    };

    container.querySelector("#btnFinish").onclick = () => {
      DB.awardXP(35, "mastery");
      DB.updateUser(u => { u.stats.guidedWins = (u.stats.guidedWins||0) + 1; });
      toast("+35 XP ✅ Treino concluído");
      window.router.go("home");
    };

    showHintHighlight();
  }

  return { render };
})();
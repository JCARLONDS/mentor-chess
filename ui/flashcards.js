window.UI_FLASHCARDS = (() => {

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

  function getOpening(openingId){
    const all = window.FLASHCARDS || [];
    if(openingId) return all.find(o => o.id === openingId) || all[0];
    return all[0];
  }

  function render(container){
    const user = DB.getActiveUser();
    if(!user){ window.router.go("login"); return; }

    const openingId = window.router.params?.openingId;
    const o = getOpening(openingId);

    container.innerHTML = `
      <div class="topbar">
        <div class="brand" style="font-size:26px">${o.title}</div>
        <div class="top-icons">
          <div class="iconbtn" id="back" title="Voltar">←</div>
        </div>
      </div>

      <div class="board-card">
        <div id="flashBoard"></div>
        <div class="note">${o.focus || ""}</div>
      </div>

      <div class="card">
        <div class="row" style="justify-content:space-between;">
          <button class="btn" id="prev">‹</button>
          <div style="text-align:center;">
            <div style="font-weight:900">Passo <span id="stepN">1</span> / <span id="stepT">${o.moves.length}</span></div>
            <div class="note" id="explain"></div>
          </div>
          <button class="btn" id="next">›</button>
        </div>

        <div style="height:12px"></div>
        <button class="btn orange" id="train">Treinar (Drill)</button>
      </div>
    `;

    container.querySelector("#back").onclick = () => window.router.go("home");

    const game = new Chess();
    let idx = 0;

    const board = Chessboard("flashBoard", {
      draggable: false,
      position: "start",
      moveSpeed: 260,
      showNotation: false,
      pieceTheme: "https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/img/chesspieces/wikipedia/{piece}.png"
    });

    function applyTo(i){
      game.reset();
      for(let k=0;k<=i;k++){
        const san = o.moves[k]?.san;
        if(!san) continue;
        try{ game.move(san); }catch(e){}
      }
      board.position(game.fen());
      container.querySelector("#stepN").textContent = String(i+1);
      container.querySelector("#explain").textContent = (o.moves[i]?.explain || "");
    }

    function clamp(n){ return Math.max(0, Math.min(o.moves.length-1, n)); }

    container.querySelector("#prev").onclick = () => { idx = clamp(idx-1); applyTo(idx); };
    container.querySelector("#next").onclick = () => { idx = clamp(idx+1); applyTo(idx); };

    container.querySelector("#train").onclick = () => {
      toast("Abrindo Drill…");
      window.router.go("drill", { openingId: o.id });
    };

    applyTo(idx);
  }

  return { render };
})();
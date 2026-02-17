window.UI_HOME = (() => {

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

  function openingsBy(side){
    return (window.FLASHCARDS || []).filter(o => o.side === side);
  }

  function renderMiniBoard(elId, fen){
    // Use inline SVG pieceTheme (defined in app.js) to avoid broken images/offline issues
    Chessboard(elId, {
      draggable: false,
      position: fen || "start",
      showNotation: false,
      pieceTheme: window.pieceTheme
    });
  }

  function render(container){
    const user = DB.getActiveUser();
    if(!user){ window.router.go("login"); return; }

    const streak = user.stats?.streak ?? 1;
    const xp = user.stats?.xp ?? 0;
    const rank = DB.getRankName(xp);

    container.innerHTML = `
      <div class="topbar">
        <div class="brand">MentorChess</div>
        <div class="top-icons">
          <div class="pill" title="Streak"><span class="dot"></span> <strong>${streak}</strong></div>
          <div class="iconbtn" id="btnProfile" title="Trocar usuário">👤</div>
        </div>
      </div>

      <div class="hero-card clickable" id="todayCard">
        <div class="hero-title">Treino de hoje</div>

        <div class="task">
          <div class="left">
            <div class="lock">🔒</div>
            <div style="min-width:0">
              <div style="font-weight:800">Descubra novas linhas</div>
              <div class="progress" aria-label="progresso"><div style="width: 0%"></div></div>
            </div>
          </div>
          <div class="chev">›</div>
        </div>

        <div class="task">
          <div class="left">
            <div style="width:18px;height:18px;border-radius:6px;background:rgba(0,0,0,.18)"></div>
            <div style="min-width:0">
              <div style="font-weight:800">Dominar linhas</div>
              <div class="progress" aria-label="progresso"><div style="width: 0%"></div></div>
            </div>
          </div>
          <div class="chev">›</div>
        </div>

        <div class="subnote">Foco: Treino guiado + Puzzle</div>
      </div>

      <div style="height:14px"></div>

      <div class="card">
        <div class="row">
          <div class="kpi">
            <strong>${xp}</strong>
            <small>XP total</small>
          </div>
          <div class="kpi">
            <strong>${rank}</strong>
            <small>Rank atual</small>
          </div>
        </div>
        <div style="height:12px"></div>
        <button class="big-btn" id="btnStart">Começar treino</button>
        <div class="note">Modo recomendado: <strong>Drill</strong> (linha guiada) e depois <strong>Puzzles</strong>.</div>
      </div>

      <div class="section-title">Aberturas de Brancas</div>
      <div class="carousel" id="carWhite"></div>

      <div class="section-title">Aberturas de Negras</div>
      <div class="carousel" id="carBlack"></div>
    `;

    container.querySelector("#btnProfile").onclick = () => window.router.go("login");
    container.querySelector("#btnStart").onclick = () => window.router.go("drill");
    container.querySelector("#todayCard").onclick = () => window.router.go("drill");

    function fillCarousel(el, list, prefix){
      el.innerHTML = list.map((o, i) => `
        <div class="open-card clickable" data-id="${o.id}">
          <div class="open-title">${o.title}</div>
          <div class="mini-board" id="${prefix}_${i}"></div>
        </div>
      `).join("") + `
        <div class="open-card add-card" id="add_${prefix}" title="Adicionar abertura">+</div>
      `;

      list.forEach((o, i) => renderMiniBoard(`${prefix}_${i}`, o.fenPreview || "start"));

      el.querySelectorAll(".open-card[data-id]").forEach(card => {
        card.onclick = () => {
          const id = card.getAttribute("data-id");
          window.router.go("flashcards", { openingId: id });
        };
      });

      el.querySelector("#add_"+prefix).onclick = () => toast("Adicionar abertura: em breve 🙂");
    }

    fillCarousel(container.querySelector("#carWhite"), openingsBy("white"), "w");
    fillCarousel(container.querySelector("#carBlack"), openingsBy("black"), "b");
  }

  return { render };
})();
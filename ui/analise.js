window.UI_ANALISE = (() => {
  function render(container){
    const user = DB.getActiveUser();
    if(!user){ window.router.go("login"); return; }

    const xp = user.stats?.xp ?? 0;
    const rank = DB.getRankName(xp);
    const rating = user.stats?.puzzlesRating ?? 700;

    container.innerHTML = `
      <div class="topbar">
        <div class="brand" style="font-size:26px">Estatísticas</div>
        <div class="top-icons">
          <div class="pill"><span class="dot"></span><strong>${user.stats?.streak ?? 1}</strong></div>
        </div>
      </div>

      <div class="card" style="text-align:center; padding: 22px;">
        <div style="width:120px;height:120px;border-radius:999px;margin:0 auto 10px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.22), rgba(255,255,255,0)),
                      rgba(46,204,113,.20);
          border: 6px solid rgba(255,255,255,.08);
          display:grid; place-items:center;
          font-size:44px;">⭐</div>
        <div style="font-weight:900; font-size:30px">${user.username}</div>
        <div class="note">${rank}</div>
      </div>

      <div class="card">
        <div class="row">
          <div class="kpi">
            <strong>${rating}</strong>
            <small>Rating puzzles</small>
          </div>
          <div class="kpi">
            <strong>${user.stats?.puzzlesSolved ?? 0}</strong>
            <small>Puzzles resolvidos</small>
          </div>
        </div>
        <div style="height:10px"></div>
        <div class="row">
          <div class="kpi">
            <strong>${user.stats?.guidedWins ?? 0}</strong>
            <small>Drills concluídos</small>
          </div>
          <div class="kpi">
            <strong>${xp}</strong>
            <small>XP total</small>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="font-weight:900">Metas</div>
        <div class="note">• Resolver 5 puzzles<br/>• Completar 3 drills<br/>• Manter streak</div>
      </div>
    `;
  }
  return { render };
})();
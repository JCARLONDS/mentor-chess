window.UI_PARTIDAS = (() => {
  function render(container){
    const user = DB.getActiveUser();
    if(!user){ window.router.go("login"); return; }

    container.innerHTML = `
      <div class="topbar">
        <div class="brand" style="font-size:26px">Partidas</div>
        <div class="top-icons">
          <div class="pill"><span class="dot"></span><strong>${user.stats?.streak ?? 1}</strong></div>
        </div>
      </div>

      <div class="card">
        <div style="font-weight:900">Revise sua partida</div>
        <div class="note">Aqui você vai ver suas partidas salvas (em breve). Por enquanto é um layout tipo Lotus.</div>
      </div>

      <div class="card" style="display:flex; gap:12px; align-items:center;">
        <div class="mini-board" style="width:92px; aspect-ratio:1/1;"></div>
        <div style="flex:1">
          <div style="font-weight:900">BHFPlanet</div>
          <div class="note">Vitória • analisado • 29 minutos</div>
        </div>
        <div style="color:var(--green); font-weight:900">Vitória</div>
      </div>

      <div class="card" style="display:flex; gap:12px; align-items:center;">
        <div class="mini-board" style="width:92px; aspect-ratio:1/1;"></div>
        <div style="flex:1">
          <div style="font-weight:900">Eloc431</div>
          <div class="note">Vitória • 2 horas</div>
        </div>
        <div style="color:var(--green); font-weight:900">Vitória</div>
      </div>

      <div class="card" style="display:flex; gap:12px; align-items:center;">
        <div class="mini-board" style="width:92px; aspect-ratio:1/1;"></div>
        <div style="flex:1">
          <div style="font-weight:900">jyferreira22</div>
          <div class="note">Derrota • 10 horas</div>
        </div>
        <div style="color:var(--red); font-weight:900">Derrota</div>
      </div>
    `;
  }
  return { render };
})();

// --- Piece theme (inline SVG) so GitHub Pages works without external image assets ---
(function(){
  const svgFor = (piece) => {
    const isWhite = piece[0] === "w";
    const p = piece[1];
    const glyph = ({
      K:"♔", Q:"♕", R:"♖", B:"♗", N:"♘", P:"♙",
    })[p] || "?";
    // For black pieces we use the black glyphs for better look if available:
    const glyphBlack = ({
      K:"♚", Q:"♛", R:"♜", B:"♝", N:"♞", P:"♟",
    })[p] || glyph;
    const text = isWhite ? glyph : glyphBlack;

    const fill = isWhite ? "#ffffff" : "#111111";
    const stroke = isWhite ? "#111111" : "none";
    const strokeWidth = isWhite ? "1.5" : "0";
    const shadow = "0 1px 1px rgba(0,0,0,.35)";

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,.35)"/>
    </filter>
  </defs>
  <text x="30" y="40" text-anchor="middle" font-size="40" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="url(#s)">${text}</text>
</svg>`.trim();

    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  };

  window.pieceTheme = (piece) => svgFor(piece);
})();


// ============ App / Router ============
(function(){
  const app = document.getElementById("app");

  function renderNav(active){
    // bottom nav always visible (like Lotus)
    let nav = document.querySelector(".bottom-nav");
    if(!nav){
      nav = document.createElement("div");
      nav.className = "bottom-nav";
      nav.innerHTML = `
        <div class="nav-inner">
          <div class="nav-item" data-route="home"><div class="ico">♟️</div><div class="lab">Aberturas</div></div>
          <div class="nav-item" data-route="puzzles"><div class="ico">🧩</div><div class="lab">Puzzles</div></div>
          <div class="nav-item" data-route="partidas"><div class="ico">VS</div><div class="lab">Partidas</div></div>
          <div class="nav-item" data-route="analise"><div class="ico">📊</div><div class="lab">Estatísticas</div></div>
        </div>
      `;
      document.body.appendChild(nav);

      nav.querySelectorAll(".nav-item").forEach(it => {
        it.addEventListener("click", (e) => {
          const r = it.getAttribute("data-route");
          window.router.go(r);
        }, { passive:true });
      });
    }

    nav.querySelectorAll(".nav-item").forEach(it => {
      it.classList.toggle("active", it.getAttribute("data-route") === active);
    });
  }

  const routes = {
    login: () => window.UI_LOGIN.render(app),
    home: () => window.UI_HOME.render(app),
    flashcards: () => window.UI_FLASHCARDS.render(app),
    drill: () => window.UI_DRILL.render(app),
    puzzles: () => window.UI_PUZZLES.render(app),
    partidas: () => window.UI_PARTIDAS.render(app),
    analise: () => window.UI_ANALISE.render(app)
  };

  window.router = {
    current: "home",
    params: {},
    go(route, params){
      this.current = route;
      this.params = params || {};
      // keep hash for refresh
      const qs = params ? encodeURIComponent(JSON.stringify(params)) : "";
      location.hash = route + (qs ? ":" + qs : "");
      // render
      const fn = routes[route] || routes.home;
      fn();
      renderNav(route === "login" ? "home" : route);
      // hide nav on login? keep but not required; keep visible but ok
      document.querySelector(".bottom-nav").style.display = (route === "login") ? "none" : "block";
    }
  };

  function bootFromHash(){
    const h = (location.hash || "").replace("#", "");
    if(!h){
      const u = DB.getActiveUser();
      window.router.go(u ? "home" : "login");
      return;
    }
    const parts = h.split(":");
    const r = parts[0];
    let params = {};
    if(parts[1]){
      try{ params = JSON.parse(decodeURIComponent(parts[1])); }catch(e){}
    }
    const u = DB.getActiveUser();
    if(!u && r !== "login"){
      window.router.go("login");
    }else{
      window.router.go(r, params);
    }
  }

  window.addEventListener("hashchange", bootFromHash);
  bootFromHash();
})();
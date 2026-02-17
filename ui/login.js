window.UI_LOGIN = (() => {
  function render(container){
    container.innerHTML = `
      <div class="topbar">
        <div class="brand">MentorChess</div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 6px;">Entrar</div>
        <div class="note">Escolha um nome de usuário (qualquer um) para salvar no seu celular.</div>
        <div style="height:10px"></div>
        <input id="u" placeholder="Seu nome (ex: Jcarlonds)" style="
          width:100%; padding:14px 14px; border-radius:16px;
          border:1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.06);
          color: var(--text);
          font-weight: 700;
          outline:none;
        "/>
        <div style="height:12px"></div>
        <button class="big-btn" id="go">Entrar</button>
      </div>
    `;
    const inp = container.querySelector("#u");
    const btn = container.querySelector("#go");
    btn.onclick = () => {
      const name = (inp.value || "").trim() || "Convidado";
      DB.ensureUser(name);
      window.router.go("home");
    };
    setTimeout(()=>inp.focus(), 60);
  }
  return { render };
})();
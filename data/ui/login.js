export function renderLogin(root, onLogin) {
  root.innerHTML = `
    <div class="card">
      <div class="h1">Entrar</div>
      <p class="p">
        Digite seu usuário do Chess.com.
        Cada usuário terá progresso separado.
      </p>

      <div style="margin-top:12px">
        <input
          id="username"
          placeholder="ex: meuNick123"
          style="
            width:100%;
            padding:12px;
            border-radius:12px;
            border:1px solid #E6ECF5;
            font-size:16px;
          "
        />
      </div>

      <div style="margin-top:12px">
        <button class="btn" id="btnLogin" style="width:100%">
          Entrar
        </button>
      </div>

      <p class="p" style="margin-top:10px;font-size:12px">
        Dica: depois você poderá instalar o app no celular.
      </p>
    </div>
  `;

  const btn = root.querySelector("#btnLogin");
  const input = root.querySelector("#username");

  btn.addEventListener("click", () => {
    const username = input.value.trim();
    if (!username) {
      alert("Digite seu usuário do Chess.com");
      return;
    }
    onLogin(username);
  });
}

import { FLASHCARDS } from "../data/flashcards.js";

export function renderFlashcards(root, username) {
  let index = 0;
  let flipped = false;

  function render() {
    const card = FLASHCARDS[index];

    root.innerHTML = `
      <div class="card">
        <div class="h1">Flashcards</div>
        <p class="p">Leia, responda mentalmente e vire o card. Treino rápido.</p>
        <div style="margin-top:10px">
          <span class="badge">📇 ${index + 1}/${FLASHCARDS.length}</span>
          <span class="badge">🏷️ ${card.theme}</span>
        </div>
      </div>

      <div class="card">
        <div class="h1">${flipped ? "Verso" : "Frente"}</div>
        <p class="p"><b>Pergunta:</b> ${card.question}</p>

        <hr style="border:none;border-top:1px solid #E6ECF5;margin:12px 0"/>

        ${
          flipped
            ? `
              <p class="p">${card.explanation}</p>
              <div style="margin-top:10px">
                <span class="badge">🧠 ${card.anchor}</span>
              </div>

              <hr style="border:none;border-top:1px solid #E6ECF5;margin:12px 0"/>

              <div class="h1" style="font-size:15px">Transposições</div>
              <ul class="p" style="margin:6px 0 0 18px">
                ${(card.transpositions || []).map(t => `<li>${t}</li>`).join("")}
              </ul>
            `
            : `
              <p class="p" style="font-size:12px">Dica: pense primeiro. Depois vire.</p>
            `
        }
      </div>

      <div style="display:flex;gap:10px">
        <button class="btn" id="prev" style="flex:1;background:#EAF1FF;color:#0B5FFF;border:1px solid #E6ECF5">
          ◀
        </button>

        <button class="btn" id="flip" style="flex:2">
          ${flipped ? "Voltar" : "Virar"}
        </button>

        <button class="btn" id="next" style="flex:1;background:#EAF1FF;color:#0B5FFF;border:1px solid #E6ECF5">
          ▶
        </button>
      </div>
    `;

    root.querySelector("#flip").onclick = () => {
      flipped = !flipped;
      render();
    };

    root.querySelector("#prev").onclick = () => {
      index = (index - 1 + FLASHCARDS.length) % FLASHCARDS.length;
      flipped = false;
      render();
    };

    root.querySelector("#next").onclick = () => {
      index = (index + 1) % FLASHCARDS.length;
      flipped = false;
      render();
    };
  }

  render();
}

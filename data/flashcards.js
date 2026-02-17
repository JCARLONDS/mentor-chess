// ============ Flashcards / Openings Data ============
window.FLASHCARDS = [
  {
    id: "italian_white",
    side: "white",
    title: "Italian Game",
    fenPreview: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
    focus: "Ative o bispo e ataque f7.",
    moves: [
      { san: "e4", explain: "Controle do centro e abre linhas." },
      { san: "e5", explain: "Resposta simétrica." },
      { san: "Nf3", explain: "Desenvolve e ataca e5." },
      { san: "Nc6", explain: "Defende e desenvolve." },
      { san: "Bc4", explain: "Mira f7." }
    ]
  },
  {
    id: "scandi_black",
    side: "black",
    title: "Scandinavian Defense",
    fenPreview: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    focus: "Contra-ataque no centro.",
    moves: [
      { san: "e4", explain: "" },
      { san: "d5", explain: "Ataca o peão central." },
      { san: "exd5", explain: "" },
      { san: "Qxd5", explain: "Recaptura rapidamente." }
    ]
  },
  {
    id: "sicilian_black",
    side: "black",
    title: "Sicilian Defense",
    fenPreview: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    focus: "Jogo desequilibrado e iniciativa.",
    moves: [
      { san: "e4", explain: "" },
      { san: "c5", explain: "Ataca d4 e cria assimetria." }
    ]
  },
  {
    id: "vienna_white",
    side: "white",
    title: "Vienna Game",
    fenPreview: "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 2",
    focus: "Pressão rápida no centro.",
    moves: [
      { san: "e4", explain: "" },
      { san: "e5", explain: "" },
      { san: "Nc3", explain: "Desenvolve e prepara f4." }
    ]
  }
];

// Example puzzles
window.PUZZLES = [
  {
    tema: "Capturar o defensor",
    dica: "Procure uma tática simples.",
    fen: "8/8/8/3k4/3P4/4K3/8/8 w - - 0 1",
    solucaoSAN: ["d5"]
  },
  {
    tema: "Mate em 1",
    dica: "Cheque-mate imediato.",
    fen: "6k1/5ppp/8/8/8/6Q1/6PP/6K1 w - - 0 1",
    solucaoSAN: ["Qa8#"]
  }
];

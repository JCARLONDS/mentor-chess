const game = new Chess();

const board = Chessboard('board', {
  draggable: true,
  position: 'start',
  pieceTheme:
    'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  onDrop: onDrop,
  moveSpeed: 300,
  snapbackSpeed: 200,
  snapSpeed: 100
});

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  setTimeout(makeRandomMove, 400);
}

function makeRandomMove() {
  const moves = game.moves();
  if (moves.length === 0) return;
  const move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);
  board.position(game.fen());
}

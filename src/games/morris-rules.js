export const lines = [
  [0,1,2], [3,4,5], [6,7,8], [0,3,6],
  [1,4,7], [2,5,8], [0,4,8], [2,4,6]
];
export const edges = lines.flatMap(([a,b,c]) => [[a,b], [b,c]]);
export const winningLine = board => lines.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
export const positionKey = (board, side) => board.join('') + side;
export function legalMoves(board, side) {
  if (board.filter(piece => piece === side).length < 3) {
    return board.flatMap((piece, to) => piece ? [] : [{from:null, to}]);
  }
  return edges.flatMap(([a,b]) => {
    if (board[a] === side && !board[b]) return [{from:a, to:b}];
    if (board[b] === side && !board[a]) return [{from:b, to:a}];
    return [];
  });
}
export function applyMove(board, {from, to}, side) {
  const next = board.slice();
  if (from !== null) next[from] = 0;
  next[to] = side;
  return next;
}
export function cpuMove(board, side, positions, depth) {
  function search(state, turn, remaining, alpha, beta) {
    const line = winningLine(state);
    if (line) return state[line[0]] === side ? 100 + remaining : -100 - remaining;
    const moves = legalMoves(state, turn);
    const maximizing = turn === side;
    if (!moves.length) return maximizing ? -100 - remaining : 100 + remaining;
    const key = positionKey(state, turn);
    const visits = positions.get(key) || 0;
    if (visits === 2) return 0;
    if (!remaining) return lines.reduce((score, cells) => {
      const own = cells.filter(cell => state[cell] === side).length;
      const rival = cells.filter(cell => state[cell] === 3 - side).length;
      return score + (own === 2 && !rival ? 3 : rival === 2 && !own ? -3 : 0);
    }, state[4] === side ? 1 : state[4] ? -1 : 0);
    positions.set(key, visits + 1);
    let best = maximizing ? -Infinity : Infinity;
    for (const move of moves) {
      const score = search(applyMove(state, move, turn), 3 - turn, remaining - 1, alpha, beta);
      if (maximizing) { best = Math.max(best, score); alpha = Math.max(alpha, best); }
      else { best = Math.min(best, score); beta = Math.min(beta, best); }
      if (alpha >= beta) break;
    }
    if (visits) positions.set(key, visits);
    else positions.delete(key);
    return best;
  }
  return legalMoves(board, side).map(move => ({
    move, score: search(applyMove(board, move, side), 3 - side, depth - 1, -Infinity, Infinity)
  })).sort((a,b) => b.score - a.score)[0]?.move;
}

import {applyMove, cpuMove, edges, legalMoves, positionKey, winningLine} from './morris-rules.js';

export function morris(root) {
  const panel = document.createElement('section');
  panel.className = 'morris';
  panel.innerHTML = `
    <div class="morris-stage">
      <p class="morris-kicker">DEX ARCADE / TABLETOP</p>
      <h3>Make your mill.</h3>
      <div class="morris-board" role="group" aria-label="Morris board">
        <svg viewBox="0 0 300 300" aria-hidden="true"></svg>
      </div>
      <p class="morris-status" role="status"></p>
    </div>
    <aside class="morris-sidebar" aria-label="Match controls">
      <label>Play mode<select class="morris-mode">
        <option value="3">Solo · Casual</option><option value="7">Solo · Tactical</option>
        <option value="0">Two players · Local</option>
      </select></label>
      <label>Army colors<select class="morris-colors">
        <option value="sun">Amber / Ice</option><option value="rose">Rose / Mint</option>
        <option value="violet">Violet / Gold</option>
      </select></label>
      <div class="morris-score">
        <p data-side="1"><span>Player 1</span><strong>0</strong></p>
        <p data-side="2"><span>CPU</span><strong>0</strong></p>
      </div>
      <button type="button" class="morris-next">Restart round</button>
      <details><summary>How to play</summary><p>Take turns placing three pieces each. Then select one of yours and slide it along a line to an adjacent empty point. Three in a row wins. If your side cannot move, the other side wins. The same position with the same side to play three times is a draw.</p></details>
    </aside>`;
  root.append(panel);
  const get = selector => panel.querySelector(selector);
  const boardView = get('.morris-board');
  const status = get('.morris-status');
  const nextRound = get('.morris-next');
  const mode = get('.morris-mode');
  const scores = [...panel.querySelectorAll('[data-side]')];
  const coordinates = index => [50 + index % 3 * 100, 50 + Math.floor(index / 3) * 100];
  const labels = ['Top left','Top middle','Top right','Middle left','Center','Middle right','Bottom left','Bottom middle','Bottom right'];
  get('svg').innerHTML = edges.map(([from,to]) => {
    const [x1,y1] = coordinates(from);
    const [x2,y2] = coordinates(to);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join('');
  const cells = labels.map((_, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.innerHTML = '<span aria-hidden="true"></span>';
    cell.onclick = () => choose(index);
    cell.onkeydown = event => {
      const target = {ArrowLeft:index - 1, ArrowRight:index + 1, ArrowUp:index - 3, ArrowDown:index + 3}[event.key];
      if (target === undefined) return;
      if ((event.key === 'ArrowLeft' && index % 3 === 0) || (event.key === 'ArrowRight' && index % 3 === 2)) return;
      event.preventDefault();
      cells[target]?.focus();
    };
    boardView.append(cell);
    return cell;
  });

  let board, turn, selected, positions, result, timer, lastMove;
  let starter = 1;
  let wins = [0,0];
  const name = side => side === 1 ? 'Player 1' : Number(mode.value) ? 'CPU' : 'Player 2';

  function render() {
    const moves = legalMoves(board, turn);
    const placing = moves[0]?.from === null;
    const cpuTurn = turn === 2 && Number(mode.value) > 0;
    const line = winningLine(board);
    cells.forEach((cell, index) => {
      const piece = board[index];
      const destination = !result && !cpuTurn && moves.some(move => move.from === selected && move.to === index);
      const selectable = !result && !cpuTurn && moves.some(move => move.from === index);
      cell.dataset.piece = piece;
      cell.classList.toggle('target', destination && selected !== null);
      cell.classList.toggle('mill', Boolean(line?.includes(index)));
      cell.classList.toggle('last', index === lastMove);
      cell.setAttribute('aria-pressed', String(index === selected));
      cell.setAttribute('aria-disabled', String(!destination && !selectable));
      cell.setAttribute('aria-label', labels[index] + (piece ? ', ' + name(piece) : ', empty') + (destination && !placing ? ', legal destination' : ''));
    });
    scores.forEach((row, index) => {
      row.querySelector('span').textContent = name(index + 1);
      row.querySelector('strong').textContent = wins[index];
      row.classList.toggle('active', !result && turn === index + 1);
    });
    status.textContent = result || (cpuTurn ? 'CPU is thinking…' :
      `${name(turn)} · ${placing ? 'Place a piece' : selected === null ? 'Select a piece to slide' : 'Choose a highlighted point'}`);
    nextRound.textContent = result ? 'Play rematch' : 'Restart round';
  }
  function take(move) {
    board = applyMove(board, move, turn);
    lastMove = move.to;
    selected = null;
    const opponent = 3 - turn;
    const mill = winningLine(board);
    if (mill || !legalMoves(board, opponent).length) {
      wins[turn - 1]++;
      result = `${name(turn)} wins! ${mill ? 'Three in a row.' : 'Opponent has no legal move.'}`;
    } else {
      turn = opponent;
      const key = positionKey(board, turn);
      const count = (positions.get(key) || 0) + 1;
      positions.set(key, count);
      if (count === 3) result = 'Draw · same position three times.';
    }
    advance();
  }
  function choose(index) {
    if (result || (turn === 2 && Number(mode.value))) return;
    const moves = legalMoves(board, turn);
    const move = moves.find(candidate => candidate.from === selected && candidate.to === index);
    if (move) take(move);
    else if (moves.some(candidate => candidate.from === index)) {
      selected = index === selected ? null : index;
      render();
    }
  }
  function advance() {
    render();
    if (result || turn !== 2 || !Number(mode.value)) return;
    timer = setTimeout(function think() {
      if (root.inert) { timer = setTimeout(think, 160); return; }
      take(cpuMove(board, turn, positions, Number(mode.value)));
    }, 320);
  }
  function reset() {
    clearTimeout(timer);
    board = Array(9).fill(0);
    turn = starter;
    selected = null;
    lastMove = null;
    result = '';
    positions = new Map([[positionKey(board, turn), 1]]);
    advance();
  }
  mode.onchange = () => { wins = [0,0]; starter = 1; reset(); };
  get('.morris-colors').onchange = event => { panel.dataset.colors = event.target.value; };
  nextRound.onclick = () => { if (result) starter = 3 - starter; reset(); };
  reset();
  return () => clearTimeout(timer);
}

function initRevealAnimations(){
  const revealElements=document.querySelectorAll('[data-aos]');
  if(!revealElements.length) return;

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    revealElements.forEach(element=>element.classList.add('is-visible'));
    return;
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.16, rootMargin:'0px 0px -8% 0px'});

  revealElements.forEach(element=>observer.observe(element));
}

function initParticles(){
  const container=document.getElementById('tsparticles');
  if(!container) return;

  const canvas=document.createElement('canvas');
  const context=canvas.getContext('2d');
  if(!context) return;

  container.replaceChildren(canvas);

  let width=0;
  let height=0;
  let rafId=0;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particles=[];

  const createParticle=()=>({
    x:Math.random()*width,
    y:Math.random()*height,
    vx:(Math.random()-0.5)*(reducedMotion ? 0 : 0.18),
    vy:(Math.random()-0.5)*(reducedMotion ? 0 : 0.18),
    radius:Math.random()*1.8+1.2
  });

  const syncCanvasSize=()=>{
    const dpr=window.devicePixelRatio || 1;
    width=Math.max(window.innerWidth,1);
    height=Math.max(window.innerHeight,1);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);

    const desiredCount=Math.max(14,Math.min(34,Math.round(width/48)));
    while(particles.length < desiredCount) particles.push(createParticle());
    particles.length=desiredCount;
    particles.forEach(particle=>{
      if(particle.x > width) particle.x=width*Math.random();
      if(particle.y > height) particle.y=height*Math.random();
    });
  };

  const draw=()=>{
    context.clearRect(0,0,width,height);

    for(let i=0; i<particles.length; i+=1){
      const particle=particles[i];
      particle.x+=particle.vx;
      particle.y+=particle.vy;

      if(particle.x < -20) particle.x=width+20;
      if(particle.x > width+20) particle.x=-20;
      if(particle.y < -20) particle.y=height+20;
      if(particle.y > height+20) particle.y=-20;

      context.beginPath();
      context.fillStyle='rgba(72, 193, 223, 0.35)';
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI*2);
      context.fill();

      for(let j=i+1; j<particles.length; j+=1){
        const neighbor=particles[j];
        const dx=particle.x-neighbor.x;
        const dy=particle.y-neighbor.y;
        const distance=Math.hypot(dx,dy);
        if(distance > 120) continue;

        context.beginPath();
        context.strokeStyle=`rgba(72, 193, 223, ${0.14-(distance/1200)})`;
        context.lineWidth=1;
        context.moveTo(particle.x, particle.y);
        context.lineTo(neighbor.x, neighbor.y);
        context.stroke();
      }
    }

    if(!reducedMotion) rafId=window.requestAnimationFrame(draw);
  };

  syncCanvasSize();
  draw();
  window.addEventListener('resize', syncCanvasSize, {passive:true});

  if(!reducedMotion && !rafId){
    rafId=window.requestAnimationFrame(draw);
  }
}

initRevealAnimations();
initParticles();

(function(){
  const el=document.getElementById('typing');
  const phrases=['Web Developer','UI/UX Enthusiast','Problem Solver','Lifelong Learner', 'AI Learner'];
  let pi=0,ci=0,forward=true;
  function tick(){
    const text=phrases[pi].slice(0,ci);
    el.textContent=text+'|';
    if(forward){ci++;if(ci>phrases[pi].length){forward=false;setTimeout(tick,900);return}}
    else{ci--; if(ci<0){forward=true;pi=(pi+1)%phrases.length}}
    setTimeout(tick,120);
  }
  tick();
})();

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();const id=a.getAttribute('href').slice(1);if(!id) return;const target=document.getElementById(id);if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

const themeToggle=document.getElementById('themeToggle');
function readStoredTheme(){
  try{
    return localStorage.getItem('theme');
  }catch{
    return null;
  }
}

function writeStoredTheme(theme){
  try{
    localStorage.setItem('theme',theme);
  }catch{
    // Ignore storage failures in embedded previews.
  }
}

function setTheme(theme){
  document.documentElement.setAttribute('data-theme',theme);
  writeStoredTheme(theme);
  if(themeToggle) themeToggle.innerHTML=theme==='light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}

const stored=readStoredTheme()||'light';
setTheme(stored);
themeToggle.addEventListener('click',()=>{
  setTheme(document.documentElement.getAttribute('data-theme')==='light' ? 'dark' : 'light');
});

document.getElementById('menuToggle').addEventListener('click',()=>{
  document.getElementById('mainNav').classList.toggle('show');
});

document.querySelectorAll('#mainNav a').forEach(link=>{
  link.addEventListener('click',()=>{
    document.getElementById('mainNav').classList.remove('show');
  });
});

document.querySelectorAll('.projects-controls .pill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const f=btn.getAttribute('data-filter');
    document.querySelectorAll('.project').forEach(p=>{
      p.style.display=(f==='all'||p.dataset.type===f)?'flex':'none';
    });
  });
});

let activeGame='tetris';
const gameCards=[...document.querySelectorAll('[data-game-card]')];

function setActiveGame(name){
  activeGame=name;
  gameCards.forEach(card=>{
    card.classList.toggle('is-active', card.dataset.gameCard===name);
  });
}

gameCards.forEach(card=>{
  const gameName=card.dataset.gameCard;
  card.addEventListener('pointerdown',()=>setActiveGame(gameName));
  card.addEventListener('focusin',()=>setActiveGame(gameName));
});

setActiveGame(activeGame);

function readStoredNumber(key){
  try{
    const stored=localStorage.getItem(key);
    const parsed=Number(stored);
    return Number.isFinite(parsed) ? parsed : 0;
  }catch{
    return 0;
  }
}

function writeStoredNumber(key,value){
  try{
    localStorage.setItem(key,String(value));
  }catch{
    // Ignore storage failures in embedded previews.
  }
}

function shuffleArray(items){
  const array=[...items];
  for(let index=array.length-1; index > 0; index-=1){
    const swapIndex=Math.floor(Math.random()*(index+1));
    [array[index],array[swapIndex]]=[array[swapIndex],array[index]];
  }
  return array;
}

function createGrid(rows,columns){
  return Array.from({length:rows},()=>Array(columns).fill(null));
}

const TETRIS_SHAPES={
  I:[[1,1,1,1]],
  O:[[1,1],[1,1]],
  T:[[0,1,0],[1,1,1]],
  L:[[0,0,1],[1,1,1]],
  J:[[1,0,0],[1,1,1]],
  S:[[0,1,1],[1,1,0]],
  Z:[[1,1,0],[0,1,1]]
};

const TETRIS_COLORS={
  I:'#57d6ff',
  O:'#ffd166',
  T:'#c792ff',
  L:'#ffb26b',
  J:'#8fb3ff',
  S:'#5fe1a5',
  Z:'#ff7b94'
};

const tetrisCanvas=document.getElementById('tetrisCanvas');
const tetrisContext=tetrisCanvas.getContext('2d');
const tetrisElements={
  score:document.getElementById('tetrisScore'),
  lines:document.getElementById('tetrisLines'),
  level:document.getElementById('tetrisLevel'),
  status:document.getElementById('tetrisStatus'),
  pause:document.getElementById('tetrisPause')
};

const tetris={
  rows:20,
  cols:10,
  board:createGrid(20,10),
  bag:[],
  current:null,
  score:0,
  lines:0,
  level:1,
  dropInterval:700,
  timer:null,
  running:false,
  paused:false,
  gameOver:false
};

function cloneMatrix(matrix){
  return matrix.map(row=>[...row]);
}

function rotateMatrix(matrix){
  return matrix[0].map((_,column)=>matrix.map(row=>row[column]).reverse());
}

function nextTetrisType(){
  if(!tetris.bag.length){
    tetris.bag=shuffleArray(Object.keys(TETRIS_SHAPES));
  }
  return tetris.bag.pop();
}

function createTetrisPiece(type=nextTetrisType()){
  const matrix=cloneMatrix(TETRIS_SHAPES[type]);
  return {
    type,
    matrix,
    x:Math.floor((tetris.cols-matrix[0].length)/2),
    y:0
  };
}

function tetrisCollides(piece,offsetX=0,offsetY=0,matrix=piece.matrix){
  for(let row=0; row<matrix.length; row+=1){
    for(let column=0; column<matrix[row].length; column+=1){
      if(!matrix[row][column]) continue;
      const boardX=piece.x+column+offsetX;
      const boardY=piece.y+row+offsetY;
      if(boardX < 0 || boardX >= tetris.cols || boardY >= tetris.rows) return true;
      if(boardY >= 0 && tetris.board[boardY][boardX]) return true;
    }
  }
  return false;
}

function drawTetrisCell(x,y,color){
  const cellWidth=tetrisCanvas.width/tetris.cols;
  const cellHeight=tetrisCanvas.height/tetris.rows;
  const drawX=x*cellWidth;
  const drawY=y*cellHeight;

  tetrisContext.fillStyle=color;
  tetrisContext.fillRect(drawX+1,drawY+1,cellWidth-2,cellHeight-2);
  tetrisContext.strokeStyle='rgba(255,255,255,0.08)';
  tetrisContext.strokeRect(drawX+0.5,drawY+0.5,cellWidth-1,cellHeight-1);
}

function drawTetris(){
  tetrisContext.clearRect(0,0,tetrisCanvas.width,tetrisCanvas.height);
  tetrisContext.fillStyle='rgba(4,15,22,0.98)';
  tetrisContext.fillRect(0,0,tetrisCanvas.width,tetrisCanvas.height);

  for(let row=0; row<tetris.rows; row+=1){
    for(let column=0; column<tetris.cols; column+=1){
      if(tetris.board[row][column]){
        drawTetrisCell(column,row,TETRIS_COLORS[tetris.board[row][column]]);
      }else{
        tetrisContext.strokeStyle='rgba(255,255,255,0.04)';
        tetrisContext.strokeRect(column*(tetrisCanvas.width/tetris.cols)+0.5,row*(tetrisCanvas.height/tetris.rows)+0.5,(tetrisCanvas.width/tetris.cols)-1,(tetrisCanvas.height/tetris.rows)-1);
      }
    }
  }

  if(!tetris.current) return;

  tetris.current.matrix.forEach((row,rowIndex)=>{
    row.forEach((value,columnIndex)=>{
      if(!value) return;
      drawTetrisCell(tetris.current.x+columnIndex,tetris.current.y+rowIndex,TETRIS_COLORS[tetris.current.type]);
    });
  });
}

function updateTetrisUI(){
  tetrisElements.score.textContent=String(tetris.score);
  tetrisElements.lines.textContent=String(tetris.lines);
  tetrisElements.level.textContent=String(tetris.level);
  tetrisElements.pause.textContent=tetris.paused ? 'Resume' : 'Pause';

  if(tetris.gameOver){
    tetrisElements.status.textContent='Game over. Press Start to play again.';
  }else if(tetris.paused){
    tetrisElements.status.textContent='Paused. Resume when you are ready.';
  }else if(tetris.running){
    tetrisElements.status.textContent='Use arrow keys or the touch controls to keep clearing lines.';
  }else{
    tetrisElements.status.textContent='Use arrow keys to move, up to rotate, and space to hard drop.';
  }
}

function clearTetrisTimer(){
  if(tetris.timer){
    clearInterval(tetris.timer);
    tetris.timer=null;
  }
}

function spawnTetrisPiece(){
  tetris.current=createTetrisPiece();
  if(tetrisCollides(tetris.current)){
    tetris.gameOver=true;
    tetris.running=false;
    tetris.paused=false;
    clearTetrisTimer();
  }
}

function clearTetrisLines(){
  let cleared=0;

  for(let row=tetris.rows-1; row>=0; row-=1){
    if(tetris.board[row].every(Boolean)){
      tetris.board.splice(row,1);
      tetris.board.unshift(Array(tetris.cols).fill(null));
      cleared+=1;
      row+=1;
    }
  }

  if(!cleared) return;

  const scoreTable=[0,100,300,500,800];
  tetris.score+=scoreTable[Math.min(cleared,4)]*tetris.level;
  tetris.lines+=cleared;
  tetris.level=1+Math.floor(tetris.lines/8);
  tetris.dropInterval=Math.max(120,700-((tetris.level-1)*55));

  if(tetris.running){
    clearTetrisTimer();
    tetris.timer=setInterval(tetrisStep,tetris.dropInterval);
  }
}

function lockTetrisPiece(){
  tetris.current.matrix.forEach((row,rowIndex)=>{
    row.forEach((value,columnIndex)=>{
      if(!value) return;
      const boardY=tetris.current.y+rowIndex;
      const boardX=tetris.current.x+columnIndex;
      if(boardY >= 0){
        tetris.board[boardY][boardX]=tetris.current.type;
      }
    });
  });

  clearTetrisLines();
  spawnTetrisPiece();
}

function resetTetris(){
  clearTetrisTimer();
  tetris.board=createGrid(tetris.rows,tetris.cols);
  tetris.bag=[];
  tetris.current=createTetrisPiece();
  tetris.score=0;
  tetris.lines=0;
  tetris.level=1;
  tetris.dropInterval=700;
  tetris.running=false;
  tetris.paused=false;
  tetris.gameOver=false;
  drawTetris();
  updateTetrisUI();
}

function startTetris(){
  setActiveGame('tetris');
  if(tetris.gameOver){
    resetTetris();
  }
  tetris.running=true;
  tetris.paused=false;
  clearTetrisTimer();
  tetris.timer=setInterval(tetrisStep,tetris.dropInterval);
  drawTetris();
  updateTetrisUI();
}

function pauseTetris(){
  setActiveGame('tetris');
  if(tetris.gameOver || (!tetris.running && !tetris.paused)) return;

  if(tetris.paused){
    tetris.paused=false;
    tetris.running=true;
    clearTetrisTimer();
    tetris.timer=setInterval(tetrisStep,tetris.dropInterval);
  }else{
    tetris.paused=true;
    tetris.running=false;
    clearTetrisTimer();
  }

  updateTetrisUI();
}

function moveTetrisPiece(offsetX,offsetY){
  if(tetrisCollides(tetris.current,offsetX,offsetY)) return false;
  tetris.current.x+=offsetX;
  tetris.current.y+=offsetY;
  return true;
}

function rotateTetrisPiece(){
  const rotated=rotateMatrix(tetris.current.matrix);
  const kicks=[0,-1,1,-2,2];

  for(const kick of kicks){
    if(!tetrisCollides(tetris.current,kick,0,rotated)){
      tetris.current.matrix=rotated;
      tetris.current.x+=kick;
      return true;
    }
  }

  return false;
}

function tetrisStep(){
  if(!tetris.running || tetris.paused || tetris.gameOver) return;

  if(!moveTetrisPiece(0,1)){
    lockTetrisPiece();
  }

  drawTetris();
  updateTetrisUI();
}

function handleTetrisAction(action){
  setActiveGame('tetris');

  if(action==='start'){
    startTetris();
    return true;
  }

  if(action==='pause'){
    pauseTetris();
    return true;
  }

  if(action==='reset'){
    resetTetris();
    return true;
  }

  if(tetris.gameOver){
    resetTetris();
  }

  if(!tetris.running || tetris.paused) return false;

  if(action==='left'){
    moveTetrisPiece(-1,0);
  }else if(action==='right'){
    moveTetrisPiece(1,0);
  }else if(action==='down'){
    if(moveTetrisPiece(0,1)){
      tetris.score+=1;
    }else{
      lockTetrisPiece();
    }
  }else if(action==='rotate'){
    rotateTetrisPiece();
  }else if(action==='drop'){
    let droppedRows=0;
    while(moveTetrisPiece(0,1)){
      droppedRows+=1;
    }
    tetris.score+=droppedRows*2;
    lockTetrisPiece();
  }else{
    return false;
  }

  drawTetris();
  updateTetrisUI();
  return true;
}

document.getElementById('tetrisStart').addEventListener('click',startTetris);
document.getElementById('tetrisPause').addEventListener('click',pauseTetris);
document.getElementById('tetrisReset').addEventListener('click',resetTetris);
resetTetris();

const minesweeperBoard=document.getElementById('minesweeperBoard');
const minesweeperElements={
  mines:document.getElementById('minesweeperMines'),
  cleared:document.getElementById('minesweeperCleared'),
  state:document.getElementById('minesweeperState'),
  mode:document.getElementById('minesweeperMode'),
  message:document.getElementById('minesweeperMessage')
};

const minesweeper={
  rows:9,
  cols:9,
  mineCount:10,
  board:[],
  revealed:0,
  flags:0,
  started:false,
  gameOver:false,
  won:false,
  flagMode:false
};

const MINESWEEPER_COLORS=[
  '',
  '#66c2ff',
  '#7be495',
  '#ffd166',
  '#ffb26b',
  '#ff7b94',
  '#b197fc',
  '#f785ff',
  '#8ce3ff'
];

function createMinesweeperCell(){
  return {
    mine:false,
    adjacent:0,
    revealed:false,
    flagged:false
  };
}

function populateMinesweeperCounts(){
  for(let row=0; row<minesweeper.rows; row+=1){
    for(let column=0; column<minesweeper.cols; column+=1){
      const cell=minesweeper.board[row][column];
      if(cell.mine){
        cell.adjacent=0;
        continue;
      }

      let count=0;
      for(let rowOffset=-1; rowOffset<=1; rowOffset+=1){
        for(let columnOffset=-1; columnOffset<=1; columnOffset+=1){
          if(!rowOffset && !columnOffset) continue;
          const nextRow=row+rowOffset;
          const nextColumn=column+columnOffset;
          if(nextRow < 0 || nextRow >= minesweeper.rows || nextColumn < 0 || nextColumn >= minesweeper.cols) continue;
          if(minesweeper.board[nextRow][nextColumn].mine) count+=1;
        }
      }

      cell.adjacent=count;
    }
  }
}

function plantMinesweeperMines(safeRow,safeColumn){
  let planted=0;

  while(planted < minesweeper.mineCount){
    const row=Math.floor(Math.random()*minesweeper.rows);
    const column=Math.floor(Math.random()*minesweeper.cols);
    const cell=minesweeper.board[row][column];

    if(cell.mine || (row===safeRow && column===safeColumn)) continue;

    cell.mine=true;
    planted+=1;
  }

  populateMinesweeperCounts();
}

function revealAllMines(){
  minesweeper.board.flat().forEach(cell=>{
    if(cell.mine) cell.revealed=true;
  });
}

function floodRevealMinesweeper(startRow,startColumn){
  const stack=[[startRow,startColumn]];

  while(stack.length){
    const [row,column]=stack.pop();
    const cell=minesweeper.board[row][column];

    if(cell.revealed || cell.flagged) continue;

    cell.revealed=true;
    minesweeper.revealed+=1;

    if(cell.adjacent !== 0) continue;

    for(let rowOffset=-1; rowOffset<=1; rowOffset+=1){
      for(let columnOffset=-1; columnOffset<=1; columnOffset+=1){
        if(!rowOffset && !columnOffset) continue;
        const nextRow=row+rowOffset;
        const nextColumn=column+columnOffset;
        if(nextRow < 0 || nextRow >= minesweeper.rows || nextColumn < 0 || nextColumn >= minesweeper.cols) continue;
        const neighbor=minesweeper.board[nextRow][nextColumn];
        if(!neighbor.revealed && !neighbor.flagged && !neighbor.mine){
          stack.push([nextRow,nextColumn]);
        }
      }
    }
  }
}

function renderMinesweeper(){
  minesweeperBoard.style.gridTemplateColumns=`repeat(${minesweeper.cols}, minmax(0, 1fr))`;
  const fragment=document.createDocumentFragment();

  for(let row=0; row<minesweeper.rows; row+=1){
    for(let column=0; column<minesweeper.cols; column+=1){
      const cell=minesweeper.board[row][column];
      const button=document.createElement('button');
      button.type='button';
      button.className='minesweeper-cell';
      button.dataset.row=String(row);
      button.dataset.column=String(column);

      if(cell.revealed){
        button.classList.add('is-revealed');
        if(cell.mine){
          button.classList.add('is-mine');
          button.textContent='*';
        }else if(cell.adjacent > 0){
          button.textContent=String(cell.adjacent);
          button.style.color=MINESWEEPER_COLORS[cell.adjacent];
        }
      }else if(cell.flagged){
        button.classList.add('is-flagged');
        button.textContent='F';
      }

      fragment.append(button);
    }
  }

  minesweeperBoard.replaceChildren(fragment);
}

function updateMinesweeperUI(){
  minesweeperElements.mines.textContent=String(minesweeper.mineCount-minesweeper.flags);
  minesweeperElements.cleared.textContent=String(minesweeper.revealed);
  minesweeperElements.mode.textContent=`Mode: ${minesweeper.flagMode ? 'Flag' : 'Reveal'}`;
  minesweeperElements.mode.setAttribute('aria-pressed',String(minesweeper.flagMode));

  if(minesweeper.won){
    minesweeperElements.state.textContent='Won';
    minesweeperElements.message.textContent='You cleared the board. Press New Game for another round.';
  }else if(minesweeper.gameOver){
    minesweeperElements.state.textContent='Lost';
    minesweeperElements.message.textContent='You hit a mine. Start a new game and try a different route.';
  }else if(minesweeper.started){
    minesweeperElements.state.textContent='Playing';
    minesweeperElements.message.textContent=minesweeper.flagMode ? 'Flag mode is on. Tap cells to mark them.' : 'Reveal mode is on. Tap a cell to clear it.';
  }else{
    minesweeperElements.state.textContent='Ready';
    minesweeperElements.message.textContent='Tap a tile to reveal it. Switch to flag mode on touch screens.';
  }
}

function resetMinesweeper(){
  minesweeper.board=Array.from({length:minesweeper.rows},()=>Array.from({length:minesweeper.cols},()=>createMinesweeperCell()));
  minesweeper.revealed=0;
  minesweeper.flags=0;
  minesweeper.started=false;
  minesweeper.gameOver=false;
  minesweeper.won=false;
  minesweeper.flagMode=false;
  renderMinesweeper();
  updateMinesweeperUI();
}

function toggleMinesweeperMode(){
  minesweeper.flagMode=!minesweeper.flagMode;
  updateMinesweeperUI();
}

function toggleMinesweeperFlag(row,column){
  if(minesweeper.gameOver || minesweeper.won) return;

  const cell=minesweeper.board[row][column];
  if(cell.revealed) return;

  cell.flagged=!cell.flagged;
  minesweeper.flags+=cell.flagged ? 1 : -1;
  renderMinesweeper();
  updateMinesweeperUI();
}

function revealMinesweeperCell(row,column){
  if(minesweeper.gameOver || minesweeper.won) return;

  const cell=minesweeper.board[row][column];
  if(cell.revealed || cell.flagged) return;

  if(!minesweeper.started){
    minesweeper.started=true;
    plantMinesweeperMines(row,column);
  }

  if(cell.mine){
    cell.revealed=true;
    minesweeper.gameOver=true;
    revealAllMines();
    renderMinesweeper();
    updateMinesweeperUI();
    return;
  }

  floodRevealMinesweeper(row,column);

  if(minesweeper.revealed === (minesweeper.rows*minesweeper.cols)-minesweeper.mineCount){
    minesweeper.won=true;
    minesweeper.flags=minesweeper.mineCount;
    minesweeper.board.flat().forEach(boardCell=>{
      if(boardCell.mine) boardCell.flagged=true;
    });
  }

  renderMinesweeper();
  updateMinesweeperUI();
}

minesweeperBoard.addEventListener('click',event=>{
  const button=event.target.closest('.minesweeper-cell');
  if(!button) return;

  setActiveGame('minesweeper');
  const row=Number(button.dataset.row);
  const column=Number(button.dataset.column);

  if(minesweeper.flagMode){
    toggleMinesweeperFlag(row,column);
  }else{
    revealMinesweeperCell(row,column);
  }
});

minesweeperBoard.addEventListener('contextmenu',event=>{
  const button=event.target.closest('.minesweeper-cell');
  if(!button) return;

  event.preventDefault();
  setActiveGame('minesweeper');
  toggleMinesweeperFlag(Number(button.dataset.row),Number(button.dataset.column));
});

document.getElementById('minesweeperReset').addEventListener('click',()=>{
  setActiveGame('minesweeper');
  resetMinesweeper();
});

document.getElementById('minesweeperMode').addEventListener('click',()=>{
  setActiveGame('minesweeper');
  toggleMinesweeperMode();
});

resetMinesweeper();

const snakeCanvas=document.getElementById('snakeCanvas');
const snakeContext=snakeCanvas.getContext('2d');
const snakeElements={
  score:document.getElementById('snakeScore'),
  best:document.getElementById('snakeBest'),
  level:document.getElementById('snakeLevel'),
  status:document.getElementById('snakeStatus'),
  pause:document.getElementById('snakePause')
};

const snake={
  size:20,
  body:[],
  food:null,
  direction:{x:1,y:0},
  nextDirection:{x:1,y:0},
  score:0,
  best:readStoredNumber('snakeBest'),
  level:1,
  interval:160,
  timer:null,
  running:false,
  paused:false,
  gameOver:false
};

function placeSnakeFood(){
  do{
    snake.food={
      x:Math.floor(Math.random()*snake.size),
      y:Math.floor(Math.random()*snake.size)
    };
  }while(snake.body.some(segment=>segment.x===snake.food.x && segment.y===snake.food.y));
}

function clearSnakeTimer(){
  if(snake.timer){
    clearInterval(snake.timer);
    snake.timer=null;
  }
}

function drawSnake(){
  const cellSize=snakeCanvas.width/snake.size;

  snakeContext.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);
  snakeContext.fillStyle='rgba(4,15,22,0.98)';
  snakeContext.fillRect(0,0,snakeCanvas.width,snakeCanvas.height);

  snakeContext.strokeStyle='rgba(255,255,255,0.03)';
  for(let index=0; index<=snake.size; index+=1){
    const coordinate=index*cellSize;
    snakeContext.beginPath();
    snakeContext.moveTo(coordinate,0);
    snakeContext.lineTo(coordinate,snakeCanvas.height);
    snakeContext.stroke();

    snakeContext.beginPath();
    snakeContext.moveTo(0,coordinate);
    snakeContext.lineTo(snakeCanvas.width,coordinate);
    snakeContext.stroke();
  }

  if(snake.food){
    snakeContext.fillStyle='#ff7b94';
    snakeContext.beginPath();
    snakeContext.arc((snake.food.x*cellSize)+(cellSize/2),(snake.food.y*cellSize)+(cellSize/2),cellSize*0.28,0,Math.PI*2);
    snakeContext.fill();
  }

  snake.body.forEach((segment,index)=>{
    snakeContext.fillStyle=index===0 ? '#57d6ff' : '#30c1df';
    snakeContext.fillRect((segment.x*cellSize)+2,(segment.y*cellSize)+2,cellSize-4,cellSize-4);
  });
}

function updateSnakeUI(){
  snakeElements.score.textContent=String(snake.score);
  snakeElements.best.textContent=String(snake.best);
  snakeElements.level.textContent=String(snake.level);
  snakeElements.pause.textContent=snake.paused ? 'Resume' : 'Pause';

  if(snake.gameOver){
    snakeElements.status.textContent='Game over. Press Start to restart the run.';
  }else if(snake.paused){
    snakeElements.status.textContent='Paused. Resume when you want to keep moving.';
  }else if(snake.running){
    snakeElements.status.textContent='Use arrow keys or WASD. Avoid walls and your own tail.';
  }else{
    snakeElements.status.textContent='Use arrow keys or WASD. The snake speeds up as your score grows.';
  }
}

function resetSnake(){
  clearSnakeTimer();
  snake.body=[
    {x:6,y:10},
    {x:5,y:10},
    {x:4,y:10}
  ];
  snake.direction={x:1,y:0};
  snake.nextDirection={x:1,y:0};
  snake.score=0;
  snake.level=1;
  snake.interval=160;
  snake.running=false;
  snake.paused=false;
  snake.gameOver=false;
  placeSnakeFood();
  drawSnake();
  updateSnakeUI();
}

function startSnake(){
  setActiveGame('snake');
  if(snake.gameOver){
    resetSnake();
  }
  snake.running=true;
  snake.paused=false;
  clearSnakeTimer();
  snake.timer=setInterval(stepSnake,snake.interval);
  drawSnake();
  updateSnakeUI();
}

function pauseSnake(){
  setActiveGame('snake');
  if(snake.gameOver || (!snake.running && !snake.paused)) return;

  if(snake.paused){
    snake.paused=false;
    snake.running=true;
    clearSnakeTimer();
    snake.timer=setInterval(stepSnake,snake.interval);
  }else{
    snake.paused=true;
    snake.running=false;
    clearSnakeTimer();
  }

  updateSnakeUI();
}

function stepSnake(){
  if(!snake.running || snake.paused || snake.gameOver) return;

  snake.direction={...snake.nextDirection};
  const head={
    x:snake.body[0].x+snake.direction.x,
    y:snake.body[0].y+snake.direction.y
  };
  const willGrow=snake.food && head.x===snake.food.x && head.y===snake.food.y;

  const hitsWall=head.x < 0 || head.x >= snake.size || head.y < 0 || head.y >= snake.size;
  const bodyToCheck=willGrow ? snake.body : snake.body.slice(0,-1);
  const hitsSelf=bodyToCheck.some(segment=>segment.x===head.x && segment.y===head.y);

  if(hitsWall || hitsSelf){
    snake.gameOver=true;
    snake.running=false;
    snake.paused=false;
    clearSnakeTimer();
    drawSnake();
    updateSnakeUI();
    return;
  }

  snake.body.unshift(head);

  if(willGrow){
    snake.score+=1;
    snake.best=Math.max(snake.best,snake.score);
    writeStoredNumber('snakeBest',snake.best);
    snake.level=1+Math.floor(snake.score/4);
    const nextInterval=Math.max(70,160-((snake.level-1)*10));
    if(nextInterval !== snake.interval){
      snake.interval=nextInterval;
      clearSnakeTimer();
      snake.timer=setInterval(stepSnake,snake.interval);
    }
    placeSnakeFood();
  }else{
    snake.body.pop();
  }

  drawSnake();
  updateSnakeUI();
}

function handleSnakeAction(action){
  setActiveGame('snake');

  if(action==='start'){
    startSnake();
    return true;
  }

  if(action==='pause'){
    pauseSnake();
    return true;
  }

  if(action==='reset'){
    resetSnake();
    return true;
  }

  const directionMap={
    up:{x:0,y:-1},
    down:{x:0,y:1},
    left:{x:-1,y:0},
    right:{x:1,y:0}
  };

  const nextDirection=directionMap[action];
  if(!nextDirection) return false;

  if((nextDirection.x===-snake.nextDirection.x && nextDirection.y===-snake.nextDirection.y) && snake.body.length > 1){
    return true;
  }

  if(snake.gameOver){
    resetSnake();
  }

  if(!snake.running && !snake.paused){
    startSnake();
  }

  if(snake.paused){
    pauseSnake();
  }

  snake.nextDirection=nextDirection;
  return true;
}

document.getElementById('snakeStart').addEventListener('click',startSnake);
document.getElementById('snakePause').addEventListener('click',pauseSnake);
document.getElementById('snakeReset').addEventListener('click',resetSnake);
resetSnake();

function routeGameControl(game,action){
  if(game==='tetris') return handleTetrisAction(action);
  if(game==='snake') return handleSnakeAction(action);
  if(game==='minesweeper'){
    if(action==='reset'){
      resetMinesweeper();
      return true;
    }
    if(action==='flag'){
      toggleMinesweeperMode();
      return true;
    }
  }
  return false;
}

document.querySelectorAll('[data-game-control]').forEach(button=>{
  button.addEventListener('click',()=>{
    setActiveGame(button.dataset.gameControl);
    routeGameControl(button.dataset.gameControl,button.dataset.action);
  });
});

window.addEventListener('keydown',event=>{
  const tagName=document.activeElement?.tagName;
  if(tagName==='INPUT' || tagName==='TEXTAREA') return;
  if(document.getElementById('projectModal').style.display==='flex') return;

  let handled=false;

  if(activeGame==='tetris'){
    const tetrisKeyMap={
      ArrowLeft:'left',
      ArrowRight:'right',
      ArrowDown:'down',
      ArrowUp:'rotate'
    };

    const action=tetrisKeyMap[event.key] || ((event.key===' ' || event.code==='Space') ? 'drop' : null);
    if(action) handled=handleTetrisAction(action);
  }else if(activeGame==='snake'){
    const snakeKeyMap={
      ArrowUp:'up',
      ArrowDown:'down',
      ArrowLeft:'left',
      ArrowRight:'right',
      w:'up',
      a:'left',
      s:'down',
      d:'right'
    };

    const action=snakeKeyMap[event.key.toLowerCase?.() ?? event.key];
    if(action) handled=handleSnakeAction(action);
  }else if(activeGame==='minesweeper'){
    const lowerKey=event.key.toLowerCase();
    if(lowerKey==='r'){
      resetMinesweeper();
      handled=true;
    }else if(lowerKey==='f'){
      toggleMinesweeperMode();
      handled=true;
    }
  }

  if(handled){
    event.preventDefault();
  }
});

const hero=document.getElementById('home');
const heroSequence=hero?.querySelector('.hero-sequence');

if(hero && heroSequence){
  const clamp=(value,min,max)=>Math.min(Math.max(value,min),max);
  const frameCount=240;
  const frameEase=0.35;
  const frameSnap=0.05;
  const maxConcurrentLoads=6;
  const framePath=index=>`assets/hero-sequence/frame_${String(index).padStart(4,'0')}.png`;
  const context=heroSequence.getContext('2d', {alpha:false, desynchronized:true});
  const frames=new Array(frameCount);
  const frameState=new Array(frameCount).fill(0);
  const priorityQueue=[];
  const preloadQueue=Array.from({length:frameCount},(_,index)=>index);
  let activeLoads=0;
  let ticking=false;
  let renderRaf=0;
  let targetFrame=0;
  let currentFrame=0;

  const enqueuePriorityFrame=index=>{
    if(index < 0 || index >= frameCount || frameState[index] !== 0 || priorityQueue.includes(index)) return;
    priorityQueue.push(index);
  };

  const primeNearbyFrames=center=>{
    for(let offset=0; offset <= 8; offset += 1){
      enqueuePriorityFrame(center + offset);
      if(offset !== 0) enqueuePriorityFrame(center - offset);
    }
    pumpFrameLoads();
  };

  const drawCoverFrame=image=>{
    if(!context || !image) return;
    const bounds=hero.getBoundingClientRect();
    const dpr=window.devicePixelRatio || 1;
    const width=Math.max(1,Math.round(bounds.width * dpr));
    const height=Math.max(1,Math.round(bounds.height * dpr));

    if(heroSequence.width !== width || heroSequence.height !== height){
      heroSequence.width=width;
      heroSequence.height=height;
    }

    const imageRatio=image.naturalWidth / image.naturalHeight;
    const canvasRatio=width / height;
    let drawWidth=width;
    let drawHeight=height;
    let offsetX=0;
    let offsetY=0;

    if(imageRatio > canvasRatio){
      drawHeight=height;
      drawWidth=height * imageRatio;
      offsetX=(width - drawWidth) / 2;
    }else{
      drawWidth=width;
      drawHeight=width / imageRatio;
      offsetY=0;
    }

    context.clearRect(0,0,width,height);
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  };

  const nearestLoadedFrame=target=>{
    const rounded=Math.round(target);
    for(let offset=0; offset < frameCount; offset += 1){
      const previous=rounded - offset;
      if(previous >= 0 && frames[previous]) return previous;
      const next=rounded + offset;
      if(next < frameCount && frames[next]) return next;
    }
    return 0;
  };

  const renderSequence=()=>{
    renderRaf=0;
    const delta=targetFrame - currentFrame;

    if(Math.abs(delta) <= frameSnap){
      currentFrame=targetFrame;
    }else{
      currentFrame += delta * frameEase;
      renderRaf=window.requestAnimationFrame(renderSequence);
    }

    const drawIndex=nearestLoadedFrame(currentFrame);
    drawCoverFrame(frames[drawIndex]);
    primeNearbyFrames(Math.round(currentFrame));
  };

  const syncSequenceToScroll=()=>{
    const start=hero.offsetTop;
    const distance=Math.max(hero.offsetHeight,1);
    const progress=clamp((window.scrollY-start)/distance,0,1);
    targetFrame=progress * (frameCount - 1);

    if(!renderRaf){
      renderRaf=window.requestAnimationFrame(renderSequence);
    }
  };

  const requestScrollSync=()=>{
    if(ticking) return;
    ticking=true;
    window.requestAnimationFrame(()=>{
      syncSequenceToScroll();
      ticking=false;
    });
  };

  const loadFrame=index=>{
    if(index < 0 || index >= frameCount || frameState[index] !== 0) return;
    frameState[index]=1;
    activeLoads += 1;

    const image=new Image();
    image.decoding='async';
    image.src=framePath(index);
    image.onload=()=>{
      frames[index]=image;
      frameState[index]=2;
      activeLoads -= 1;

      if(index === 0 && !frames[nearestLoadedFrame(currentFrame)]){
        drawCoverFrame(image);
      }

      if(Math.round(currentFrame) === index || Math.round(targetFrame) === index){
        if(!renderRaf) renderRaf=window.requestAnimationFrame(renderSequence);
      }

      pumpFrameLoads();
    };
    image.onerror=()=>{
      frameState[index]=3;
      activeLoads -= 1;
      pumpFrameLoads();
    };
  };

  function pumpFrameLoads(){
    while(activeLoads < maxConcurrentLoads){
      let nextIndex;

      while(priorityQueue.length){
        const candidate=priorityQueue.shift();
        if(frameState[candidate] === 0){
          nextIndex=candidate;
          break;
        }
      }

      if(nextIndex === undefined){
        while(preloadQueue.length){
          const candidate=preloadQueue.shift();
          if(frameState[candidate] === 0){
            nextIndex=candidate;
            break;
          }
        }
      }

      if(nextIndex === undefined) break;
      loadFrame(nextIndex);
    }
  }

  primeNearbyFrames(0);
  pumpFrameLoads();
  syncSequenceToScroll();
  window.addEventListener('scroll', requestScrollSync, {passive:true});
  window.addEventListener('resize', requestScrollSync);
}

const projectData = {
  p1: {link: 'assets/Amazon clone/index.html'},
  p2: {link: 'assets/search box/index.html'},
  p3: {link: 'assets/rudra tours and travels/menu.html'},
  p4: {link: 'https://nightflixx.netlify.app/'}
};

function openProject(id){
  const modal=document.getElementById('projectModal');
  const iframe=document.getElementById('projectFrame');
  iframe.src = projectData[id].link;
  modal.style.display='flex';
}

function closeModal(){
  const modal=document.getElementById('projectModal');
  const iframe=document.getElementById('projectFrame');
  modal.style.display='none';
  iframe.src='';
}

window.addEventListener('click',e=>{
  if(e.target.id==='projectModal') closeModal();
});

window.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeModal();
});

document.getElementById('cvBtn').addEventListener('click',()=>{window.open('assets/resume.pdf','_blank')});
document.getElementById('downloadCV').addEventListener('click',()=>{window.open('assets/resume.pdf','_blank')});
document.getElementById('downloadResumeSmall').addEventListener('click',()=>{window.open('assets/resume.pdf','_blank')});

document.getElementById('contactForm').addEventListener('submit',function(e){
  e.preventDefault();

  const status=document.getElementById('formStatus');
  const fromName=this.from_name.value.trim();
  const fromEmail=this.from_email.value.trim();
  const message=this.message.value.trim();

  status.textContent='Opening your email app...';
  status.style.display='block';

  const subject=encodeURIComponent(`Portfolio message from ${fromName}`);
  const body=encodeURIComponent(`Name: ${fromName}\nEmail: ${fromEmail}\n\n${message}`);
  window.location.href=`mailto:meenaaryan385@gmail.com?subject=${subject}&body=${body}`;
});

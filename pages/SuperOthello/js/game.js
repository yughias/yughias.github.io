// GAME BOARD
let board = [];

// GAME COONSTANTS
const COLOR_BOARD = "#477148";
const BOARD_SIZE = 8;
const WHITE = -1;
const BLACK = +1;
const EMPTY = +0;
const PAWN_RADIUS = 0.8;
const CPU_MODE = 0;
const LOCAL_MODE = 1;
const RESOLUTION_RATIO = 0.6;

// GAME VARIABLES
let gameMode;
let currentPlayer;
let whiteCount;
let blackCount;
let gameOver;
let lastMove;
let waitOpponent;
let mouseX, mouseY;
let cell_size;
let waitConnection;

// DOM ELEMENTS OF GAME SCENARIO
let whitePlayerDOM;
let blackPlayerDOM;
let whiteCountDOM;
let blackCountDOM;
let whiteNameDOM;
let blackNameDOM;

function initGame(mode){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  whitePlayerDOM = document.getElementById("whiteName"); 
  blackPlayerDOM = document.getElementById("blackName"); 
  whiteCountDOM = document.getElementById("whiteCount");
  blackCountDOM = document.getElementById("blackCount");
  whiteNameDOM = document.getElementById("whiteName");
  blackNameDOM = document.getElementById("blackName");

  adjustCanvasSize();
  canvas.addEventListener("mousemove", getMousePosition);
  canvas.addEventListener("mousedown", mouseClicked);
  window.addEventListener("resize", adjustCanvasSize);
  window.requestAnimationFrame(renderer);
  newGame(mode);
}

async function newGame(mode){
  for(let i = 0; i < BOARD_SIZE; i++){
      board[i] = [];
      for(let j = 0; j < BOARD_SIZE; j++)
          board[i][j] = EMPTY;
  }
  gameMode = mode;
  currentPlayer = WHITE;
  
  board[3][3] = BLACK;
  board[4][4] = BLACK;
  board[4][3] = WHITE;
  board[3][4] = WHITE;

  waitOpponent = false;
  waitConnection = false;
  whiteCount = 0;
  blackCount = 0;
  gameOver = false;
  lastMove = undefined;

  if(gameMode == LOCAL_MODE){
    blackNameDOM.textContent = "NERO";
    whiteNameDOM.textContent = "BIANCO";
  }

  if(gameMode == CPU_MODE){
    blackNameDOM.textContent = "CPU LV. " + MAX_DEPTH;
    let name = "BIANCO";
    whiteNameDOM.textContent = name;
  }

  updateScore();
  showCurrentPlayer(currentPlayer);
}

function updateScore(){
  [whiteCountDOM.textContent, blackCountDOM.textContent] = [whiteCount, blackCount] = [countPawns(WHITE), countPawns(BLACK)];
}

function showCurrentPlayer(player){
  if(player == WHITE){
    whitePlayerDOM.className = "playing";
    blackPlayerDOM.className = "not-playing";
  } else {
    whitePlayerDOM.className = "not-playing";
    blackPlayerDOM.className = "playing";
  }
}

function countPawns(player){
  let count = 0;
  board.forEach((row) => row.forEach((cell) => count += cell == player));
  return count;
}

function drawBoard(){
  clearCanvas();
  fill(COLOR_BOARD);
  rect(0, 0, canvas.width, canvas.height);

  // draw board
  for(let i = 1; i < BOARD_SIZE; i++){
      // vertical line
      line(i*cell_size, 0, i*cell_size, canvas.height);

      // horizontal line
      line(0, i*cell_size, canvas.width, i*cell_size);
  }

  // draw game objects
  for(let x = 0; x < BOARD_SIZE; x++){
      for(let y = 0; y < BOARD_SIZE; y++){
          if(board[x][y] == 0)
              continue;
          if(board[x][y] == WHITE)
              ctx.fillStyle = "white";
          if(board[x][y] == BLACK)
              ctx.fillStyle = "black";
          let center = [x*cell_size + cell_size/2, y*cell_size + cell_size/2];
          circle(...center, cell_size*0.5*PAWN_RADIUS);
      }
  }
}

function drawWinText(){
  let txt = "PAREGGIO!";
  if(blackCount > whiteCount)
    txt = blackNameDOM.textContent + " VINCE!";
  if(whiteCount > blackCount)
    txt = whiteNameDOM.textContent + " VINCE!";
  let size = Math.round(canvas.width/10);
  ctx.font = size + "px serif";
  ctx.fillStyle = "red";
  text(txt, canvas.width/2, 50);
}

function adjustCanvasSize(){
  let resolution = Math.min(window.innerWidth, window.innerHeight);
  resolution *= RESOLUTION_RATIO;
  canvas.width = resolution;
  canvas.height = resolution;
  canvas.style.width = resolution + "px";
  canvas.style.height = resolution + "px";
  cell_size = canvas.width / BOARD_SIZE;
}

function renderer(){
  drawBoard();
  drawLastMove();
  drawPossibleMoves();
  drawSelectedMove();
  if(gameOver)
    drawWinText();
  window.requestAnimationFrame(renderer);
}

function drawPossibleMoves(){
  if(waitOpponent || waitConnection)
    return;
  fill("rgba(150, 150, 255, 0.5)");
  for(let y = 0; y < BOARD_SIZE; y++)
    for(let x = 0; x < BOARD_SIZE; x++)
      if(isValidMove(x, y, currentPlayer, board))
      circle(x*cell_size + cell_size/2, y*cell_size + cell_size/2, cell_size*0.5*PAWN_RADIUS);
}

function drawSelectedMove(){
  if(mouseX == undefined || mouseY == undefined)
    return;
  let [x, y] = [Math.floor(mouseX/cell_size), Math.floor(mouseY/cell_size)];
  if(x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE)
    return;
  if(waitOpponent == false && isValidMove(x, y, currentPlayer, board)){
    fill("rgb(150, 150, 255)");
    circle(x*cell_size + cell_size/2, y*cell_size + cell_size/2, cell_size*0.5*PAWN_RADIUS);
  }
}

function drawLastMove(){
  if(typeof lastMove != "undefined"){
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
    let center = [lastMove[0]*cell_size + cell_size/2, lastMove[1]*cell_size + cell_size/2];
    circle(...center, cell_size*0.35*PAWN_RADIUS);
    ctx.strokeStyle = "black";
  }
}

function mouseClicked(event){
  if(gameOver)
    return;
  let [x, y] = [Math.floor(mouseX/cell_size), Math.floor(mouseY/cell_size)];
  if(!waitConnection && !waitOpponent&& isValidMove(x, y, currentPlayer, board)){
      playSound();
      board = reverse(x, y, currentPlayer, board);
      lastMove = [x, y];
      updateScore();
      nextMove();
  }
}

function nextMove(){
  if(gameMode == CPU_MODE){
    waitOpponent = true;
    showCurrentPlayer(BLACK);
    setTimeout(() => {
      cpuMove();
      waitOpponent = false;
      updateScore();
      showCurrentPlayer(WHITE);
      if(endGame(board)){

        let stats = "cpu_draw";
        if(whiteCount > blackCount)
          stats = "cpu_win";
        if(whiteCount < blackCount)
          stats = "cpu_loss";

        gameOver = true;
        createGameOverButtons();
      } else if(noValidMove(currentPlayer, board))
        nextMove();
    }, 500);
  }
  
  if(gameMode == LOCAL_MODE){
    currentPlayer *= -1;
    showCurrentPlayer(currentPlayer);
    if(endGame(board)){
      gameOver = true;
      createGameOverButtons();
    } else if(noValidMove(currentPlayer, board))
      nextMove();
  }
}

function endGame(board){
  for(let y = 0; y < BOARD_SIZE; y++)
    for(let x = 0; x < BOARD_SIZE; x++)
      if(isValidMove(x, y, WHITE, board) || isValidMove(x, y, BLACK, board))
        return false;
  return true;
}

function noValidMove(player, board){
  for(let y = 0; y < BOARD_SIZE; y++)
    for(let x = 0; x < BOARD_SIZE; x++)
      if(isValidMove(x, y, player, board))
        return false;
  return true;
}

function getMousePosition(event){
    let rect = canvas.getBoundingClientRect();
    [mouseX, mouseY] = [event.clientX - rect.left, event.clientY - rect.top];
}

function isValidMove(x, y, player, board) {
  if(x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || board[x][y] != EMPTY)
    return false;

  for(let dx = -1; dx <= 1; dx++) {
    for(let dy = -1; dy <= 1; dy++) {
      if(dx == 0 && dy == 0)
        continue;
      let i = x + dx;
      let j = y + dy;
      if(i < 0 || i >= BOARD_SIZE || j < 0 || j >= BOARD_SIZE || board[i][j] != -player)
        continue;
      while(i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && board[i][j] == -player)
        [i, j] = [i+dx, j+dy];
      if(i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && board[i][j] == player)
        return true;
    }
  }

  return false;
}

function reverse(x, y, player, board) {
  let grid = [];
  for(let i = 0; i < BOARD_SIZE; i++)
      grid[i] = board[i].slice();
  grid[x][y] = player;

  for(let dx = -1; dx <= 1; dx++) {
    for(let dy = -1; dy <= 1; dy++) {
        if(dx == 0 && dy == 0)
          continue;
        let i = x + dx;
        let j = y + dy;
        let pawns = [];
        if(i < 0 || i >= BOARD_SIZE || j < 0 || j >= BOARD_SIZE || board[i][j] != -player)
          continue;
        while(i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && board[i][j] == -player) {
          pawns.push([i, j]);
          [i, j] = [i+dx, j+dy];
        }
        if(i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && board[i][j] == player)
          for(let pawn of pawns)
            grid[pawn[0]][pawn[1]] = player;
    }
  }

  return grid;
}

function createGameOverButtons(){
  createHomeReturnButton();
  let div = document.getElementsByClassName("actionButton-container")[0];
  let replayBtn = document.createElement("button");
  let gameDiv = document.getElementById("gameDiv");
  replayBtn.textContent = "Gioca di nuovo";
  replayBtn.className = "actionButton";
  replayBtn.addEventListener("click", playAgain);
  div.appendChild(replayBtn);

  gameDiv.appendChild(div);
}

function createHomeReturnButton(){
  let div = document.getElementsByClassName("actionButton-container")[0];
  if(div.childElementCount != 0)
    return;

  let homeBtn = document.createElement("button");
  homeBtn.textContent = "Menù";
  homeBtn.className = "actionButton";
  homeBtn.addEventListener("click", returnToHome);
  div.appendChild(homeBtn);

  body.appendChild(div);
}

function returnToHome(){
  window.location.href = "index.html";
}

function playAgain(){
  let buttons = document.getElementsByClassName("actionButton-container")[0];
  buttons.remove();
  newGame(gameMode);
}


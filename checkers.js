var pieceSelected = null;
var squareSelected = null;
var canJump = false;
var jumpSquares = new Array();
var moveSquares = new Array();
var piecesThatCanMove = new Array();
var piecesThatCanJump = new Array();
var parent;
var turn = 1;
var blackPiecesCount = 12;
var whitePiecesCount = 12;
window.onload = function(){
  var container=document.getElementById("container");
  createBoard();
}
function createBoard(){
  for(var i=0; i<8;i++){
    var col=document.createElement("div");
    container.appendChild(col);
    col.className="column";
    for(var j=0;j<8;j++){
      var square=document.createElement("div");
      square.className="square";
      var piece=document.createElement("div")
      piece.className="piece";
      col.appendChild(square);
      square.id = i+"-"+j;
      if((i%2 == 1 && j%2 == 1)||(i%2 == 0 && j%2 == 0)){
        square.style.background = "#F0DC82";
      }
      else{
        square.style.background = "#984928";
        if(i<3){
          piece.style.background = "black";
          square.appendChild(piece);
        }
        else if(i>4){
          piece.style.background = "white";
          square.appendChild(piece);
        }
      }
    }
  }
  var allPieces=document.getElementsByClassName("piece");
  for(var i=0; i<allPieces.length; ++i){
    allPieces[i].addEventListener("click", pieceClicked);
  }
  var allSquares=document.getElementsByClassName("square");
  for(var i=0; i<allSquares.length; ++i){
    if(allSquares[i].style.background === "rgb(152, 73, 40)"){
      allSquares[i].addEventListener("click", squareClicked);
    }
  }
}
function pieceClicked(){
  var piecesThatCanJump = jumpAvailable();
  var piecesThatCanMove = moveAvailable();
  canJump = false;
  if(piecesThatCanJump.length === 0){
    if(piecesThatCanMove.indexOf(this) !== -1){
      highlightPiece(this);
    }
  }
  else{
    if(piecesThatCanJump.indexOf(this) !== -1){
      highlightPiece(this);
      canJump = true;
    }
  }
}
function highlightPiece(p){
  var pieceColor = p.style.background;
  if(turn === 1 && pieceColor === "black" || turn === 2 && pieceColor === "white"){
    if(pieceSelected === null){
      p.style.border = "2px solid blue";
      pieceSelected = p;
    }
    else if(pieceSelected !== null){
      pieceSelected.style.border = "0";
      pieceSelected = p;
      pieceSelected.style.border = "2px solid blue"
    }
  }
}
function jumpAvailable(){
  var allPieces = document.getElementsByClassName("piece");
  var pieces = [];
  piecesThatCanJump = [];
  jumpSquares = [];
  for(var i = 0; i<allPieces.length; ++i){
    if(allPieces[i].style.background === "black" && turn === 1 || allPieces[i].style.background === "white" && turn === 2){
      pieces.push(allPieces[i]);
    }
  }
  for(var j = 0; j<pieces.length; ++j){
    var r = getRow(pieces[j].parentNode.id);
    var c = getCol(pieces[j].parentNode.id);
    jumpSquares[r+"-"+c] = new Array();
    if(isKing(pieces[j])){
      checkJump(getSquare(r-2, c+2), getSquare(r-1, c+1), pieces[j]);
      checkJump(getSquare(r-2, c-2), getSquare(r-1, c-1), pieces[j]);
      checkJump(getSquare(r+2, c+2), getSquare(r+1, c+1), pieces[j]);
      checkJump(getSquare(r+2, c-2), getSquare(r+1, c-1), pieces[j]);
    }
    else if(turn === 2){
      checkJump(getSquare(r-2, c+2), getSquare(r-1, c+1), pieces[j]);
      checkJump(getSquare(r-2, c-2), getSquare(r-1, c-1), pieces[j]);
    }
    else if(turn === 1){
      checkJump(getSquare(r+2, c+2), getSquare(r+1, c+1), pieces[j]);
      checkJump(getSquare(r+2, c-2), getSquare(r+1, c-1), pieces[j]);
    }
  }
  return piecesThatCanJump;
}
function checkJump(s1, s2, j){
  var r = getRow(j.parentNode.id);
  var c = getCol(j.parentNode.id);
  if(s1 !== null && s1.childNodes.length === 0 && s2.firstChild !== null && s2.firstChild.style.background !== j.style.background){
    piecesThatCanJump.push(j);
    jumpSquares[r+"-"+c].push(s1);
  }
}
function moveAvailable(){
  var allPieces = document.getElementsByClassName("piece");
  var pieces = [];
  piecesThatCanMove = [];
  moveSquares = [];
  for(var i = 0; i<allPieces.length; ++i){
    if(allPieces[i].style.background === "black" && turn === 1 || allPieces[i].style.background === "white" && turn === 2){
      pieces.push(allPieces[i]);
    }
  }
  for(var j of pieces){
    var r = getRow(j.parentNode.id);
    var c = getCol(j.parentNode.id);
    moveSquares[r+"-"+c] = new Array();
    if(isKing(j)){
      checkMove(getSquare(r-1, c+1), j);
      checkMove(getSquare(r-1, c-1), j);
      checkMove(getSquare(r+1, c+1), j);
      checkMove(getSquare(r+1, c-1), j);
    }
    else if(turn === 2){
      checkMove(getSquare(r-1, c+1), j);
      checkMove(getSquare(r-1, c-1), j);
    }
    else if(turn === 1){
      checkMove(getSquare(r+1, c+1), j);
      checkMove(getSquare(r+1, c-1), j);
    }
  }
  return piecesThatCanMove;
}
function checkMove(s, j){
  var r = getRow(j.parentNode.id);
  var c = getCol(j.parentNode.id);
  if(s !== null && s.childNodes.length === 0){
    piecesThatCanMove.push(j);
    moveSquares[r+"-"+c].push(s);
  }
}
function squareClicked(){
  if(pieceSelected !== null && this !== pieceSelected.parentNode && this.childNodes.length === 0){
    if(canJump){
      if(jumpSquares[pieceSelected.parentNode.id].indexOf(this) !== -1){
        squareSelected = this;
        var r1 = getRow(pieceSelected.parentNode.id);
        var r2 = getRow(squareSelected.id);

        var c1 = getCol(pieceSelected.parentNode.id);
        var c2 = getCol(squareSelected.id);

        var r = (r2 - r1)/2 + r1;
        var c = (c2 - c1)/2 + c1;
        var id = r+"-"+c;
        jumpPiece(id);
      }
    }
    else{
      if(moveSquares[pieceSelected.parentNode.id].indexOf(this) !== -1){
        squareSelected = this;
        makeMove();
      }
    }
  }
}
function getRow(sqID){
  var rStr = sqID.charAt(0);
  var rInt = +rStr;
  return rInt;
}
function getCol(sqID){
  var cStr = sqID.charAt(2);
  var cInt = +cStr;
  return cInt;
}
function getSquare(row, col){
  return document.getElementById(row+"-"+col);
}
function makeMove(){
  var parent = pieceSelected.parentNode;
  pieceSelected.style.border = "0";
  parent.removeChild(pieceSelected);
  squareSelected.appendChild(pieceSelected);

  if(moveAvailable().length === 0 && jumpAvailable().length === 0){
    if(turn === 1){
      gameOver("Black");
    }
    else{
      gameOver("White");
    }
  }

  if(turn === 1){
    turn = 2;
  }else{
    turn = 1;
  }
  var row = getRow(squareSelected.id);
  var color = pieceSelected.style.background;
  if((row === 0 && color === "white") || (row === 7 && color === "black")){
    var king=document.createElement("div");
    king.className = "king";
    pieceSelected.appendChild(king);
  }
  pieceSelected = null;
}
function jumpPiece(id){
  var jumpedSquare = document.getElementById(id);
  var jumpedPiece = jumpedSquare.firstChild;
  var pieceMoved = pieceSelected;
  var currentTurn = turn;
  jumpedSquare.removeChild(jumpedPiece);
  makeMove();
  if(pieceMoved.style.background === "white"){
    blackPiecesCount--;
    if(blackPiecesCount === 0){
      gameOver("White");
    }
  }
  else{
    whitePiecesCount--;
    if(whitePiecesCount === 0){
      gameOver("Black");
    }
  }
  turn = currentTurn;
  if(jumpAvailable().indexOf(pieceMoved) !== -1){
    pieceSelected = pieceMoved;
    pieceSelected.style.border = "2px solid blue";
  }
  else{
    if(turn === 1){
      turn = 2;
    }
    else{
      turn = 1;
    }
  }
}
function isKing(p){
  return p.childNodes.length !== 0;
}
function gameOver(winner){
  alert(winner+" wins!");
  newGame();
}
function newGame(){
  while(container.firstChild){
    container.removeChild(container.firstChild);
  }
  turn = 1;
  pieceSelected = null;
  squareSelected = null;
  blackPiecesCount = 12;
  whitePiecesCount = 12;
  createBoard();
}

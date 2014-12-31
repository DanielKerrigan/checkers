var pieceSelected = null;
var squareSelected = null;
var parent;
var turn = 1;
var blackPiecesCount = 12;
var whitePiecesCount = 12;
window.onload = function(){
  var container=document.getElementById("container");
  var rBtn = document.getElementById("resetButton");
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
    allSquares[i].addEventListener("click", squareClicked);
  }
}
function pieceClicked(){
  var pieceColor = this.style.background;
  for(var i of jumpAvailable()){
    if(this === i){

    }
  }
  if(turn === 1 && pieceColor === "black" || turn === 2 && pieceColor === "white")
    if(pieceSelected === null){
      this.style.border = "2px solid blue";
      pieceSelected = this;
    }
    else{
      pieceSelected.style.border = "0";
      pieceSelected = this;
      pieceSelected.style.border = "2px solid blue"
    }
}
function jumpAvailable(){
  var allPieces = document.getElementsByClassName("piece");
  var pieces = [];
  var piecesThatCanJump[];
  for(var i of allPieces){
    if(i.style.background === "black" && turn === 2 || i.style.background === "white" && turn === 1){
      pieces.push(i);
    }
  }
  for(var j of pieces){
    var r = getRow(j.parentNode.id);
    var c = getCol(j.parentNode.id);
    if(isKing(j)){
      if(getSquare(r+2, c+2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r+1, c+1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
      if(getSquare(r+2, c-2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r+1, c-1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
      if(getSquare(r-2, c+2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r-1, c+1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
      if(getSquare(r-2, c-2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r-1, c-1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
    }
    else if(turn === 1){
      if(getSquare(r-2, c+2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r-1, c+1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
      if(getSquare(r-2, c-2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r-1, c-1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
    }
    else if(turn === 2){
      if(getSquare(r+2, c+2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r+1, c+1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
      if(getSquare(r+2, c-2).childNodes.length === 0 && getSquare(r+1, c+1).firstChild !== null && getSquare(r+1, c-1).firstChild.style.background !== j.style.background){
        piecesThatCanJump.push(j);
      }
    }
  }
  return piecesThatCanJump;
}
function squareClicked(){
  if(pieceSelected !== null){
    squareSelected = this;
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
  pieceSelected.style.border = "0";
  parent.removeChild(pieceSelected);
  squareSelected.appendChild(pieceSelected);
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
  checkGameWon();
}
function jumpPiece(id){
  var jumpedSquare = document.getElementById(id);
  var jumpedPiece = jumpedSquare.firstChild;
  if(jumpedPiece !== null && jumpedPiece.style.background !== pieceSelected.style.background){
    jumpedSquare.removeChild(jumpedPiece);
    if(pieceSelected.style.background === "white"){
      blackPiecesCount--;
    }
    else{
      whitePiecesCount--;
    }
  }
  makeMove();
}
function isKing(p){
  return p.childNodes.length !== 0;
}
function checkGameWon(){
  if(blackPiecesCount === 0){
    alert("White wins!");
    newGame();
  }
  else if(whitePiecesCount === 0){
    alert("Black wins!");
    newGame();
  }
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

/*Daniel Kerrigan
  checkers.js
  */
var pieceSelected = null;// The piece that the player selected
var squareSelected = null;// The square that the player selected to move to
var canJump = false;// Can a piece make a jump?
var jumpSquares = []; //Squares that pieces can jump to
var moveSquares = [];//Squares that pieces can move to
var piecesThatCanMove = [];//Pieces that can jump another piece
var piecesThatCanJump = [];//Pieces that can make a move
var parent;//The parent of a piece, which is the square the piece is on
var turn = 1;// turn 1 represents black, turn 2 represents white
var blackPiecesCount = 12;// Game starts with 12 pieces of each color
var whitePiecesCount = 12;
// On load, create the board
window.onload = function(){
  var container=document.getElementById("container");
  createBoard();
};
// This function creates the checkerboard and pieces set up for a new game
function createBoard(){
  for(var i=0; i<8;i++){
    var col=document.createElement("div");
    container.appendChild(col);
    col.className="column";
    for(var j=0;j<8;j++){
      var square=document.createElement("div");
      square.className="square";
      var piece=document.createElement("div");
      piece.className="piece";
      col.appendChild(square);
      square.id = i+"-"+j;
      if((i%2 === 1 && j%2 === 1)||(i%2 === 0 && j%2 === 0)){
        square.style.background = "#F0DC82";//tan color
      }
      else{
        square.style.background = "#984928";//brown color
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
  //Add event listeners to both the pieces and the squares that pieces can be on
  var allPieces=document.getElementsByClassName("piece");
  for(var k=0; k<allPieces.length; ++k){
    allPieces[k].addEventListener("click", pieceClicked);
  }
  var allSquares=document.getElementsByClassName("square");
  for(var m=0; m<allSquares.length; ++m){
    if(allSquares[m].style.background === "rgb(152, 73, 40)"){
      allSquares[m].addEventListener("click", squareClicked);
    }
  }
}
// this method is called when a piece is clicked
function pieceClicked(){
  var piecesThatCanJump = jumpAvailable(); //array of pieces that can make a jump
  var piecesThatCanMove = moveAvailable(); //array of pieces that can make a move
  canJump = false;
  // addBorder(this);
  if(piecesThatCanJump.length === 0){
    if(piecesThatCanMove.indexOf(this) !== -1){
      // If no pieces can jump and the piece clicked can make a move, then highlight it
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
// Highlight piece p and de-highlight any other pieces highlighted
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
      pieceSelected.style.border = "2px solid blue";
    }
  }
}
// this function returns an array of pieces that can make a jump
function jumpAvailable(){
  var allPieces = document.getElementsByClassName("piece");
  var pieces = []; // will store all pieces of one color, depending on the turn
  piecesThatCanJump = [];
  jumpSquares = []; // the squares that the pieces can jump to
  for(var i = 0; i<allPieces.length; ++i){
    if(allPieces[i].style.background === "black" && turn === 1 || allPieces[i].style.background === "white" && turn === 2){
      pieces.push(allPieces[i]);
    }
  }
  for(var j = 0; j<pieces.length; ++j){
    var r = getRow(pieces[j].parentNode.id);//row of the piece
    var c = getCol(pieces[j].parentNode.id);//column of the piece
    jumpSquares[r+"-"+c] = [];
    if(isKing(pieces[j])){//if the piece is a king, check if it can make any jumps up or down the board
      checkJump(getSquare(r-2, c+2), getSquare(r-1, c+1), pieces[j]);
      checkJump(getSquare(r-2, c-2), getSquare(r-1, c-1), pieces[j]);
      checkJump(getSquare(r+2, c+2), getSquare(r+1, c+1), pieces[j]);
      checkJump(getSquare(r+2, c-2), getSquare(r+1, c-1), pieces[j]);
    }
    else if(turn === 2){//if it's white's turn, then check if it can make any jumps "up" the board
      checkJump(getSquare(r-2, c+2), getSquare(r-1, c+1), pieces[j]);
      checkJump(getSquare(r-2, c-2), getSquare(r-1, c-1), pieces[j]);
    }
    else if(turn === 1){//if it's black's turn, then check if it can make any jumps "down" the board
      checkJump(getSquare(r+2, c+2), getSquare(r+1, c+1), pieces[j]);
      checkJump(getSquare(r+2, c-2), getSquare(r+1, c-1), pieces[j]);
    }
  }
  return piecesThatCanJump;
}
// if piece j can jump over a piece on square s2 onto square s1, then add piece j
// to the array piecesThatCanJump and add the square s1 to jumpSquares
function checkJump(s1, s2, j){
  var r = getRow(j.parentNode.id);
  var c = getCol(j.parentNode.id);
  if(s1 !== null && s1.childNodes.length === 0 && s2.firstChild !== null && s2.firstChild.style.background !== j.style.background){
    piecesThatCanJump.push(j);
    jumpSquares[r+"-"+c].push(s1);
  }
}
// this function returns an array of pieces that can make a move (not a jump)
function moveAvailable(){
  var allPieces = document.getElementsByClassName("piece");
  var pieces = [];
  piecesThatCanMove = [];
  moveSquares = [];// squares that the pieces can move to
  for(var i = 0; i<allPieces.length; ++i){
    if(allPieces[i].style.background === "black" && turn === 1 || allPieces[i].style.background === "white" && turn === 2){
      pieces.push(allPieces[i]);
    }
  }
  for(var j = 0; j<pieces.length; ++j){
    var r = getRow(pieces[j].parentNode.id);// row of the piece
    var c = getCol(pieces[j].parentNode.id);// square of the piece
    moveSquares[r+"-"+c] = [];// squares that the pieces can move to
    if(isKing(pieces[j])){// if the piece is a king, check if it can make any moves "up" or "down" the board
      checkMove(getSquare(r-1, c+1), pieces[j]);
      checkMove(getSquare(r-1, c-1), pieces[j]);
      checkMove(getSquare(r+1, c+1), pieces[j]);
      checkMove(getSquare(r+1, c-1), pieces[j]);
    }
    else if(turn === 2){// if the piece is white, check if it can make any moves "up" the board
      checkMove(getSquare(r-1, c+1), pieces[j]);
      checkMove(getSquare(r-1, c-1), pieces[j]);
    }
    else if(turn === 1){// if tge piece is black, check if it can make any moves "down" the board
      checkMove(getSquare(r+1, c+1), pieces[j]);
      checkMove(getSquare(r+1, c-1), pieces[j]);
    }
  }
  return piecesThatCanMove;
}
// if piece j can to square s, then add j to piecesThatCanMove and add s to moveSquares
function checkMove(s, j){
  var r = getRow(j.parentNode.id);
  var c = getCol(j.parentNode.id);
  if(s !== null && s.childNodes.length === 0){
    piecesThatCanMove.push(j);
    moveSquares[r+"-"+c].push(s);
  }
}
// this function is called when a square is clicked
function squareClicked(){
  // if a piece is selected, if the squareSelected is not the same square that the pieceSelcted is on,
  // and if the square clicked does not have a piece on it, then select this square
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
// return the row of a square as a number
function getRow(sqID){
  var rStr = sqID.charAt(0);
  var rInt = +rStr;
  return rInt;
}
// return the column of a square as a number
function getCol(sqID){
  var cStr = sqID.charAt(2);
  var cInt = +cStr;
  return cInt;
}
// given a row and column, return the square at that position
function getSquare(row, col){
  return document.getElementById(row+"-"+col);
}
// move the pieceSelected from its current square to squareSelected
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
  //If a piece makes it to the opposite side of the board, make it a king.
  if((row === 0 && color === "white") || (row === 7 && color === "black")){
    pieceSelected.style.boxShadow = "inset 0 0 1em gold";
  }
  pieceSelected = null;
}
// move the pieceSelected from its current square to squareSelected
// remove the piece that pieceSelected jumped over.
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
  // the if...else below is to check if the piece can make another jump
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
// returns whether or not the piece is a king
function isKing(p){
  return p.style.boxShadow !== "";
}
// when the game is over, alert who won and start a new game
function gameOver(winner){
  alert(winner+" wins!");
  newGame();
}
// remove everything from the container, reset variable values, and create a new board.
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

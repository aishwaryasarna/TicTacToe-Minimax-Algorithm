var origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const cells = document.querySelectorAll('.cell');
startGame();

function selectSym(sym){
	humanPlayer = sym;
	aiPlayer = sym==='O' ? 'X' : 'O';
	origBoard = Array.from(Array(9).keys());
	for(let i=0; i< cells.length; i++){
		cells[i].addEventListener('click', turnClick,false);
	}
	if(aiPlayer === 'X'){
		turn(bestSpot(),aiPlayer);
	}
	document.querySelector('.selectSym').style.display = "none";
}

function startGame(){
	document.querySelector(".endgame").style.display = "none";
	document.querySelector('.endgame .text').innerText ="";

	document.querySelector('.selectSym').style.display = "block";
	for(var i=0; i<cells.length; i++){
		cells[i].innerText ='';
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
	}
}

function turnClick(square){
	if(typeof origBoard[square.target.id] == 'number'){
		turn(square.target.id, humanPlayer)
        if(!checkWin(origBoard,humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
    
}

function turn(squareId, player){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if(gameWon) 
		gameOver(gameWon)
	checkTie();
}

function checkWin(board, player){
	let plays = board.reduce((a,e,i) =>
	    (e===player) ? a.concat(i): a, []);
	let gameWon = null;
	for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
        	gameWon = {index: index, player: player};
        	break;
        }
	}
	return gameWon;
}

function gameOver(gameWon){
	for(let index of winCombos[gameWon.index]){
		document.getElementById(index).style.background-color = 
		ameWon.player === humanPlayer ? "blue" : "red";
	}

	for(var i=0; i<cells.length; i++){
		cells[i].removeEventListener('click',turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You lose.");
}

function declareWinner(who){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
	return minimax(origBoard, aiPlayer).index;
}

function checkTie(){
	if(emptySquares().length == 0){
		for(var i =0 ; i<cells.length; i++){
			cells[i].style.backgroundColor = "green";
            cells[i].removeeventListener('click',turnclick, false);   
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player){
	var availSpots = emptySquares();

	if(checkWin(newBoard, humanPlayer)){
		return {score : -10};
	}
	else if(checkWin(newBoard, aiPlayer)){
		return {score : 10};
	}
	else if(availSpots.length === 0){
		return {score : 0};
	}

	var moves = [];
	for(var i=0; i<availSpots.length; i++){
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if(player == aiPlayer){
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		}
		else{
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer){
		var bestScore = -10000;
		for(var i=0; i< moves.length; i++){
			if(moves[i].score > bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else{
		var bestScore = 10000;
		for(var i=0; i< moves.length; i++){
			if(moves[i].score < bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];

}

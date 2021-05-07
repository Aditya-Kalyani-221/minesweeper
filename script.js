document.addEventListener('DOMContentLoaded', () => {

	document.querySelector(".grid").style.display = "none";

});

var isGameOver = false;
var squares = [];
var flag = 0;

function submitValues () {

	let rows = parseInt(document.getElementById("rows").value);
	let cols = parseInt(document.getElementById("rows").value);
	let mines = parseInt(document.getElementById("mines").value);
	if(!(rows && cols && mines)) {
		return;
	}
	renderGrid(rows, cols, mines);
	return;
}

function renderGrid (rows, cols, mines) {

	document.querySelector(".grid").style.display = "flex";
	document.querySelector(".grid").style.height = rows*42+"px";
	document.querySelector(".grid").style.width = rows*42+"px";
	document.querySelector(".modal").style.display = "none";
	let grid = document.querySelector(".grid");

	const mineArray = Array(mines).fill("mine");
	const validArray = Array(rows*cols - mines).fill("valid");
	let game = [...mineArray, ...validArray];
	game = game.sort(() => Math.random() - 0.5);

	for(let i=0; i<rows*cols; i++) {
		const square = document.createElement("div");
		square.setAttribute("id", i);
		square.classList.add(game[i]);
		grid.appendChild(square);
		squares.push(square);

		square.addEventListener('click', function(e) {
			selectSquare(square,rows);
		})

		square.oncontextmenu = function(e) {
			e.preventDefault();
			addFlag(square, mines);
		}
	}

	for(let i=0; i<squares.length; i++) {
		let totalMines = 0;
		let isLeftEnd = (i % rows === 0);
		let isRightEnd = (i % rows === rows-1);

		if(squares[i].classList.contains("valid")) {
			if(i>0 && !isLeftEnd && squares[i-1].classList.contains("mine")) {
				totalMines++;
			}
			if(i>rows-1 && !isRightEnd && squares[i+1-rows].classList.contains("mine")) {
				totalMines++;
			}
			if(i>rows && squares[i-rows].classList.contains("mine")) {
				totalMines++;
			}
			if(i>rows+1 && !isLeftEnd && squares[i-1-rows].classList.contains("mine")) {
				totalMines++;
			}
			if(i<rows*rows-2 && !isRightEnd && squares[i+1].classList.contains("mine")) {
				totalMines++;
			}
			if(i<rows*(rows-1) && !isLeftEnd && squares[i-1+rows].classList.contains("mine")) {
				totalMines++;
			}
			if(i<rows*(rows-1)-2 && !isRightEnd && squares[i+1+rows].classList.contains("mine")) {
				totalMines++;
			}
			if(i<rows*(rows-1)-1 && squares[i+rows].classList.contains("mine")) {
				totalMines++;
			}
			squares[i].setAttribute("data",totalMines);
		}
	}
}

function selectSquare(square,rows) {
	let squareId = square.getAttribute("id");
	if(isGameOver || square.classList.contains("square-clicked") || square.classList.contains("flag")) {
		return;
	}
	if(square.classList.contains("mine")) {
		gameOver(square);
	}
	else {
		let totalMines = square.getAttribute("data");
		square.classList.add("square-clicked");
		if(totalMines != 0) {
			square.innerHTML = totalMines;
			return;
		}
		checkSquare(square,squareId,rows);
	}
	square.classList.add("square-clicked");
}

function checkSquare(square, squareId,rows) {
	const isLeftEnd = (squareId % rows === 0);
	const isRightEnd = (squareId % rows === rows-1);

	setTimeout(() => {
		if(squareId > 0 && !isLeftEnd) {
			const newSquareId = squares[parseInt(squareId)-1].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId > rows-1 && !isRightEnd) {
			const newSquareId = squares[parseInt(squareId)+1-rows].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId > rows) {
			const newSquareId = squares[parseInt(squareId)-rows].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId > rows+1 && !isLeftEnd) {
			const newSquareId = squares[parseInt(squareId)-1-rows].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId < rows*rows-2 && !isRightEnd) {
			const newSquareId = squares[parseInt(squareId)+1].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId < rows*(rows-1) && !isLeftEnd) {
			const newSquareId = squares[parseInt(squareId)-1+rows].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId < rows*(rows-1)-2 && !isRightEnd) {
			const newSquareId = squares[parseInt(squareId)+1+rows].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}
		if(squareId < rows*(rows-1)-1) {
			const newSquareId = squares[parseInt(squareId)+rows].getAttribute("id");
			const newSquare = document.getElementById(newSquareId);
			selectSquare(newSquare,rows);
		}

	}, 100);
}

function gameOver(square) {

	isGameOver = true;
	squares.forEach(square => {
		if(square.classList.contains("mine")) {
			square.innerHTML = "💣";
		}
	})
	setTimeout(() => {
		alert("Game Over");
	}, 100)
}

function addFlag(square, mines) {
	if(isGameOver) {
		return;
	}
	if(!square.classList.contains("square-clicked") && flag < mines) {
		if(!square.classList.contains("flag")) {
			square.classList.add("flag");
			square.innerHTML = "🚩";
			flag++;
			checkForWin(mines);
		}
		else {
			square.classList.remove("flag");
			square.innerHTML = "";
			flag--;
		}
	}
}

function checkForWin(mines) {
	let matches = 0;
	for(let i=0; i<squares.length; i++) {
		if(squares[i].classList.contains("flag") && squares[i].classList.contains("mine")) {
			matches++;
		}
		if(matches === mines) {
			isGameOver = true;
			console.log("You win");
		}
	}
	if(matches === mines) {
		setTimeout(() => {
		alert("You Win");
	}, 100)
	}
}
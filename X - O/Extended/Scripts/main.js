var previousPlayer = "";
var winnerCells = {};
var cells = ["","","","","","","","",""];
var cellIdToTableId = {"0":"a1", "1":"a2", "2":"a3", 
					   "3":"b1", "4":"b2", "5":"b3",
					   "6":"c1", "7":"c2", "8":"c3"};
var canStartGame = false;
var hasComputer = true;
var historyLog = "";
var centerCellIndex = 4;

function StartGame() {
	var elements = document.getElementsByName("gameType");
	hasComputer = elements[0].checked;
	if (!hasComputer && !elements[1].checked)
		return;
	canStartGame = true;
    previousPlayer = "";
	winnerCells = {};
	cells = ["","","","","","","","",""];
	CleanHistory();
	HideElement("menu");
	ShowElement("game");
	HideElement("restart");
	DrawCells();
	historyLog = "History log: \n";
	if (!hasComputer)  
		return;
	if (GetRandomInt(2) === 1) {
		var startInfo = GetComputerStartCellInfo();
		var startPlayer = GetNextPlayer(previousPlayer);
		PlaceCore(startInfo[0], startPlayer, " - " + startInfo[1]);
		return;
	}
}
function RestartGame() {
	ShowElement("menu");
	HideElement("game");
	HideElement("restart");
}
function HideElement(id) {
	GetElement(id).hidden = true;
}
function ShowElement(id) {
	GetElement(id).hidden = false;
}
function GetNextPlayer(player) {
	return player === "X" ? "0" : "X";
}
function Add(cells, id, player) {
	for (var i = 0; i < 9; i++) 
		if (id == i.toString()) 
			cells[i] = player;
}
function Copy(sourceCells, targetCells) {
	for (var i = 0; i < 9; i++)
		targetCells[i] = sourceCells[i];
}
function IsContinueGame() {
	for (var i = 0; i < 9; i++) 
		if (cells[i] === "")
			return true;
	return false;
}
function HasWin() {
	return winnerCells[0] !== undefined;
}
function Place(box) {
	if (!canStartGame){
		alert("Can't start game");
		return;
	}
	if (HasWin()) {
		alert("Has win");
		return;
	}
	if(box.innerText !== "") {
		alert("Cell is busy");
		return;
	}
	var currentPlayer = GetNextPlayer(previousPlayer);
	if (!hasComputer) {
		PlaceCore(box.id, currentPlayer, "");
		return;
	}
	var id = box.id;
	Add(cells, id, currentPlayer);	
	InitWinnerCells(cells, winnerCells);
	if (HasWin()) {
		DrawCells();
		DrawHistoryLog(currentPlayer, id, "\nHas win!");
		ShowElement("restart");
		return;
	}
	var computerPlayer = GetNextPlayer(currentPlayer);
	var computerCellInfo = GetComputerCurrentCellInfo(currentPlayer, computerPlayer);	
	if (computerCellInfo) {
		DrawHistoryLog(currentPlayer, id, "\n");
		PlaceCore(computerCellInfo[0], computerPlayer, " - " + computerCellInfo[1]);
		return;
	}
	DrawCells();
	DrawHistoryLog(currentPlayer, id, "\nHas not win!");
	ShowElement("restart");
}
function PlaceCore(id, player, message){
	Add(cells, id, player);	
	InitWinnerCells(cells, winnerCells);
	DrawCells();
	previousPlayer = player;
	if (HasWin()) {
		DrawHistoryLog(player, id, message + "\nHas win!");
		ShowElement("restart");
		return;
	}
	if (IsContinueGame()) {
		DrawHistoryLog(player, id, message + "\n");
		return;
	}
	DrawHistoryLog(player, id, message + "\nHas not win!");
	ShowElement("restart");
}
function DrawCells() {
	for (var i = 0; i < 9; i++) {
		var id = i.toString();
		var box = GetElement(id);
		box.innerText = cells[i];
		if (box.innerText !== "") {
			if (IsWinnerCell(id))
				box.style.color = "#FF0000";
			else
				box.style.color = "#0000FF";
		}
	}
}
function IsWinnerCell(id) {
	for (var i = 0; i < 2; i++) {
		var scope = winnerCells[i];
		if (scope === undefined)
			break;
		for (var j = 0; j < 3; j++) 
			if(scope[j] === id)
				return true;
	}
	return false;
}
function DrawHistoryLog(player, id, message){
	historyLog = historyLog + player + "(" + cellIdToTableId[id] + ")" + message;
	GetElement("history").innerText = historyLog;
}
function CleanHistory() {
	GetElement("history").innerText = "";
}
function GetElement(id) {
	return document.getElementById(id);
}

function GetComputerStartCellInfo() {
	var cornerCellId = GetRandomFreeCellId(cells, [0,2,6,8]);
	return [cornerCellId, "Start random corner"]; 
}
function GetComputerCurrentCellInfo(currentPlayer, computerPlayer) {
	var copyCells = ["","","","","","","","",""];
	Copy(cells, copyCells);
	var winnerCellId = GetWinnerCellId(computerPlayer, copyCells);
	if (winnerCellId) 
		return [winnerCellId, "Computer can be winner"];
	var playerCellId = GetWinnerCellId(currentPlayer, copyCells);
	if (playerCellId) 
		return [playerCellId, "Player not will win"];
	var cornerCellId = GetRandomFreeCellId(cells, [0,2,6,8]);
	if (cornerCellId) 
		return [cornerCellId, "Random corner"];
	if (cells[centerCellIndex] === "") 
		return [centerCellIndex.toString(), "Center"];
	var randomCellId = GetRandomFreeCellId(cells, [1,3,5,7]);
	if (randomCellId) 
		return [randomCellId, "Random line"];
	return undefined;
}
function GetWinnerCellId(player, cells) {
	for (var i = 0; i < 9; i++) {
		if (cells[i] === "") {
			cells[i] = player;
			var winnerCells = {};
			InitWinnerCells(cells, winnerCells);
			if (winnerCells[0] !== undefined)
				return i.toString();
			else 
				cells[i] = "";
		}
	}
	return undefined;
}
function GetRandomFreeCellId(cells, indexes) {
	var emptyCellIndexes = ["","","",""];
	var emptyCellCurrentIndex = -1;
	for (var i=0; i<indexes.length; i++){
		var currentIndex = indexes[i];
		if (cells[currentIndex] === "") {
			emptyCellCurrentIndex++;
			emptyCellIndexes[emptyCellCurrentIndex] = currentIndex;
		}
	}
	if (emptyCellCurrentIndex === -1)
		return undefined;
	else 
		return emptyCellIndexes[GetRandomInt(emptyCellCurrentIndex + 1)].toString();
}
function InitWinnerCells(cells, winnerCells) {
	CheckWinner(cells, winnerCells, "0", "1", "2");
	CheckWinner(cells, winnerCells, "3", "4", "5");
	CheckWinner(cells, winnerCells, "6", "7", "8");
	CheckWinner(cells, winnerCells, "0", "3", "6");
	CheckWinner(cells, winnerCells, "1", "4", "7");
	CheckWinner(cells, winnerCells, "2", "5", "8");
	CheckWinner(cells, winnerCells, "0", "4", "8");
	CheckWinner(cells, winnerCells, "2", "4", "6");
}
function CheckWinner(cells, winnerCells, firstId, secondId, thirdId) {
	var firstText = cells[firstId];
	var secondText = cells[secondId];
	var thirdText = cells[thirdId];
	if(firstText !== "" && firstText === secondText && firstText === thirdText){
		if (winnerCells[0] === undefined) 
			winnerCells[0] = [firstId, secondId, thirdId];
		else 
			winnerCells[1] = [firstId, secondId, secondId];
	}
}
function GetRandomInt(max) {
	return Math.floor(Math.random() * max);
}
let canvas=document.getElementById("canvas");
let ctx=canvas.getContext("2d"); 
let heldDown={};
window.addEventListener("keydown", 
	function(keyInfo) {
		heldDown[event.keyCode]=true;
	}, false);
window.addEventListener("keyup", 	
	function(keyInfo) {
		delete heldDown[event.keyCode];
	}, false);

let ball = {
	x:320, y: 240, radius:8, xSpeed:5,ySpeed:0,
	reverseX: function() {
		this.xSpeed *= -1;
	},
	reverseY: function() {
		this.ySpeed *= -1;
	},
	reset: function() {
		this.x = 320;
		this.y = 240;
		this.xSpeed = 5;
		this.ySpeed = 0;
	},
	isBouncing: function(){
		return ball.ySpeed != 0;
	},
	modifyXSpeedBy: function(modification){
		let nextModification = this.xSpeed < 0 ? -modification : modification;
		let nextValue = this.xSpeed + nextModification;
		if (nextValue > 9)
			nextValue = 9;
		if (nextValue < -9)
			nextValue = -9;
		this.xSpeed = nextValue;
	},
	modifyYSpeedBy: function(modification){
		let nextValue=this.ySpeed < 0 ? -modification : modification;
		this.ySpeed += nextValue;
	}
};
let player = new paddle(5, 200, 25, 100, "white");
let ai = new paddle(610, 200, 25, 100, "red");
let gameMap = new map(0, 0, 640, 480, "green", 2);

function map(x, y, width, height, fillStyle, borderWidth) {
	this.x=x;
	this.y=y;
	this.width = width;
	this.height = height; 
	this.fillStyle = fillStyle;
	this.borderWidth = borderWidth;
}
function paddle(x, y, width, height, fillStyle) {
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
	this.fillStyle = fillStyle;
	this.speedModifier=0;
	this.count=0;
	this.hasCollidedWith = function(ball) {
		let paddleLeftWall = this.x;
		let paddleRightWall = this.x + this.width;
		let paddleTopWall = this.y;
		let paddleBottomWall = this.y + this.height;
		if (ball.x > paddleLeftWall &&
			ball.x < paddleRightWall &&
			ball.y > paddleTopWall &&
			ball.y < paddleBottomWall)
			return true;;
		return false;
	};
	this.move = function(keyCode) {
		let nextY = this.y;
		if (keyCode == 40) {
			nextY += 5;
			this.speedModifier = 1.5;
		}
		else if (keyCode == 38) {
			nextY += -5;
			this.speedModifier = 1.5;	
		}
		else {
			this.speedModifier = 0;
		}
		nextY = nextY < 0 ? 0 : nextY;
		nextY = nextY + this.height > 480 ? 480 - this.height : nextY;
		this.y = nextY;
	};
}
function tick() {
    updateGame();
	draw();
	window.setTimeout("tick()", 1000/60);
}
function updateGame() {
	ball.x += ball.xSpeed;
	ball.y += ball.ySpeed;
	if(ball.x < 0) {
		ai.count++;
		ball.reset();
	}
	if(ball.x > 640){
		player.count++;
		ball.reset();
	}
	if(ball.y <= 0 || ball.y >=480){
		ball.reverseY();
	}
	let collidedWithPlayer = player.hasCollidedWith(ball);
	if(collidedWithPlayer){
		ball.reverseX();
		ball.modifyXSpeedBy(0.25);
		ball.modifyYSpeedBy(player.speedModifier);
	}
	let collidedWithAi = ai.hasCollidedWith(ball);
	if(collidedWithAi){
		ball.reverseX();
		ball.modifyXSpeedBy(0.25);
		ball.modifyYSpeedBy(ai.speedModifier);
	}
	for(let keyCode in heldDown)
		player.move(keyCode);
	let aiMiddle = ai.y + (ai.height / 2);
	if(aiMiddle < ball.y)
		ai.move(40);
	if(aiMiddle > ball.y)
		ai.move(38);
}

function renderBall(ball) {
	ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI,false);
	ctx.fillStyle="white";
	ctx.fill();
}
function renderPaddle(paddle) {
	ctx.fillStyle=paddle.fillStyle;
	ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
}
function renderMap(map) {
	ctx.fillStyle="black";
	ctx.fillRect(map.x,map.y, map.width,map.height);
	ctx.fillStyle=map.fillStyle;
	ctx.fillRect(map.x + map.borderWidth,map.y + map.borderWidth, map.width - 2 * map.borderWidth, map.height - 2 * map.borderWidth);
}

function draw() {
	renderMap(gameMap);
	renderPaddle(player);
	renderPaddle(ai);
	renderBall(ball);
}

tick();
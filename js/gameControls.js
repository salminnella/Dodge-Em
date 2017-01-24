// JavaScript Document
var gameArea;
var gamePiece;
var obstacles = [];
var score;

function restartGame() {
	document.getElementById("restartButton").style.display = "none";
	gameArea.stop();
	gameArea.clear();
	gameArea = {};
	gamePiece = {};
	obstacles = [];
	score = {};
	document.getElementById("gamearea").innerHTML = "";
	beginGame();
}

function beginGame() {
	window.resizeTo(1200, 900);
    gameArea = new gameScreen();
	gamePiece = new component(40, 40, "images/smiley-right.png", 10, 120, "image");
    score = new component("30px", "Consolas", "black", 330, 40, "text");
    gameArea.start();
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
		var gameScreen = document.getElementById("gamearea");
        this.canvas.width = 520;
        this.canvas.height = 390;
        this.context = this.canvas.getContext("2d");
        gameScreen.insertBefore(this.canvas, gameScreen.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            gameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.key = false;
        })
    },
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
        clearInterval(this.interval);
		var gameScreen = document.getElementById("gamearea");
		gameScreen.style.backgroundColor = "black";
		this.canvas.style.opacity = ".6";
    }
}

function gameScreen() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 524;
    this.canvas.height = 390;
    document.getElementById("gamearea").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
		var gameScreen = document.getElementById("gamearea");
		gameScreen.style.backgroundColor = "black";
		this.canvas.style.opacity = ".6";
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function component(width, height, color, x, y, type) {
	this.type = type;
	if (type == "image") {
    	this.image = new Image();
    	this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = gameArea.context;
		if (this.type == "text") {
        	ctx.font = this.width + " " + this.height;
        	ctx.fillStyle = color;
        	ctx.fillText(this.text, this.x, this.y);
    	} else if (type == "image") {
      		ctx.drawImage(this.image, 
        	this.x, 
        	this.y,
        	this.width, this.height);
    	} else {
      		ctx.fillStyle = color;
     		ctx.fillRect(this.x, this.y, this.width, this.height);
    	}
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
	this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width - 7);
        var mytop = this.y + 5;
        var mybottom = this.y + (this.height - 5);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < obstacles.length; i += 1) {
        if (gamePiece.crashWith(obstacles[i])) {
            gameArea.stop();
			document.getElementById("restartButton").style.display = "block";
            return;
        } 
    }
    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyinterval(150)) {
        x = gameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        obstacles.push(new component(10, height, "blue", x, 0));
        obstacles.push(new component(10, x - height - gap, "blue", x, height + gap));
    }
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }
	score.text="SCORE: " + gameArea.frameNo;
    score.update();
    gamePiece.newPos(); 
    gamePiece.update();
}

window.onkeydown = function(event) {
   if (event.keyCode == 38) {
      moveup();
   } else if (event.keyCode == 40) {
	   movedown();
   } else if (event.keyCode == 37) {
	   moveleft();
   } else if (event.keyCode == 39) {
	   moveright();
   }
}

window.onkeyup = function(event) {
	stopMove();
}

function moveup() {
    gamePiece.speedY -= 1; 
}

function movedown() {
    gamePiece.speedY += 1; 
}

function moveleft() {
	gamePiece.image.src = "images/smiley-left.png";
    gamePiece.speedX -= 1;
}

function moveright() {
	gamePiece.image.src = "images/smiley-right.png";
    gamePiece.speedX += 1;
}

function stopMove() {
    gamePiece.speedX = 0;
    gamePiece.speedY = 0; 
}

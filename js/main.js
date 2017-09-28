var Game = (function(){
	function Game(w,h){
		this.canvas = document.querySelector("#window");
		this.ctx = this.canvas.getContext('2d');
		
		if(w || h){
			if(w){
				this.canvas.width=w;
			}
			if(h){
				this.canvas.height=h;
			}	
		}
		
		this.configuration = {
			speed: 10,
			gravity: 10,
			score: 0,
			grid:32
		};

		/*
		* Each block will have a martrix with a shape. Each shape with have either 0 or a number. Each number is
		* double digit where first digit represents the color of block and second digit reporesents the actual
		* value in the block.
		*/

		this.blocks = {
			T: [
				[00,00,00],
				[12,23,52],
				[00,65,00]
			],
			Z: [
				[36,12,00],
				[00,71,33],
				[00,00,00]
			]
		};
	};

	Game.prototype.draw = function(){}
	Game.prototype.update = function(delta){}
	Game.prototype.keyPressed = function(key){}
	Game.prototype.keyReleased = function(key){}

	return Game;

}());

var Window = (function(){
	var game = new Game();

	var lastTime = (new Date()).getTime();
    var currentTime = 0;
    var delta = 0;

	function init(){

		var width = game.canvas.width, height = game.canvas.height, ctx = game.ctx;

		document.addEventListener('keyup', function(e){
			game.keyReleased(e.keyCode);
		}, false);
		document.addEventListener('keyrelease', function(e){
			game.keyPressed(e.keyCode);
		}, false)
		ctx.strokeStyle = "#444";
		for(var i=0;i<width;i+=game.configuration.grid){
			ctx.moveTo(i,0);
			ctx.lineTo(i,height);
			ctx.stroke();
		}
		for(var i=0;i<height;i+=game.configuration.grid){
			ctx.moveTo(0,i);
			ctx.lineTo(width,i);
			ctx.stroke();
		}
	}

	function run(){
		window.requestAnimationFrame(run);
		currentTime = (new Date()).getTime();
		delta = (currentTime - lastTime) / 1000;
		game.ctx.clearRect(0,0,game.canvas.width,game.canvas.height);
		game.update(delta);
		game.draw();
		lastTime = currentTime;
	}

	return {
		init: init,
		run: run
	};

}());


Window.init();
// Window.run();
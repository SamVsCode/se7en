var MatrixMap = (function() {
    // function randomNumberGenerator(){}

    function createMatrix(w, h) {
        var matrix = [];
        while (h--) {
            matrix.push(new Array[w].fill(0));
        }
        return matrix;
    }

    function rotateMatrix() {}

    function mergeMatrix() {}

    function drawMatrix(matrix, offset, ctx) {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] !== 0) {
                    ctx.fillStyle = "#ff0000";
                    ctx.fillRect((i + offset.x) * 32, (j + offset.y) * 32, 30, 30);
                }
            }
        }

    }

    return {
        createMatrix: createMatrix,
        rotateMatrix: rotateMatrix,
        mergeMatrix: mergeMatrix,
        drawMatrix: drawMatrix
    };
}());

var Player = (function() {
    return {
        pos: { x: 0, y: 0 },
        block: null,
        score: 0
    };
}());

var Blocks = (function() {
    /*
     * Each block will have a martrix with a shape. Each shape with have either 0 or a number. Each number is
     * double digit where first digit represents the color of block and second digit reporesents the actual
     * value in the block.
     */

    return {
        T: [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        Z: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        I: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ],
        L: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        J: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ],
        O: [
            [0, 0],
            [0, 0]
        ],
        S: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    };
}());

var Game = (function() {
    function Game(w, h) {
        this.canvas = document.querySelector("#window");
        this.bgCanvas = document.querySelector("#background");
        this.ctx = this.canvas.getContext('2d');
        this.bgctx = this.bgCanvas.getContext('2d');
        this.dropCounter = 0;

        if (w || h) {
            if (w) {
                this.canvas.width = w;
                this.bgCanvas.width = w;
            }
            if (h) {
                this.canvas.height = h;
                this.bgCanvas.height = h;
            }
        }

        this.configuration = {
            speed: 1,
            gravity: 10,
            score: 0,
            grid: 32
        };
    }

    Game.prototype.draw = function() {
        MatrixMap.drawMatrix(Blocks.T, Player.pos, this.ctx);
    }
    Game.prototype.update = function(delta) {
        this.dropCounter += delta;
        if (this.dropCounter > this.configuration.speed) {

            this.dropCounter = 0;
        }
    }
    Game.prototype.keyPressed = function(key) {}
    Game.prototype.keyReleased = function(key) {}

    return Game;

}());

var Window = (function() {
    var game = new Game();

    var lastTime = (new Date()).getTime();
    var currentTime = 0;
    var delta = 0;

    function init() {

        var width = game.bgCanvas.width,
            height = game.bgCanvas.height,
            bgctx = game.bgctx;

        document.addEventListener('keyup', function(e) {
            game.keyReleased(e.keyCode);
        }, false);
        document.addEventListener('keyrelease', function(e) {
            game.keyPressed(e.keyCode);
        }, false)
        bgctx.strokeStyle = "#443266";
        for (var i = 0; i <= width; i += game.configuration.grid) {
            bgctx.moveTo(i, 0);
            bgctx.lineTo(i, height);
            bgctx.stroke();
        }
        for (var i = 0; i <= height; i += game.configuration.grid) {
            bgctx.moveTo(0, i);
            bgctx.lineTo(width, i);
            bgctx.stroke();
        }
    }

    function run() {
        // window.requestAnimationFrame(run);
        currentTime = (new Date()).getTime();
        delta = (currentTime - lastTime) / 1000;
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
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
Window.run();
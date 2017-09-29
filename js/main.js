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
            [1, 1],
            [1, 1]
        ],
        S: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    };
}());

var MatrixMap = (function() {
    var blockKeys = [];
    for (var key in Blocks) {
        if (key !== "colors")
            blockKeys.push(key);
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function randomBlockGenerator() {
        var b = blockKeys[getRandomNumber(0, blockKeys.length - 1)];
        return b;
    }

    function mapCollision() {
        var m = Player.brick;
        var arena = Window.game.arena;
        var o = Player.pos;
        for (var y = 0; y < m.length; ++y) {
            for (var x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (arena[y + o.y] &&
                        arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function createMatrix(w, h) {
        var matrix = [];
        while (h--) {
            matrix.push((new Array(w)).fill(0));
        }
        return matrix;
    }

    function swap(x1, y1, x2, y2, m) {
        var temp = m[x1][y1];
        m[x1][y1] = m[x2][y2];
        m[x2][y2] = temp;
    }

    function rotateMatrix() {
        var matrixSize = Window.game.Player.brick.length;
        var m = Window.game.Player.brick;
        var count = 0;
        var level = 0;
        var last = matrixSize - 1;
        var totalLevels = matrixSize / 2;

        while (level < totalLevels) {
            for (var i = level; i < last; i++) {
                swap(level, i, i, last, m);
                swap(level, i, last, last - i + level, m);
                swap(level, i, last - i + level, level, m);
            }
            ++level;
            --last;
        }
    }

    function mergeMatrix() {
        Window.game.Player.brick.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    Window.game.arena[y + Window.game.Player.pos.y][x + Window.game.Player.pos.x] = value;
                }
            });
        });
    }

    function drawMatrix(matrix, offset, ctx) {
        for (var j = 0; j < matrix.length; j++) {
            for (var i = 0; i < matrix[j].length; i++) {
                if (matrix[j][i] !== 0) {
                    ctx.fillStyle = "#ff0000";
                    ctx.fillRect((i + offset.x) * 32, (j + offset.y) * 32, 30, 30);
                }
            }
        }

    }

    return {
        getRandomNumber: getRandomNumber,
        randomBlockGenerator: randomBlockGenerator,
        createMatrix: createMatrix,
        rotateMatrix: rotateMatrix,
        mergeMatrix: mergeMatrix,
        drawMatrix: drawMatrix,
        mapCollision: mapCollision
    };
}());

var Player = (function() {
    var pos = {
        x: 0,
        y: 0
    };
    var brick = Blocks[MatrixMap.randomBlockGenerator()];

    function drop() {
        Player.pos.y++;
        if (MatrixMap.mapCollision()) {
            Player.pos.y--;
            MatrixMap.mergeMatrix();
            Player.brick = nextBrick();
        }
    }

    function move(i) {
        Window.game.Player.pos.x += i;
    }

    function nextBrick() {
        Player.pos.y = 0;
        return Blocks[MatrixMap.randomBlockGenerator()];
    }
    return {
        drop: drop,
        pos: pos,
        block: null,
        score: 0,
        nextBrick: nextBrick,
        move: move,
        brick: brick
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
            speed: 0.3,
            gravity: 0.30,
            score: 0,
            grid: 32
        };
        this.Player = Player;
        this.arena = MatrixMap.createMatrix(Math.floor(this.canvas.width / this.configuration.grid), Math.floor(this.canvas.height / this.configuration.grid));
    }

    Game.prototype.draw = function() {
        MatrixMap.drawMatrix(this.Player.brick, this.Player.pos, this.ctx);
    }
    Game.prototype.update = function(delta) {
        this.dropCounter += delta;
        if (this.dropCounter > this.configuration.speed) {
            Player.drop();
            this.dropCounter = 0;
        }
        MatrixMap.drawMatrix(this.arena, { x: 0, y: 0 }, this.ctx);
    }
    Game.prototype.keyPressed = function(key) {
        if (key === 37) {
            Window.game.Player.move(-1);
        }
        if (key === 39) {
            Window.game.Player.move(1);
        }
        if (key === 38) {
            MatrixMap.rotateMatrix();
        }
        // if (key === 40) {
        //     console.log(Window.game.Player.pos.y, Window.game.arena.length);
        //     if (Window.game.Player.pos.y < Window.game.arena.length - 3 && !MatrixMap.mapCollision())
        //         Window.game.Player.pos.y++;
        // }
    }
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
        document.addEventListener('keydown', function(e) {
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
        window.requestAnimationFrame(run);
        currentTime = (new Date()).getTime();
        delta = (currentTime - lastTime) / 1000;
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.update(delta);
        game.draw();
        lastTime = currentTime;
    }

    return {
        init: init,
        run: run,
        game: game
    };

}());


Window.init();
Window.run();
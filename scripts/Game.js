import Enemy from "./Enemy.js";
import Player from "./Player.js";

export default class Game {
    constructor() {
        this.score = 0;
        this.gameOver = false;
        this.player = new Player(this);
        this.enemies = [new Enemy(this)];
        this.gamePaused = false;

        // Set canvas size to match the screen
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();

        // Handle window resize
        window.addEventListener("resize", () => this.resizeCanvas());

        this.tick();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    playerDie() {
        alert("You died! Score: " + this.score);
    }

    checkPlayerTouchingEnemies() {
        for (let enemy of this.enemies) {
            let dist = this.player.position
                .copy()
                .subtract(enemy.position)
                .magnitude();

            if (dist < this.player.radius + enemy.radius) {
                this.gameOver = true;
            }
        }
    }

    tick() {
        const before = performance.now();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.tick(this.ctx);

        if (!this.gamePaused) {
            this.score += 1;

            if (Math.random() < 0.01) {
                this.enemies.push(new Enemy(this));
            }
        }

        for (let enemy of this.enemies)
            enemy.tick(this.ctx);

        this.checkPlayerTouchingEnemies();

        const after = performance.now();
        const waitTime = Math.max(0, 1000 / 60 - (after - before));

        if (this.gameOver) return this.playerDie();
        setTimeout(() => this.tick(), waitTime); // Fix: Use `() => this.tick()` to correctly reference the function
    }
}

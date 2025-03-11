import Enemy from "./Enemy.js";
import Collision from "./library/Collision.js";
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

    this.timeTillSwap = 100;
    this.isSwapped = false;
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
      let dif = this.player.position
      .copy()
      .subtract(enemy.position)

      if (dif.magnitude() < this.player.radius + enemy.radius) {
        this.player.health -= 10;
        this.player.position.add(dif.scale(0.5));
        this.player.velocity.scale(0);
        if (this.player.health <= 0) 
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

      if (Math.random() < 0.00001 * this.score) {
        this.enemies.push(new Enemy(this));
      }
    }

    for (let enemy of this.enemies) enemy.tick(this.ctx);

    this.checkPlayerTouchingEnemies();

    const after = performance.now();
    if (!this.gamePaused)
      this.timeTillSwap -= after - before;
    if (this.timeTillSwap < 0) {
      this.isSwapped = !this.isSwapped;
      if (this.isSwapped)
        this.timeTillSwap = 30;
      else
        this.timeTillSwap = 100;
    }

    document.getElementById("info").innerHTML = `
    Time till swap: ${Math.round(this.timeTillSwap)} <br>
    Score: ${this.score} <br>
    Health: ${this.player.health}
    `;

    const waitTime = Math.max(0, 1000 / 60 - (after - before));

    if (this.gameOver) return this.playerDie();
    setTimeout(() => this.tick(), waitTime); // Fix: Use `() => this.tick()` to correctly reference the function
  }
}

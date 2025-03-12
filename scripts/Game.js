import Enemy from "./Enemy.js";
import Keyboard from "./library/Keyboard.js";
import Node from "./library/Node.js";
import Player from "./Player.js";
import SpellHandler from "./SpellHandler.js";

export default class Game extends Node {
  constructor() {
    super();
    this.score = 0;
    this.gameOver = false;
    this.player = new Player(this);
    this.enemies = [new Enemy(this)];
    this.gamePaused = false;

    // Set canvas size to match the screen
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    this.lastTickTime = 0;

    // Handle window resize
    window.addEventListener("resize", () => this.resizeCanvas());

    
    this.timeTillSwap = 100;
    this.isSwapped = false;
    
    // Remaining time for each spell in ms
    this.spellHandler = new SpellHandler(this);

    this.tick();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  playerDie() {
    alert("You died! Score: " + this.score);
  }

  tick() {
    const before = performance.now();
    const dt = before - this.lastTickTime;
    this.spellHandler.dt = dt;
    this.spellHandler.update();
    
    this.lastTickTime = before;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.gamePaused) {
      this.score += 1;

      if (Math.random() < 0.00001 * this.score) {
        this.enemies.push(new Enemy(this));
      }
    }


    document.getElementById("info").innerHTML = `
    Score: ${this.score} <br>
    `;

    super.tick(this.ctx); // call all those children stuff

    const after = performance.now();
    if (!this.gamePaused) this.timeTillSwap -= after - before;
    if (this.timeTillSwap < 0) {
      this.isSwapped = !this.isSwapped;
      if (this.isSwapped) this.timeTillSwap = 35;
      else this.timeTillSwap = 100;
    }

    const waitTime = Math.max(0, 1000 / 60 - (after - before));

    if (this.gameOver) return this.playerDie();
    setTimeout(() => this.tick(), waitTime); // Fix: Use `() => this.tick()` to correctly reference the function
  }
}

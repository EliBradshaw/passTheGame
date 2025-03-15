import Cheese from "./Cheese.js";
import Enemy from "./Enemy.js";
import Fish from "./Fish.js";
import Node from "./library/Node.js";
import Player from "./Player.js";
import PonyUp from "./PonyUp.js";
import SpellHandler from "./SpellHandler.js";

export default class Game extends Node {
  static scale = 4;

  constructor() {
    super();
    this.score = 0;
    this.gameOver = false;
    this.player = new Player(this);
    this.enemies = [new Enemy(this)];
    this.ponyUpAvailable = null;
    this.gamePaused = false;
    this.cheese = 0;

    // Set canvas size to match the screen
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas();

    this.lastTickTime = 0;

    // Handle window resize
    window.addEventListener("resize", () => this.resizeCanvas());

    this.timeTillSwap = 100;
    this.isSwapped = false;

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
    this.player.spellHandler.dt = dt;

    this.lastTickTime = before;

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.gamePaused) {
      this.score += 1;

      if (Math.random() < 0.00001 * Math.min(this.score, 1000)) {
        if (Math.random() < 1) this.enemies.push(new Fish(this));
        else this.enemies.push(new Enemy(this));
      }

      if (Math.random() < 0.005) {
        console.log("cheese");
        this.addChild(new Cheese(this));
      }

      if (
        Math.random() < 0.002 &&
        !this.ponyUpAvailable &&
        !this.player.ponyied
      ) {
        this.ponyUpAvailable = new PonyUp(this);
        // probably a better way to do this but I don't care lol
        this.ponyUpAvailable.position.x =
          this.canvas.width * 0.24 * Math.random();
        this.ponyUpAvailable.position.y =
          this.canvas.height * 0.22 * Math.random();
      }
    }

    document.getElementById("info").innerHTML = `
    Score: ${this.score} <br>
    Cheese: ${this.cheese} <br>
    `;

    this.ctx.save();
    this.ctx.scale(4, 4);
    super.tick(this.ctx); // call all those children stuff
    this.ctx.restore();
    const after = performance.now();
    if (!this.gamePaused) this.timeTillSwap -= after - before;
    if (this.timeTillSwap < 0) {
      this.isSwapped = !this.isSwapped;
      if (this.isSwapped) this.timeTillSwap = 35;
      else this.timeTillSwap = 100;
    }

    const waitTime = Math.max(0, 1000 / 60 - (after - before));

    if (this.player.health <= 0) return this.playerDie();

    if (this.gameOver) return this.playerDie();
    setTimeout(() => this.tick(), waitTime); // Fix: Use `() => this.tick()` to correctly reference the function
  }
}

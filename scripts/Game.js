import Enemy from "./Enemy.js";
import Keyboard from "./library/Keyboard.js";
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

    this.lastTickTime = 0;

    // Handle window resize
    window.addEventListener("resize", () => this.resizeCanvas());

    this.tick();

    this.timeTillSwap = 100;
    this.isSwapped = false;

    // Remaining time for each spell in ms
    this.freezeSpellTimer = 0;
    this.pushSpellTimer = 0;
    this.speedSpellTimer = 0;
    this.spellCooldown = 5000; // Cooldown for each spell in ms
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
      let dif = this.player.position.copy().subtract(enemy.position);

      if (dif.magnitude() < this.player.radius + enemy.radius) {
        this.player.health -= 10;
        this.player.position.add(dif.scale(0.5));
        this.player.velocity.scale(0);
        if (this.player.health <= 0) this.gameOver = true;
      }
    }
  }

  tick() {
    const before = performance.now();
    const dt = before - this.lastTickTime;
    this.lastTickTime = before;

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

    // Freeze spell
    if (
      Keyboard.isDown("1") &&
      this.freezeSpellTimer <= 0 &&
      this.spellCooldown <= 0
    ) {
      this.freezeSpellTimer = 10000; // set countdown
      this.spellCooldown = 5000;
    }

    if (this.freezeSpellTimer > 0) {
      for (let enemy of this.enemies) {
        enemy.speed = 0.25;
      }

      this.freezeSpellTimer -= dt;
    } else {
      for (let enemy of this.enemies) {
        enemy.speed = 0.7;
      }
    }

    // Push spell
    if (
      Keyboard.isDown("2") &&
      this.pushSpellTimer <= 0 &&
      this.spellCooldown <= 0
    ) {
      this.spellCooldown = 5000;
      const pushForce = 50;

      for (let enemy of this.enemies) {
        let dir = enemy.position.copy().subtract(this.player.position);
        if (dir.magnitude() != 0) {
          dir.normalize();
          enemy.position.add(dir.scale(pushForce));
        }
      }
      this.pushSpellTimer = 5000; // set countdown
    }
    if (this.pushSpellTimer > 0) {
      this.pushSpellTimer -= dt;
    }

    // Player speed spell
    if (
      Keyboard.isDown("3") &&
      this.speedSpellTimer <= 0 &&
      this.spellCooldown <= 0
    ) {
      this.speedSpellTimer = 5000;
      this.spellCooldown = 5000;
      this.player.speed = this.player.defaultSpeed * 2;
    }
    if (this.speedSpellTimer > 0) {
      this.speedSpellTimer -= dt;
    } else {
      this.player.speed = this.player.defaultSpeed;
    }

    if (this.spellCooldown > 0) {
      this.spellCooldown -= dt;
    }

    const after = performance.now();
    if (!this.gamePaused) this.timeTillSwap -= after - before;
    if (this.timeTillSwap < 0) {
      this.isSwapped = !this.isSwapped;
      if (this.isSwapped) this.timeTillSwap = 30;
      else this.timeTillSwap = 100;
    }

    document.getElementById("info").innerHTML = `
    Time till swap: ${Math.round(this.timeTillSwap)} <br>
    Score: ${this.score} <br>
    Health: ${this.player.health} <br>
    Freeze spell (1): ${Math.round(this.freezeSpellTimer / 1000)} <br>
    Push spell (2): ${Math.round(this.pushSpellTimer / 1000)} <br>
    Speed spell (3): ${Math.round(this.speedSpellTimer / 1000)} <br>
    Spell cooldown: ${Math.round(this.spellCooldown / 1000)} <br>
    `;

    const waitTime = Math.max(0, 1000 / 60 - (after - before));

    if (this.gameOver) return this.playerDie();
    setTimeout(() => this.tick(), waitTime); // Fix: Use `() => this.tick()` to correctly reference the function
  }
}

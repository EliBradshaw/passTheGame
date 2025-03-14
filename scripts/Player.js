import Lazer from "./Lazer.js";
import Keyboard from "./library/Keyboard.js";
import Node from "./library/Node.js";
import Sprite from "./library/Sprite.js";
import Vector from "./library/Vector.js";

export default class Player extends Node {
  constructor(game) {
    super(game);
    this.game = game;
    this.velocity = new Vector(1, 1);
    this.radius = 8;
    this.defaultSpeed = 0.04;
    this.speed = this.defaultSpeed;

    this.health = 100;

    this.lazer = new Lazer(this);
    this.sprite = new Sprite("../assets/player.png", this);
  }

  checkTouchingEnemies() {
    for (let enemy of this.game.enemies) {
      let dif = this.position.copy().subtract(enemy.position);

      if (dif.magnitude() < this.radius + enemy.radius) {
        this.health -= 10;
        this.position.add(dif.scale(0.5));
        this.velocity.scale(0);
        this.velocity.add(dif.scale(0.1));
        if (this.health <= 0) this.game.gameOver = true;
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = this.game.isSwapped ? "purple" : "orange";
    let radius = this.game.timeTillSwap / 15 + 1;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y - 20, radius, 0, 2 * Math.PI);
    ctx.fill();

    let width = this.health / 3;
    ctx.fillStyle = "green";
    ctx.fillRect(this.position.x - width / 2, this.position.y - 13, width, 2);
  }

  update() {
    this.velocity.scale(0.98);
    let newVelocity = new Vector();
    if (Keyboard.isDown("w")) newVelocity.y -= 1;
    if (Keyboard.isDown("s")) newVelocity.y += 1;
    if (Keyboard.isDown("a")) newVelocity.x -= 1;
    if (Keyboard.isDown("d")) newVelocity.x += 1;

    this.game.gamePaused =
      newVelocity.magnitude() == 0 && !this.lazer.lazerActive;
    newVelocity.normalize().scale(this.speed);
    this.velocity.add(newVelocity);
    this.position.add(this.velocity);

    this.position.x = Math.min(
      Math.max(this.position.x, this.radius),
      this.game.canvas.width - this.radius
    );
    this.position.y = Math.min(
      Math.max(this.position.y, this.radius),
      this.game.canvas.height - this.radius
    );

    this.checkTouchingEnemies();
  }
}

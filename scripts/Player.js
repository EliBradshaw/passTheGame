import Keyboard from "./library/Keyboard.js";
import Mouse from "./library/Mouse.js";
import Vector from "./library/Vector.js";

export default class {
  constructor(game) {
    this.game = game;
    this.position = new Vector(100, 100);
    this.velocity = new Vector(1, 1);
    this.radius = 10;
    this.speed = 0.04;
    this.lazerRange = 50;
    this.lazerEnd = new Vector();
    this.lazerActive = false;
    this.image = new Image();
    this.image.src = "../assets/player.png";
  }

  tick(ctx) {
    this.update();
    this.updateLazer();

    this.render(ctx);
    this.renderLazer(ctx);
  }

  render(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, 7, 15);
  }

  update() {
    this.velocity.scale(0.98);
    let newVelocity = new Vector();
    if (Keyboard.isDown("w")) newVelocity.y -= 1;
    if (Keyboard.isDown("s")) newVelocity.y += 1;
    if (Keyboard.isDown("a")) newVelocity.x -= 1;
    if (Keyboard.isDown("d")) newVelocity.x += 1;

    this.game.gamePaused = !(newVelocity.magnitude() > 0);
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
  }

  updateLazer() {
    if (Mouse.isDown("left")) {
      this.lazerActive = true;
    } else {
      this.lazerActive = false;
      return;
    }

    let direction = new Vector(
      Mouse.getMouse().x - this.position.x,
      Mouse.getMouse().y - this.position.y
    );

    direction.normalize().scale(this.lazerRange);

    this.lazerEnd = new Vector(
      this.position.x + direction.x,
      this.position.y + direction.y
    );
  }

  renderLazer(ctx) {
    if (!this.lazerActive) return;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.lazerEnd.x, this.lazerEnd.y);
    ctx.stroke();
  }
}

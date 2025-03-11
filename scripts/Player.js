import Lazer from "./Lazer.js";
import Keyboard from "./library/Keyboard.js";
import Mouse from "./library/Mouse.js";
import Vector from "./library/Vector.js";

export default class {
  constructor(game) {
    this.game = game;
    this.position = new Vector(100, 100);
    this.velocity = new Vector(1, 1);
    this.radius = 8;
    this.defaultSpeed = 0.04;
    this.speed = this.defaultSpeed;

    this.health = 100;

    this.image = new Image();
    this.image.src = "../assets/player.png";

    this.lazer = new Lazer(this);
  }

  tick(ctx) {
    this.lazer.tick(ctx);

    this.update();
    this.render(ctx);
  }

  render(ctx) {
    ctx.drawImage(this.image, this.position.x - 3, this.position.y - 8, 7, 15);
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
  }
}

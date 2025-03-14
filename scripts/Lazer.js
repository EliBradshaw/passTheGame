import Game from "./Game.js";
import Collision from "./library/Collision.js";
import Mouse from "./library/Mouse.js";
import Node from "./library/Node.js";
import Vector from "./library/Vector.js";

export default class Lazer extends Node {
  constructor(player) {
    super(player);
    this.game = player.game;
    this.player = player;
    this.lazerActive = false;
    this.lazerEnd = new Vector();
    this.lazerRange = 40;
  }

  centeredPlayerPosition() {
    return this.player.position.copy().add(new Vector(0, 0)); // Lazer centering, if needed
  }

  update() {
    this.lazerActive = false;
    if (!Mouse.isDown("left")) return;
    this.lazerActive = true;

    let direction = Mouse.getMouse()
      .copy()
      .scale(1 / Game.scale)
      .subtract(this.centeredPlayerPosition())
      .normalize()
      .scale(this.lazerRange);

    this.lazerEnd = this.centeredPlayerPosition().copy().add(direction);

    for (let enemy of this.game.enemies) {
      let emergency = 0;
      while (
        Collision.lineIntersectsCircle(
          this.centeredPlayerPosition(),
          this.lazerEnd,
          enemy.position,
          enemy.radius
        )
      ) {
        enemy.position.add(direction.scale(0.1));
        if (emergency++ > 100) break;
      }
      if (emergency && this.game.isSwapped)
        // Also useful to check if it ever collided
        this.game.score += 1000;
    }
  }

  render(ctx) {
    if (!this.lazerActive) return;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      this.centeredPlayerPosition().x,
      this.centeredPlayerPosition().y
    );
    ctx.lineTo(this.lazerEnd.x, this.lazerEnd.y);
    ctx.stroke();
  }
}

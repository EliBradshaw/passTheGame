import Node from "./library/Node.js";
import Sprite from "./library/Sprite.js";
import Vector from "./library/Vector.js";

export default class Enemy extends Node {
  constructor(game) {
    super(game);
    this.game = game;
    let player = this.game.player;
    const spawnInPath = player.position
      .copy()
      .add(player.velocity.copy().normalize().scale(200));
    this.position = spawnInPath;
    this.velocity = new Vector();
    this.radius = 6;
    this.speed = 0.7;

    this.sprite = new Sprite(
      "../assets/enemy.png",
      this,
      null,
      false,
      12,
      9,
      2
    );
  }

  render(ctx) {
    this.sprite.frame = this.game.isSwapped ? 1 : 0;
  }

  update() {
    let player = this.game.player;
    if (this.game.gamePaused || player.camoed) return;

    // Predict player's future position
    let predictionTime = 30; // Adjust this to change how far ahead the enemy predicts
    let predictedPosition = player.position
      .copy()
      .add(player.velocity.copy().scale(predictionTime));

    // Update enemy velocity towards the predicted position
    this.velocity = predictedPosition
      .copy()
      .subtract(this.position)
      .normalize()
      .scale(this.speed);

    for (let enemy of this.game.enemies) {
      if (enemy !== this) {
        let dif = this.position.copy().subtract(enemy.position);
        if (dif.magnitude() < this.radius + enemy.radius) {
          this.position.add(dif.scale(0.2));
        }
      }
    }

    if (this.game.isSwapped) {
      this.velocity.scale(-0.8);
    }

    this.position.add(this.velocity);

    // Keep enemy within bounds
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

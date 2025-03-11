import Vector from "./library/Vector.js";

export default class {
  constructor(game) {
    this.game = game;
    let player = this.game.player;
    const spawnInPath = player.position
      .copy()
      .add(player.velocity.copy().normalize().scale(200));
    this.position = spawnInPath;
    this.velocity = new Vector();
    this.radius = 5;
  }

  tick(ctx) {
    this.update();
    this.render(ctx);
  }

  render(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    let player = this.game.player;
    if (this.game.gamePaused) return;

    // Predict player's future position
    let predictionTime = 30; // Adjust this to change how far ahead the enemy predicts
    let predictedPosition = player.position
      .copy()
      .add(player.velocity.copy().scale(predictionTime));

    // Update enemy velocity towards the predicted position
    this.velocity
      .scale(0) // reset velocity
      .add(predictedPosition)
      .subtract(this.position)
      .normalize();

    for (let enemy of this.game.enemies) {
      if (enemy !== this) {
        let dif = this.position.copy().subtract(enemy.position);
        if (dif.magnitude() < this.radius + enemy.radius) {
          this.position.add(dif.scale(0.5));
        }
      }
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

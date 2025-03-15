import Game from "./Game.js";
import Node from "./library/Node.js";
import Sprite from "./library/Sprite.js";

export default class Cheese extends Node {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    super(game);
    this.game = game;
    this.sprite = new Sprite("../assets/cheese.png", this);
    this.position.x = (Math.random() * this.game.canvas.width) / Game.scale;
    this.position.y = (Math.random() * this.game.canvas.height) / Game.scale;
  }

  update() {
    super.update();

    let dist = this.game.player.position
      .copy()
      .subtract(this.position)
      .magnitude();
    if (dist < 15) {
      this.orphanSelf();
      this.game.cheese += 0.5;
    }
  }
}

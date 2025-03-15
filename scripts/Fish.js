import Enemy from "./Enemy.js";
import Sprite from "./library/Sprite.js";

export default class Fish extends Enemy {
  constructor(game) {
    super(game);
    this.sprite.orphanSelf();
    this.sprite = new Sprite(
      "../assets/fish.png",
      this,
      null,
      false,
      16,
      16,
      2
    );
    this.fishExploding = false;
    this.fishExplode = new Sprite(
      "../assets/fish_explode.png",
      this,
      null,
      false,
      16,
      16,
      18
    );
    this.fishExplode.doDraw = false;
  }

  update() {
    super.update();
    if (this.fishExploding) {
      this.position.subtract(this.velocity);
      this.fishExplode.frame = this.fishExplode.frame + 1;
      if (this.fishExplode.frame > 10) {
        this.fishExplode.scale += 0.3;
      }
      if (this.fishExplode.frame > 18) {
        this.orphanSelf();
        let dist = this.game.player.position
          .copy()
          .subtract(this.position)
          .magnitude();
        if (dist < 30) {
          this.game.player.health -= 90;
        }
      }
    }
    let dist = this.game.player.position
      .copy()
      .subtract(this.position)
      .magnitude();
    if (dist < 15 && !this.game.player.camoed) {
      this.fishExploding = true;
      this.fishExplode.doDraw = true;
    }
  }
}

import Node from "./Node.js";
import Vector from "./Vector.js";

export default class Sprite extends Node {
  constructor(
    imagePath,
    parent,
    position = null,
    topLevel = false,
    frameWidth = null,
    frameHeight = null,
    frameCount = 1
  ) {
    super(parent, position, topLevel);

    this.offset = new Vector(0, 0);

    this.image = new Image();
    this.image.src = imagePath;

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.frame = 0;

    this.doDraw = true;

    this.width = frameWidth || 0;
    this.height = frameHeight || 0;
    this.scale = 1;
    this.flipX = false;

    this.image.onload = () => {
      this.width = frameWidth || this.image.width;
      this.height = frameHeight || this.image.height;
    };
  }

  render(ctx) {
    if (!this.image.complete || !this.doDraw) return;

    ctx.save();
    ctx.translate(this.gPosition.x, this.gPosition.y);

    if (this.flipX) {
      ctx.scale(-1, 1);
    }

    if (this.frameCount > 1) {
      const sx = this.frame * this.frameWidth;
      ctx.drawImage(
        this.image,
        sx,
        0,
        this.frameWidth,
        this.frameHeight,
        -this.frameWidth / 2,
        -this.frameHeight / 2,
        this.frameWidth,
        this.frameHeight
      );
    } else {
      ctx.drawImage(
        this.image,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }
    ctx.restore();
  }
}

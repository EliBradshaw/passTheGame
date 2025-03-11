export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize this vector to length 1.
   * @return {Vector} this, after being normalized
   */
  normalize() {
    const magnitude = this.magnitude();
    if (!magnitude) return this;
    this.x /= magnitude;
    this.y /= magnitude;
    return this;
  }

  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
}

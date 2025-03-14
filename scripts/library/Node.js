import Vector from "./Vector.js";

export default class Node {
  constructor(parent = null, position = new Vector(0, 0), topLevel = false) {
    this.parent = parent;
    this.position = position
      ? position.copy() // Use given position if provided
      : parent
      ? new Vector(0, 0) // Default position centers it on the parent
      : new Vector(0, 0); // Root nodes default to (0,0)
    this.children = [];
    this.topLevel = topLevel;

    if (parent) {
      this.parent.addChild(this);
    }
  }

  get gPosition() {
    if (this.topLevel || !this.parent) {
      return this.position;
    }
    return new Vector(
      this.parent.gPosition.x + this.position.x,
      this.parent.gPosition.y + this.position.y
    );
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  /** Effectively deletes it from the scene */
  orphanSelf(orphanOwnChildren = false) {
    let remainingNodes = [];
    for (let child of this.parent.children) {
      if (child !== this)
        remainingNodes.push(child);
    }
    this.parent.children = remainingNodes;
    this.parent = null;

    if (orphanOwnChildren) { // Just giving the option to recursively delete everything
      for (let child of this.children) {
        child.orphanSelf(true);
      }
    }

    return this;
  }

  tick(ctx) {
    for (let child of this.children) {
      child.tick(ctx);
    }

    this.render(ctx);
    this.update();
  }

  render(ctx) {}
  update() {}
}

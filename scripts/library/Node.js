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
      if (child !== this) remainingNodes.push(child);
    }
    this.parent.children = remainingNodes;
    this.parent = null;

    if (orphanOwnChildren) {
      // Just giving the option to recursively delete everything
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

  /** @param {CanvasRenderingContext2D} ctx */
  /*
  Turns out, the above comment is borderline useless. Why, you may ask? Because JavaScript is borderline useless when it comes to larger projects.
  tYpeScrIpT Is SO UseLEss nOw THat We HavE JSDoCs

  Nope, that is 100% false because guess what! JSDOSC IS COMPELTE UDDER GARBAGE. THE ABOVE LINE DOES ABSOLUTELY NOTHING BECAUSE GUESS WHAT?!?!?!?!?!?

  CHILD CLASSES. DONT. GET. THE. TYEPS. BECAYUSE JSDOCS IS USEELSS AND A BANDAID SOLUTION TO A PROBLEM THAT SHOULDn"T VEVEN EXIST

  THAT PROBLEM IS JAVASCRIPT. PLEASE FOR THE LOVE OF ALL THINGS GOOD GET RID OF THIS AWFUL LANGAUGE. WHOEVER THOUGHT IT WAS A GOOD IDEA WAS SERIOUSLYT MESSED UP IN THE EHAD


  A TODDLER COULDVE COME UP WITH A BETTER LANGUAGE. THIS IS PAIN. PLEASE SEND HELP. PELASE!!!!!!111111!!1!1


  Love,
  - jcurtis06
  */
  render(ctx) {}
  update() {}
}

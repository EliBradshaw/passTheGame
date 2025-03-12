import Vector from "./Vector.js";

export default class Node {
    constructor(parent) {
        this.parent = parent;
        this.children = [];
        if (parent)
            this.parent.addChild(this);
        this.position = new Vector();
        /** @type {Node[]} */
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    tick(ctx) {
        for (let child of this.children)
            child.tick(ctx);

        this.render(ctx);
        this.update();
    }

    render(ctx) {}
    update() {}
}

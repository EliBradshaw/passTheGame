import Node from "./library/Node.js";
import Sprite from "./library/Sprite.js";


export default class PonyUp extends Node {
    constructor(game) {
        super(game);
        this.game = game;
        this.sprite = new Sprite("../assets/pony.png", this);
    }

    update() {
        let dist = this.game.player.position.copy().subtract(this.position).magnitude();
        if (dist < 20) {
            this.game.player.activatePonyUp();
            this.orphanSelf();
            this.game.ponyUpAvailable = null;
        }
    }
}
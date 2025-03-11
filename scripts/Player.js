import Keyboard from "./library/Keyboard.js";
import Vector from "./library/Vector.js";

export default class {
    constructor(game) {
        this.game = game;
        this.position = new Vector(100, 100);
        this.velocity = new Vector(1, 1); // To make the enemy spawn easier
        this.radius = 10;
        this.speed = 0.04; // Not static so that it can be changed dynamically
    }

    tick(ctx) {
        this.update();
        this.render(ctx);
    }

    render(ctx) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        this.velocity.scale(0.98);
        let newVelocity = new Vector();
        if (Keyboard.isDown("w")) newVelocity.y -= 1;
        if (Keyboard.isDown("s")) newVelocity.y += 1;
        if (Keyboard.isDown("a")) newVelocity.x -= 1;
        if (Keyboard.isDown("d")) newVelocity.x += 1;

        this.game.gamePaused = !(newVelocity.magnitude() > 0)
        newVelocity.normalize().scale(this.speed);
        this.velocity.add(newVelocity);
        this.position.add(this.velocity);
        
        this.position.x = Math.min(Math.max(this.position.x, this.radius), this.game.canvas.width - this.radius);
        this.position.y = Math.min(Math.max(this.position.y, this.radius), this.game.canvas.height - this.radius);
    }
}
export default class Spell {
    constructor(name, cooldown, effect) {
        this.name = name;
        this.maxCooldown = cooldown;
        this.cooldown = 0;
        this.effect = effect;
    }

    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
        }
    }
}
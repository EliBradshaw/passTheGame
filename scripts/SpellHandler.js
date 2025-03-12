import Keyboard from "./library/Keyboard.js";
import Node from "./library/Node.js";

export default class SpellHandler extends Node {
    constructor(game) {
        super(game);
        this.game = game;
        this.freezeSpellTimer = 0;
        this.pushSpellTimer = 0;
        this.speedSpellTimer = 0;
        this.herculeanBuffTimer = 0;
        this.spellCooldown = 5000; // Cooldown for each spell in ms
        this.player = game.player;
        this.enemies = game.enemies;
        this.dt = 0;

        // TODO: Simplify further into simple objects and make it easier to change settings for each spell. Also dynamically showing cooldown above players head
    }

    canSpell(key) {
        return Keyboard.isDown(key) &&
            this.pushSpellTimer <= 0 &&
            this.spellCooldown <= 0;
    }

    pushSpell(dt) {
        if (this.canSpell("2")) {
            this.spellCooldown = 5000;
            const pushForce = 50;

            for (let enemy of this.enemies) {
                let dir = enemy.position.copy().subtract(this.player.position);
                if (dir.magnitude() != 0) {
                    dir.normalize();
                    enemy.position.add(dir.scale(pushForce));
                }
            }
            this.pushSpellTimer = 5000; // set countdown
        }
        if (this.pushSpellTimer > 0) {
            this.pushSpellTimer -= dt;
        }
    }

    freezeSpell(dt) {
        if (this.canSpell("1")) {
            this.freezeSpellTimer = 10000; // set countdown
            this.spellCooldown = 5000;
        }

        if (this.freezeSpellTimer > 0) {
            for (let enemy of this.enemies) {
                enemy.speed = 0.25;
            }

            this.freezeSpellTimer -= dt;
        } else {
            for (let enemy of this.enemies) {
                enemy.speed = 0.7;
            }
        }
    }

    speedSpell(dt) {
        if (this.canSpell("3")) {
            this.speedSpellTimer = 5000;
            this.spellCooldown = 5000;
            this.player.speed = this.player.defaultSpeed * 2;
        }
        if (this.speedSpellTimer > 0) {
            this.speedSpellTimer -= dt;
        } else {
            this.player.speed = this.player.defaultSpeed;
        }

        if (this.spellCooldown > 0) {
            this.spellCooldown -= dt;
        }
    }

    herculeanBuffSpell(dt) { // Long cooldown where you can use your spell but more speed and health
        if (this.canSpell("4")) {
            this.herculeanBuffTimer= 10000;
            this.spellCooldown = 10000;
            this.player.defaultSpeed *= 1.05;
            this.player.speed = this.player.defaultSpeed;
            this.player.health *= 1.05;
        }

        if (this.herculeanBuffTimer > 0) {
            this.herculeanBuffTimer -= dt;
        }

        if (this.spellCooldown > 0) {
            this.spellCooldown -= dt;
        }
    }

    update() {
        document.getElementById("info").innerHTML += `
        Freeze spell (1): ${Math.round(this.freezeSpellTimer / 1000)} <br>
        Push spell (2): ${Math.round(this.pushSpellTimer / 1000)} <br>
        Speed spell (3): ${Math.round(this.speedSpellTimer / 1000)} <br>
        Herculean buff spell (4): ${Math.round(this.spellCooldown / 1000)} <br>
        Spell cooldown: ${Math.round(this.spellCooldown / 1000)} <br>
        `;

        let dt = this.dt;
        if (this.game.gamePaused) dt = 0;
        this.speedSpell(dt);
        this.pushSpell(dt);
        this.freezeSpell(dt);
        this.herculeanBuffSpell(dt);
    }
}
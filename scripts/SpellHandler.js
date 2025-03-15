import Keyboard from "./library/Keyboard.js";
import Mouse from "./library/Mouse.js";
import Node from "./library/Node.js";
import Spell from "./Spell.js";

export default class SpellHandler extends Node {
  constructor(player) {
    super(player);
    this.game = player.game;
    this.freezeSpellTimer = 0;
    this.pushSpellTimer = 0;
    this.speedSpellTimer = 0;
    this.herculeanBuffTimer = 0;
    this.camoTimer = 0;
    this.spellCooldown = 5000; // Cooldown for each spell in ms
    this.player = player;

    this.spells = [
      new Spell("push", 5000, (dt) => this.pushSpell(dt)),
      new Spell("freeze", 5000, (dt) => this.freezeSpell(dt)),
      new Spell("speed", 5000, (dt) => this.speedSpell(dt)),
      new Spell("herculean buff", 10000, (dt) => this.herculeanBuffSpell(dt)),
      new Spell("camouflage", 5000, (dt) => this.camoflaugeSpell(dt)),
    ];
    this.currentSpell = this.spells[0];
    this.currentSpellIndex = 0;
    this.dt = 0;

    this.unpressed = true;

    // TODO: Simplify further into simple objects and make it easier to change settings for each spell. Also dynamically showing cooldown above players head
  }

  canSpell(timer) {
    return (
      Mouse.isDown("right") &&
      timer <= 0 &&
      this.spellCooldown <= 0 &&
      this.game.cheese >= 1
    );
  }

  pushSpell(dt) {
    if (this.canSpell(this.pushSpellTimer)) {
      this.game.cheese -= 1;
      this.spellCooldown = 5000;
      const pushForce = 50;

      for (let enemy of this.game.enemies) {
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
    if (this.canSpell(this.freezeSpellTimer)) {
      this.game.cheese -= 1;
      this.freezeSpellTimer = 10000; // set countdown
      this.spellCooldown = 5000;
    }

    if (this.freezeSpellTimer > 0) {
      for (let enemy of this.game.enemies) {
        enemy.speed = 0.25;
      }

      this.freezeSpellTimer -= dt;
    } else {
      for (let enemy of this.game.enemies) {
        enemy.speed = 0.7;
      }
    }
  }

  speedSpell(dt) {
    if (this.canSpell(this.speedSpellTimer)) {
      this.game.cheese -= 1;
      this.speedSpellTimer = 5000;
      this.spellCooldown = 5000;
      this.player.speed = this.player.defaultSpeed * 2;
    }
    if (this.speedSpellTimer > 0) {
      this.speedSpellTimer -= dt;
    } else {
      this.player.speed = this.player.defaultSpeed;
    }
  }

  herculeanBuffSpell(dt) {
    // Long cooldown where you can use your spell but more speed and health
    if (this.canSpell(this.herculeanBuffTimer)) {
      this.game.cheese -= 1;
      this.herculeanBuffTimer = 10000;
      this.spellCooldown = 10000;
      this.player.defaultSpeed *= 1.05;
      this.player.speed = this.player.defaultSpeed;
      this.player.health *= 1.05;
    }

    if (this.herculeanBuffTimer > 0) {
      this.herculeanBuffTimer -= dt;
    }
  }

  camoflaugeSpell(dt) {
    if (this.canSpell(this.camoTimer)) {
      this.game.cheese -= 1;
      this.camoTimer = 5000;
      this.spellCooldown = 5000;
      this.game.player.activateCamo();
    }

    if (this.camoTimer > 0) {
      this.camoTimer -= dt;
    } else {
      this.game.player.deactivateCamo();
    }
  }

  update() {
    if (Mouse.isDown("wheel_up")) {
      if (this.unpressed) {
        this.currentSpellIndex--;
        if (this.currentSpellIndex < 0)
          this.currentSpellIndex = this.spells.length - 1;
        this.currentSpell = this.spells[this.currentSpellIndex];
      }
      this.unpressed = false;
    } else if (Mouse.isDown("wheel_down")) {
      if (this.unpressed) {
        this.currentSpellIndex++;
        if (this.currentSpellIndex >= this.spells.length)
          this.currentSpellIndex = 0;
        this.currentSpell = this.spells[this.currentSpellIndex];
      }
      this.unpressed = false;
    } else {
      this.unpressed = true;
    }

    let dt = this.dt;
    if (this.game.gamePaused) dt = 0;

    this.currentSpell.effect(dt);
    if (this.spellCooldown > 0) {
      this.spellCooldown -= dt;
    }

    Mouse._buttons.wheel_up = false;
    Mouse._buttons.wheel_down = false;
  }

  render(ctx) {
    ctx.fillStyle = "blacks";
    ctx.font = "4px Arial";
    let text = "< (1) " + this.currentSpell.name + " (2) >";
    ctx.fillText(
      text,
      this.gPosition.x - text.length / 1.25,
      this.gPosition.y + 13
    );
  }
}

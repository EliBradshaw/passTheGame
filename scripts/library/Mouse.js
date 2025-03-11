import Vector from "./Vector.js";

export default class Mouse {
  static _mouse = new Vector(0, 0);
  static _buttons = { left: false, right: false };

  static _init = (() => {
    document.addEventListener("mousemove", (event) => {
      Mouse._mouse.x = event.clientX;
      Mouse._mouse.y = event.clientY;
    });

    document.addEventListener("mousedown", (event) => {
      if (event.button == 0) Mouse._buttons.left = true;
      if (event.button == 2) Mouse._buttons.right = true;
    });

    document.addEventListener("mouseup", (event) => {
      if (event.button == 0) Mouse._buttons.left = false;
      if (event.button == 2) Mouse._buttons.right = false;
    });

    document.addEventListener("contextmenu", (event) => event.preventDefault());
  })();

  static getMouse() {
    return Mouse._mouse;
  }

  static isDown(button) {
    return Mouse._buttons[button] || false;
  }
}

export default class Keyboard {
    static _keys = {};
    static _init = (() => { // runs on first import of this keyboard class
        document.addEventListener("keydown", (event) => {
            Keyboard._keys[event.key.toLowerCase()] = true;
        });
        document.addEventListener("keyup", (event) => {
            Keyboard._keys[event.key.toLowerCase()] = false;
        });
    })();
    static isDown(key) {
        return Keyboard._keys[key.toLowerCase()];
    }
}
import Vector from "./Vector.js";

export default class Collision {

  static lineIntersectsCircle(from, to, circlePos, radius) {
    function dist(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }
    let gradient = (from.y - to.y) / (from.x - to.x);

    // x = (cy + cx -ly) / 2m
    let px = (gradient * circlePos.y - gradient * from.y + circlePos.x + from.x * gradient * gradient) /
        (gradient ** 2 + 1);
    let py = (px - from.x) * gradient + from.y;

    let lDist = dist(from, to);
    if (dist(new Vector(px, py), from) > lDist) {
        px = to.x;
        py = to.y
    }

    if (dist(new Vector(px, py), to) > lDist) {
        px = from.x;
        py = from.y
    }

    return dist(circlePos, new Vector(px, py)) <= radius;
}
}

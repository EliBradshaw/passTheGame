export default class Collision {
  static lineIntersectsCircle(lineStart, lineEnd, circleCenter, circleRadius) {
    let ac = circleCenter.copy().subtract(lineStart);
    let ab = lineEnd.copy().subtract(lineStart);

    let abLength = ab.magnitude();
    if (abLength === 0) return false; // Avoid division by zero

    let abNormalized = ab.copy().scale(1 / abLength);
    let projectionLength = Math.max(
      0,
      Math.min(abLength, ac.dot(abNormalized))
    );

    let closestPoint = lineStart
      .copy()
      .add(abNormalized.scale(projectionLength));

    let distanceToCircle = closestPoint.subtract(circleCenter).magnitude();
    return distanceToCircle <= circleRadius;
  }
}

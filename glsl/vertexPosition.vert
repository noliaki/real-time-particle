transformed = rotateVector(tQuat, transformed);
transformed *= mix(
  ((noise + 1.0) * 0.5) * 20.0 + 1.0,
  eColorMap.a * 2.0 * endScaleRate,
  tProgress
);

transformed.x += mix(
  (sPosMap.r) * width + transformOffset * sPosMap.a,
  (fract(aIndex * frag) * 2.0 - 1.0) * size,
  tProgress
);

transformed.y += mix(
  (sPosMap.g) * width + transformOffset * ePosMap.a,
  (floor(aIndex * frag) * frag * 2.0 - 1.0) * size * uImageRate,
  tProgress
);

transformed.z += mix(
  (sPosMap.b) * width + transformOffset * sPosMap.x,
  0.0,
  tProgress
);

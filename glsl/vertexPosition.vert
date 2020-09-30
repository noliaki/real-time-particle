// float scl = ((aScale.y - mod(uTime, aScale.y)) / aScale.y) * aScale.x * step(0.99, aScale.z) * min(min(uLoudness, 10.0), aScale.w) + aScale.w + (uIsImage ? tProgress * 5.0 : 0.0);
// transformed *= scl;
// transformed = rotateVector(tQuat, transformed);
// transformed += cubicBezier(aStartPosition, aControl0, aControl0, aEndPosition, tProgress);
// transformed.x += noiseX * (width * (1.0 - tProgress) + width * 0.05);
// transformed.y += noiseY * (width * (1.0 - tProgress) + width * 0.05);
// transformed.z += noiseZ * (width * (1.0 - tProgress) + width * 0.05);

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

// float scl = ((aScale.y - mod(uTime, aScale.y)) / aScale.y) * aScale.x * step(0.99, aScale.z) * min(min(uLoudness, 10.0), aScale.w) + aScale.w + (uIsImage ? tProgress * 5.0 : 0.0);
// transformed *= scl;
// transformed = rotateVector(tQuat, transformed);
// transformed += cubicBezier(aStartPosition, aControl0, aControl0, aEndPosition, tProgress);
// transformed.x += noiseX * (width * (1.0 - tProgress) + width * 0.05);
// transformed.y += noiseY * (width * (1.0 - tProgress) + width * 0.05);
// transformed.z += noiseZ * (width * (1.0 - tProgress) + width * 0.05);

transformed = rotateVector(tQuat, transformed);
transformed *= ((noise + 1.0) * 0.5) * 20.0 + 0.1;
transformed.x += (pos.r) * width + width * noise * (utilMap.z * 2.0 - 1.0) * 0.5;
transformed.y += (pos.g) * width + width * noise * (utilMap.x * 2.0 - 1.0) * 0.5;
transformed.z += (pos.b) * width + width * noise * (utilMap.a * 2.0 - 1.0) * 0.5;

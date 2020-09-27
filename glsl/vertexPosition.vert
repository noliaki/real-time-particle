// float scl = ((aScale.y - mod(uTime, aScale.y)) / aScale.y) * aScale.x * step(0.99, aScale.z) * min(min(uLoudness, 10.0), aScale.w) + aScale.w + (uIsImage ? tProgress * 5.0 : 0.0);
// transformed *= scl;
// transformed = rotateVector(tQuat, transformed);
// transformed += cubicBezier(aStartPosition, aControl0, aControl0, aEndPosition, tProgress);
// transformed.x += noiseX * (width * (1.0 - tProgress) + width * 0.05);
// transformed.y += noiseY * (width * (1.0 - tProgress) + width * 0.05);
// transformed.z += noiseZ * (width * (1.0 - tProgress) + width * 0.05);

transformed = rotateVector(tQuat, transformed);
transformed *= mix(((noise + 1.0) * 0.5) * 20.0 + ePosMap.a, 2.0, tProgress);
transformed.x += mix((sPosMap.r) * width + width * noise * sPosMap.a * 0.5, (fract(aIndex * frag) * 2.0 - 1.0) * size, tProgress);
transformed.y += mix((sPosMap.g) * width + width * noise * ePosMap.a * 0.5, (floor(aIndex * frag) * frag * 2.0 - 1.0) * size, tProgress);
transformed.z += mix((sPosMap.b) * width + width * noise * sPosMap.x * 0.5, 0.0, tProgress);

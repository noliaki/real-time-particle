// float scl = ((aScale.y - mod(uTime, aScale.y)) / aScale.y) * aScale.x * step(0.99, aScale.z) * min(min(uLoudness, 10.0), aScale.w) + aScale.w + (uIsImage ? tProgress * 5.0 : 0.0);
// transformed *= scl;
// transformed = rotateVector(tQuat, transformed);
// transformed += cubicBezier(aStartPosition, aControl0, aControl0, aEndPosition, tProgress);
// transformed.x += noiseX * (width * (1.0 - tProgress) + width * 0.05);
// transformed.y += noiseY * (width * (1.0 - tProgress) + width * 0.05);
// transformed.z += noiseZ * (width * (1.0 - tProgress) + width * 0.05);
float pu = fract(aIndex * frag + texShift);
float pv = floor(aIndex * frag) * frag + texShift;

vec3 pos = texture2D(uStartTexture, vec2(pu, pv)).rgb * 2.0 - 1.0;

transformed *= 3.0;
transformed.x += (pos.r * 2.0 - 1.0) * 100.0 + aIndex;
transformed.y += (pos.g * 2.0 - 1.0) * 100.0 * sin(uTime / 80.0);
transformed.z += (pos.b * 2.0 - 1.0) * 100.0;

vec3 color = pos;

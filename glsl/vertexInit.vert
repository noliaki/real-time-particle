// float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
// tProgress = easeCircInOut(tProgress);
// float noiseX = snoise(vec3(aStagger.x, aStagger.y, uTime / (5.0 * width * aStagger.z)));
// float noiseY = snoise(vec3(aStagger.y, aStagger.z, uTime / (5.0 * width * aStagger.x)));
// float noiseZ = snoise(vec3(aStagger.z, aStagger.x, uTime / (5.0 * width * aStagger.y)));
// float noise = (noiseX + noiseY + noiseZ) / 3.0;
// vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, radians(aAxisAngle.w) + (uTime / 10.0) * noise);
float pu = (fract(aIndex * frag) + texShift) * 0.5;
float pv = (floor(aIndex * frag) * frag + texShift) * 0.5;

vec4 sPosMap = texture2D(uTex, vec2(pu, pv + 0.5)) * 2.0 - 1.0;
vec4 ePosMap = texture2D(uTex, vec2(pu, pv)) * 2.0 - 1.0;

vec4 sColorMap = texture2D(uTex, vec2(pu + 0.5, pv + 0.5));
vec4 eColorMap = texture2D(uTex, vec2(pu + 0.5, pv));

float noise = snoise(vec3(sPosMap.a * size, ePosMap.a * size, uTime * 0.001));
vec4 tQuat = quatFromAxisAngle(sColorMap.xyz, radians(sColorMap.a) + (uTime * 0.1) * noise);

vec3 color = hsv(cos(uTime * 0.008) + (sColorMap.a * 0.3), 0.66, 0.98);
// vec3 color = vec3(0.5, 0.1, 0.7);

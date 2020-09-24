// float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
// tProgress = easeCircInOut(tProgress);
// float noiseX = snoise(vec3(aStagger.x, aStagger.y, uTime / (5.0 * width * aStagger.z)));
// float noiseY = snoise(vec3(aStagger.y, aStagger.z, uTime / (5.0 * width * aStagger.x)));
// float noiseZ = snoise(vec3(aStagger.z, aStagger.x, uTime / (5.0 * width * aStagger.y)));
// float noise = (noiseX + noiseY + noiseZ) / 3.0;
// vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, radians(aAxisAngle.w) + (uTime / 10.0) * noise);
float pu = fract(aIndex * frag) + texShift;
float pv = floor(aIndex * frag) * frag + texShift;
vec4 utilMap = texture2D(uUtilTex, vec2(pu, pv));
vec3 posMap = texture2D(uTex, vec2(pu, pv)).rgb;
vec3 pos = posMap * 2.0 - 1.0;
float noise = snoise(vec3(utilMap.xy * size, uTime * 0.001));
vec4 tQuat = quatFromAxisAngle(utilMap.xyz, radians(utilMap.a) + (uTime * 0.1) * noise);

vec3 color = hsv(cos(uTime * 0.008) + (noise * 0.3), 0.66, 0.98);
// vec3 color = vec3(0.5, 0.1, 0.7);

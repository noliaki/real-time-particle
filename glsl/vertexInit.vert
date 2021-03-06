float pu = (fract(aIndex * frag) + texShift) * 0.5;
float pv = (floor(aIndex * frag) * frag + texShift) * 0.5;

float avg = (pu + pv) * 0.5;

vec4 sPosMap = texture2D(uTex, vec2(pu, pv + 0.5)) * 2.0 - 1.0;
vec4 ePosMap = texture2D(uTex, vec2(pu, pv)) * 2.0 - 1.0;

vec4 sColorMap = texture2D(uTex, vec2(pu + 0.5, pv + 0.5));
vec4 eColorMap = texture2D(uTex, vec2(pu + 0.5, pv));

float tProgress = clamp(uProgress - avg * maxDelay, 0.0, duration) / duration;
tProgress = easeCircInOut(tProgress);

float noise = snoise(vec3(sPosMap.a * size, ePosMap.a * size, uTime * 0.001));
vec4 tQuat = quatFromAxisAngle(sColorMap.xyz, radians(sColorMap.a) + (uTime * 0.1) * noise) * (1.0 - tProgress);

vec3 hsvColor = hsv(cos(uTime * 0.008) + (sColorMap.a * 0.3), 0.66, 0.98);
vec3 color = vec3(
  mix(hsvColor.r, eColorMap.r, tProgress),
  mix(hsvColor.g, eColorMap.g, tProgress),
  mix(hsvColor.b, eColorMap.b, tProgress)
);

float endScaleRate = uImageRate < 1.0 ? 1.0 / uImageRate : uImageRate;
float transformOffset = width * noise * 0.5;

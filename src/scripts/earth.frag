precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform float mode;
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform sampler2D cloudsMap;
uniform sampler2D specMap;
const float PI = 3.14159265;

float hash(vec2 cell) {
  return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
}

float stars(vec2 point, float density, float layer) {
  vec2 cell = floor(point * density);
  vec2 offset = vec2(hash(cell + layer), hash(cell - layer));
  vec2 delta = fract(point * density) - 0.1 - 0.8 * offset;
  return step(0.86, offset.x) * exp(-dot(delta, delta) * 260.0) *
    (0.27 + 0.72 * offset.y) * (0.88 + 0.12 * sin(time * 0.48 + offset.y * 22.0));
}

mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float aspect = resolution.x / resolution.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);
  float radius = max(1.14, aspect * 0.91);
  float top = mix(0.40, 0.44, mode);
  vec2 center = vec2(0.0, top - radius) + pointer * 0.018;
  vec2 surface = p - center;
  float distanceToLimb = length(surface) - radius;

  // Starfield matching the interior page shader
  vec2 skyPoint = p + pointer * 0.009 + vec2(time * 0.0024, 0.0);
  vec3 sky = mix(vec3(.006, .012, .033), vec3(.024, .064, .145), exp(-2.2 * max(distanceToLimb, 0.0)));
  sky += vec3(.59, .76, .97) * (stars(skyPoint, 63., 4.) + 0.45 * stars(skyPoint, 118., 8.));

  float sunX = mix(.36, -.34, mode) * min(aspect, 1.7);
  float hotspot = exp(-pow((surface.x - sunX) * 2.8, 2.0));
  float edge = abs(distanceToLimb);

  // Multi-band Rayleigh atmospheric limb glow
  vec3 air = vec3(.048, .26, .95) * exp(-edge * 19.) +
             vec3(.16, .60, 1.0) * exp(-edge * 84.) +
             vec3(.68, .88, 1.0) * exp(-edge * 290.);

  // Delicate polar aurora curtains on the nightside limb
  float arc = .028 + .013 * sin(surface.x * 8. + time * .19) + .008 * sin(surface.x * 19. - time * .24);
  float curtain = exp(-abs(distanceToLimb - arc) * 76.);
  float folds = .6 + .4 * sin(surface.x * 82. + 3. * sin(surface.x * 21. + time * .27) + time * .36);
  float auroraX = mix(-.39, -.15, mode);
  float nightside = exp(-pow((surface.x - auroraX) * 2.8, 2.));
  sky += vec3(.04, .54, .56) * curtain * folds * nightside;

  vec3 color = sky;

  if (distanceToLimb < 0.0) {
    vec2 xy = surface / radius;
    vec3 normal = vec3(xy, sqrt(max(0.0, 1.0 - dot(xy, xy))));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // Orient globe smoothly for Hero vs Footer orbital tracks
    vec3 geo = normal;
    geo.yz = rotate(mix(-.70, -.58, mode) + pointer.y * .022) * geo.yz;
    geo.xz = rotate(mix(-1.18, 0.42, mode) + time * .011 + pointer.x * .12) * geo.xz;

    vec2 st = vec2(
      fract(0.5 + atan(geo.x, geo.z) / (2.0 * PI)),
      clamp(0.5 - asin(clamp(geo.y, -1.0, 1.0)) / PI, 0.002, 0.998)
    );

    vec3 dayRaw = texture2D(dayMap, st).rgb;
    vec3 nightRaw = texture2D(nightMap, st).rgb;
    float water = smoothstep(0.25, 0.72, texture2D(specMap, st).r);

    // Subtle micro-relief bump from luminance gradients over land
    vec2 texel = vec2(1.0 / 2048.0, 1.0 / 1024.0);
    float hC = dot(dayRaw, vec3(0.299, 0.587, 0.114));
    float hR = dot(texture2D(dayMap, vec2(fract(st.x + texel.x), st.y)).rgb, vec3(0.299, 0.587, 0.114));
    float hU = dot(texture2D(dayMap, vec2(st.x, clamp(st.y - texel.y, 0.002, 0.998))).rgb, vec3(0.299, 0.587, 0.114));
    vec3 landBump = normalize(normal + vec3((hC - hR) * 1.9, (hC - hU) * 1.9, 0.0) * (1.0 - water));

    vec3 sunDir = normalize(mix(vec3(0.62, 0.62, 0.36), vec3(-0.74, 0.44, -0.12), mode));
    float ndotl = dot(normal, sunDir);
    float diffuse = smoothstep(-0.14, 0.78, dot(landBump, sunDir));
    float twilight = smoothstep(-0.26, 0.24, ndotl);
    float nightMask = smoothstep(0.28, -0.14, ndotl);

    // Cinematic orbital grading: real geography harmonized with deep cobalt oceans
    float luma = dot(dayRaw, vec3(0.299, 0.587, 0.114));
    vec3 gradedLand = mix(dayRaw * vec3(0.84, 0.94, 1.1), vec3(luma) * vec3(0.52, 0.7, 0.96), 0.34);
    vec3 gradedOcean = mix(vec3(0.01, 0.036, 0.105), vec3(0.028, 0.105, 0.25), clamp(dayRaw.b * 1.6, 0.0, 1.0));
    vec3 surfaceAlbedo = mix(gradedLand, gradedOcean, water);

    // Real 4K cloud layer drifting gently ahead of surface + ground drop shadow
    vec2 cloudSt = vec2(fract(st.x - time * 0.0024), st.y);
    float cloud = smoothstep(0.14, 0.88, texture2D(cloudsMap, cloudSt).r);
    vec2 shadowSt = vec2(
      fract(cloudSt.x - sunDir.x * 0.0026),
      clamp(cloudSt.y - sunDir.y * 0.0014, 0.002, 0.998)
    );
    float cloudShadow = smoothstep(0.18, 0.86, texture2D(cloudsMap, shadowSt).r);

    // Sunlit surface + ocean specular glint
    vec3 litSurface = surfaceAlbedo * (0.06 + 0.94 * diffuse) * (1.0 - cloudShadow * 0.42 * diffuse);
    vec3 halfVec = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 46.0) * water * twilight * (1.0 - cloud * 0.88);
    litSurface += vec3(0.62, 0.84, 1.0) * spec * 0.65;

    // Warm golden city lights on the night hemisphere
    float cityIntensity = max(0.0, max(nightRaw.r, nightRaw.g * 0.85) - nightRaw.b * 0.25);
    vec3 cityGlow = vec3(1.25, 0.88, 0.44) * pow(cityIntensity, 1.05) * mix(1.45, 2.05, mode) * nightMask;
    vec3 cloudedCities = cityGlow * (1.0 - cloud * 0.72);

    // Sunlit & twilight cloud tops
    float cloudLight = smoothstep(-0.16, 0.68, ndotl);
    vec3 cloudColor = mix(vec3(0.035, 0.068, 0.155), vec3(0.84, 0.92, 1.0), cloudLight);
    float termBand = exp(-pow((ndotl + 0.02) * 5.0, 2.0));
    cloudColor += vec3(0.18, 0.36, 0.64) * termBand * 0.42;

    color = mix(litSurface + cloudedCities, cloudColor, cloud * 0.86);

    // Physical Fresnel atmospheric veil over the curved horizon
    float fresnel = pow(1.0 - normal.z, 3.6);
    color += vec3(0.12, 0.44, 0.96) * fresnel * (0.28 + 0.82 * twilight);
    color += vec3(0.32, 0.68, 1.0) * pow(1.0 - normal.z, 7.5) * (0.22 + 0.72 * hotspot);

    // Smooth dark vignette toward bottom edge of frame
    color *= mix(0.46, 1.0, smoothstep(0.0, 0.28, uv.y));
  }

  color += air * (0.34 + hotspot * 0.96);
  color += vec3(0.18, 0.36, 0.72) * hotspot * exp(-edge * 9.0);
  gl_FragColor = vec4(color, 1.0);
}

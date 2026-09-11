import * as THREE from "three";

// Uniformi su dijeljeni (jedan model = jedan materijal).
export const HIGHLIGHT_UNIFORMS = {
  // --- highlight mišića ---
  uMix:   { value: 1 },
  uSweep: { value: 2 },
  uFocus: { value: 0 },
  uIdle:  { value: 1 },
  uTime:  { value: 0 },
  uScan:  { value: -9 },
  uColor: { value: new THREE.Color("#ff4a2e") },
  uY0:    { value: 0 },
  uY1:    { value: 1.7 },

  // --- obrada teksture ---
  uShade:    { value: 0.58 },                                 // koliko potamni strana okrenuta od svjetla (1 = bez sjenčanja)
  uLightDir: { value: new THREE.Vector3(0.35, 0.45, 0.82) },  // smjer svjetla U PROSTORU KAMERE -> prati rotaciju
  uRim:      { value: 0.14 },                                 // jačina rub-svjetla
  uRimColor: { value: new THREE.Color("#e8e2d8") },
  uSharpen:  { value: 0. },                                  // izoštravanje (0 = isključeno, 1.5 = agresivno)
  uTexel:    { value: new THREE.Vector2(1 / 2048, 1 / 2048) }, // postavlja se iz TrainerModel-a
  uContrast: { value: 1.14 },
  uSaturate: { value: 1.14 },
};

/**
 * Meshy model dolazi "fullbright": emissive je bijeli i nosi cijeli izgled, a
 * metalness je po glTF defaultu 1.0. Zbog toga izgleda plosnato kao 2D slika.
 * Gasimo emissive i spuštamo metalness da svjetla iz scene uopće imaju efekta,
 * a onda u shaderu vraćamo kontrast i oštrinu koje smo time izgubili.
 */
export function patchMuscleMaterial(material) {
  if (!material || material.userData.__musclePatched) return;
  material.userData.__musclePatched = true;

  material.emissive = new THREE.Color(0, 0, 0);
  material.emissiveMap = null;
  material.roughness = 0.78;
  material.metalness = 0.0;      // glTF default je 1.0 -> bez ovoga model pocrni

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, HIGHLIGHT_UNIFORMS);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `
        #include <common>
        attribute float aMaskA;
        attribute float aMaskB;
        attribute float aMaskIdle;
        varying float vMaskA;
        varying float vMaskB;
        varying float vMaskIdle;
        varying float vRestY;
      `)
      .replace("#include <begin_vertex>", `
        #include <begin_vertex>
        vMaskA = aMaskA;
        vMaskB = aMaskB;
        vMaskIdle = aMaskIdle;
        vRestY = position.y;   // rest poza -> neovisno o skinningu
      `);

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `
        #include <common>
        uniform float uMix, uSweep, uFocus, uIdle, uTime, uScan, uY0, uY1;
        uniform vec3  uColor;
        uniform float uShade, uRim, uSharpen, uContrast, uSaturate;
        uniform vec3  uLightDir, uRimColor;
        uniform vec2  uTexel;
        varying float vMaskA;
        varying float vMaskB;
        varying float vMaskIdle;
        varying float vRestY;
      `)
      // ubacujemo se PRIJE tone mappinga -> sve niže radi u linearnom prostoru
      .replace("#include <opaque_fragment>", `
        vec3 Ng = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
        vec3 Vg = normalize(vViewPosition);

        // 1. sjenčanje: key svjetlo vezano za kameru
        float ndl = dot(Ng, normalize(uLightDir));
        outgoingLight *= mix(uShade, 1.0, smoothstep(-0.45, 0.85, ndl));

        // 2. rim
        float rimG = pow(1.0 - clamp(dot(Ng, Vg), 0.0, 1.0), 3.0);
        outgoingLight += uRimColor * rimG * uRim;

        // 3. izoštravanje (unsharp mask iz teksture)
        #ifdef USE_MAP
          vec3 t0 = texture2D(map, vMapUv).rgb;
          vec3 tb = (texture2D(map, vMapUv + vec2(uTexel.x, 0.0)).rgb
                   + texture2D(map, vMapUv - vec2(uTexel.x, 0.0)).rgb
                   + texture2D(map, vMapUv + vec2(0.0, uTexel.y)).rgb
                   + texture2D(map, vMapUv - vec2(0.0, uTexel.y)).rgb) * 0.25;
          outgoingLight += (t0 - tb) * uSharpen;
        #endif

        // 4. kontrast i zasićenje (pivot 0.18 = srednji ton U LINEARNOM prostoru,
        //    0.5 bi ovdje bilo previsoko i sve bi otišlo u crno)
        outgoingLight = (outgoingLight - 0.18) * uContrast + 0.18;
        float gg = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
        outgoingLight = max(mix(vec3(gg), outgoingLight, uSaturate), vec3(0.0));

        // --- sweep: highlight se "puni" kroz visinu zone ---
        float t = clamp((vRestY - uY0) / max(uY1 - uY0, 0.001), 0.0, 1.0);
        float reveal = smoothstep(uSweep - 0.55, uSweep - 0.05, t);

        float mA = vMaskA * (1.0 - uMix);
        float mB = vMaskB * uMix * reveal;
        float m  = clamp(max(mA, mB), 0.0, 1.0);

        vec3  base = outgoingLight;
        float lum  = dot(base, vec3(0.2126, 0.7152, 0.0722));

        // --- ostatak tijela: desaturiraj i zatamni da fokus bude jasan ---
        vec3 dim = mix(base, vec3(lum) * 0.55, 0.82);
        vec3 col = mix(base, dim, uFocus * (1.0 - m));

        // --- tint koji ZADRŽAVA sjenčanje ispod ---
        vec3 tint = uColor * (0.55 + 0.95 * lum);
        col = mix(col, tint, clamp(m * 0.88, 0.0, 1.0));
        col += uColor * m * 0.22;

        // --- fresnel rim unutar zone ---
        vec3 V = normalize(vViewPosition);
        float fres = pow(1.0 - clamp(dot(normalize(vNormal), V), 0.0, 1.0), 2.2);
        col += uColor * fres * m * 0.85;

        // --- tanka kontura na rubu maske ---
        float edge = smoothstep(0.30, 0.44, m) * (1.0 - smoothstep(0.46, 0.62, m));
        col += uColor * edge * 0.5;

        // --- puls ---
        col += uColor * m * 0.07 * (0.5 + 0.5 * sin(uTime * 2.6));

        // --- idle: zlatna traka koja polako "skenira" tijelo ---
        float band = exp(-pow((vRestY - uScan) * 13.0, 2.0));
        col += vec3(0.95, 0.74, 0.30) * vMaskIdle * uIdle * band * 0.45;

        outgoingLight = col;
        #include <opaque_fragment>
      `);
  };

  material.customProgramCacheKey = () => "muscle-highlight";
  material.needsUpdate = true;
}
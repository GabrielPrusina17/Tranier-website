// =============================================================
//  MIŠIĆNE ZONE — za model trainer1.glb
//
//  Taj model NEMA kostiju (nije riggan), pa zonu definira samo
//  elipsoid + strana tijela po normali. `bones: []` znači da se
//  filtar po kostima preskače.
//
//  Prostor modela: visina 1.902, ishodište u SREDINI tijela
//  (stopala y = -0.952, tjeme y = +0.951), +z je naprijed.
//
//   center/radii — elipsoid koji ograničava područje
//   side   — 1 prednja strana, -1 stražnja, 0 obje (po normali)
//   mirror — true = ista zona lijevo i desno (ruke, noge)
// =============================================================
export const MUSCLE_ZONES = [
  { id: "chest", label: "Prsa", lat: "Pectoralis major", side: 1, mirror: true, bones: [],
    center: [0.08, 0.475, 0.05], radii: [0.14, 0.115, 0.2], soft: 0.6,
    ex: [["01", "Bench press"], ["02", "Incline dumbbell press"], ["03", "Cable fly"]] },

  { id: "abs", label: "Trbuh", lat: "Rectus abdominis", side: 1, mirror: false, bones: [],
    center: [0, 0.29, 0.075], radii: [0.12, 0.17, 0.2], soft: 0.6,
    ex: [["01", "Hanging leg raise"], ["02", "Cable crunch"], ["03", "Plank"]] },

  { id: "back", label: "Leđa", lat: "Latissimus dorsi", side: -1, mirror: false, bones: [],
    center: [0, 0.4, -0.06], radii: [0.22, 0.17, 0.21], soft: 0.55,
    ex: [["01", "Pull-up"], ["02", "Barbell row"], ["03", "Lat pulldown"]] },

  { id: "shoulders", label: "Ramena", lat: "Deltoideus", side: 0, mirror: true, bones: [],
    center: [0.22, 0.565, -0.01], radii: [0.115, 0.09, 0.135], soft: 0.55,
    ex: [["01", "Overhead press"], ["02", "Lateral raise"], ["03", "Face pull"]] },

  { id: "biceps", label: "Biceps", lat: "Biceps brachii", side: 1, mirror: true, bones: [],
    center: [0.345, 0.565, -0.03], radii: [0.15, 0.14, 0.19], soft: 0.6,
    ex: [["01", "Barbell curl"], ["02", "Incline dumbbell curl"], ["03", "Hammer curl"]] },

  { id: "triceps", label: "Triceps", lat: "Triceps brachii", side: -1, mirror: true, bones: [],
    center: [0.345, 0.565, -0.08], radii: [0.15, 0.14, 0.19], soft: 0.6,
    ex: [["01", "Close-grip bench"], ["02", "Rope pushdown"], ["03", "Overhead extension"]] },

  { id: "forearms", label: "Podlaktica", lat: "Brachioradialis", side: 0, mirror: true, bones: [],
    center: [0.60, 0.565, -0.05], radii: [0.15, 0.13, 0.17], soft: 0.6,
    ex: [["01", "Farmer carry"], ["02", "Reverse curl"], ["03", "Dead hang"]] },

  { id: "glutes", label: "Stražnjica", lat: "Gluteus maximus", side: -1, mirror: false, bones: [],
    center: [0, -0.1, -0.09], radii: [0.2, 0.11, 0.14], soft: 0.55,
    ex: [["01", "Hip thrust"], ["02", "Romanian deadlift"], ["03", "Bulgarian split squat"]] },

  { id: "quads", label: "Kvadriceps", lat: "Quadriceps femoris", side: 1, mirror: true, bones: [],
    center: [0.115, -0.36, 0.01], radii: [0.14, 0.18, 0.18], soft: 0.6,
    ex: [["01", "Back squat"], ["02", "Leg press"], ["03", "Walking lunge"]] },

  { id: "hamstrings", label: "Zadnja loža", lat: "Biceps femoris", side: -1, mirror: true, bones: [],
    center: [0.115, -0.36, -0.04], radii: [0.14, 0.18, 0.18], soft: 0.6,
    ex: [["01", "Deadlift"], ["02", "Leg curl"], ["03", "Good morning"]] },

  { id: "calves", label: "Listovi", lat: "Gastrocnemius", side: -1, mirror: true, bones: [],
    center: [0.145, -0.70, -0.04], radii: [0.12, 0.16, 0.17], soft: 0.6,
    ex: [["01", "Standing calf raise"], ["02", "Seated calf raise"], ["03", "Jump rope"]] },
];
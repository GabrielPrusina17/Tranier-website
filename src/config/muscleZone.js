// =============================================================
//  MIŠIĆNE ZONE
//  Svaka zona je presjek TRI uvjeta, u lokalnom prostoru modela
//  (model je visok 1.7: y=0 stopala, y=1.7 tjeme; x: ±0.84 T-poza):
//
//   bones  — na kojim kostima mišić "visi" (iz skin weightsa)
//   center/radii — elipsoid koji ograničava područje
//   side   — 1 prednja strana, -1 stražnja, 0 obje (po normali)
//   mirror — true = ista zona lijevo i desno (ruke, noge)
//
//  NAPOMENA: u ovom modelu su kosti kralježnice obrnuto imenovane —
//  Spine02 je DONJI trup (trbuh), Spine01 prsa, Spine vrh prsa.
// =============================================================
export const MUSCLE_ZONES = [
  { id: "chest", label: "Prsa", lat: "Pectoralis major", side: 1, mirror: true,
    bones: ["Spine01", "Spine", "LeftShoulder", "RightShoulder"],
    center: [0.085, 1.285, 0.04], radii: [0.125, 0.095, 0.19], soft: 0.6,
    ex: [["01", "Bench press"], ["02", "Incline dumbbell press"], ["03", "Cable fly"]] },

  { id: "abs", label: "Trbuh", lat: "Rectus abdominis", side: 1, mirror: false,
    bones: ["Spine02", "Hips"],
    center: [0, 1.09, 0.045], radii: [0.10, 0.125, 0.19], soft: 0.6,
    ex: [["01", "Hanging leg raise"], ["02", "Cable crunch"], ["03", "Plank"]] },

  { id: "back", label: "Leđa", lat: "Latissimus dorsi", side: -1, mirror: false,
    bones: ["Spine01", "Spine02"],
    center: [0, 1.22, -0.05], radii: [0.22, 0.15, 0.20], soft: 0.55,
    ex: [["01", "Pull-up"], ["02", "Barbell row"], ["03", "Lat pulldown"]] },

  { id: "shoulders", label: "Ramena", lat: "Deltoideus", side: 0, mirror: true,
    bones: ["LeftShoulder", "RightShoulder", "LeftArm", "RightArm"],
    center: [0.19, 1.39, -0.04], radii: [0.11, 0.10, 0.14], soft: 0.55,
    ex: [["01", "Overhead press"], ["02", "Lateral raise"], ["03", "Face pull"]] },

  { id: "biceps", label: "Biceps", lat: "Biceps brachii", side: 1, mirror: true,
    bones: ["LeftArm", "RightArm"],
    center: [0.31, 1.37, -0.06], radii: [0.13, 0.09, 0.12], soft: 0.55,
    ex: [["01", "Barbell curl"], ["02", "Incline dumbbell curl"], ["03", "Hammer curl"]] },

  { id: "triceps", label: "Triceps", lat: "Triceps brachii", side: -1, mirror: true,
    bones: ["LeftArm", "RightArm"],
    center: [0.31, 1.37, -0.07], radii: [0.13, 0.09, 0.12], soft: 0.55,
    ex: [["01", "Close-grip bench"], ["02", "Rope pushdown"], ["03", "Overhead extension"]] },

  { id: "forearms", label: "Podlaktica", lat: "Brachioradialis", side: 0, mirror: true,
    bones: ["LeftForeArm", "RightForeArm"],
    center: [0.52, 1.36, -0.07], radii: [0.14, 0.08, 0.10], soft: 0.55,
    ex: [["01", "Farmer carry"], ["02", "Reverse curl"], ["03", "Dead hang"]] },

  { id: "glutes", label: "Stražnjica", lat: "Gluteus maximus", side: -1, mirror: false,
    bones: ["Hips"],
    center: [0, 0.95, -0.07], radii: [0.19, 0.12, 0.14], soft: 0.55,
    ex: [["01", "Hip thrust"], ["02", "Romanian deadlift"], ["03", "Bulgarian split squat"]] },

  { id: "quads", label: "Kvadriceps", lat: "Quadriceps femoris", side: 1, mirror: true,
    bones: ["LeftUpLeg", "RightUpLeg"],
    center: [0.11, 0.70, 0.0], radii: [0.14, 0.21, 0.16], soft: 0.55,
    ex: [["01", "Back squat"], ["02", "Leg press"], ["03", "Walking lunge"]] },

  { id: "hamstrings", label: "Zadnja loža", lat: "Biceps femoris", side: -1, mirror: true,
    bones: ["LeftUpLeg", "RightUpLeg"],
    center: [0.11, 0.70, -0.02], radii: [0.14, 0.21, 0.16], soft: 0.55,
    ex: [["01", "Deadlift"], ["02", "Leg curl"], ["03", "Good morning"]] },

  { id: "calves", label: "Listovi", lat: "Gastrocnemius", side: -1, mirror: true,
    bones: ["LeftLeg", "RightLeg"],
    center: [0.14, 0.33, -0.05], radii: [0.12, 0.19, 0.13], soft: 0.55,
    ex: [["01", "Standing calf raise"], ["02", "Seated calf raise"], ["03", "Jump rope"]] },
];
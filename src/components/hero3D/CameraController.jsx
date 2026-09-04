// =============================================================
//  CAMERA CONTROLLER — upravljanje kamerom
// =============================================================
//
//  Kamera ima dva "režima" u interaktivnoj fazi:
//  1. SLOBODNO: korisnik rotira model mišem (OrbitControls)
//  2. ZOOM: kad klikne mišić, kamera glatko odleti do te zone
//
//  Koristimo <OrbitControls> iz drei-a za rotaciju, a za
//  glatki zoom koristimo njegovu .setLookAt-sličnu logiku
//  preko ref-a. Kad je activeZone postavljen, "vozimo" kameru
//  do zone; kad je null, vraćamo je i puštamo korisniku.
//
//  KONCEPT: useFrame + lerp (linearna interpolacija).
//  Umjesto da kameru teleportujemo, svaki frame je pomjeramo
//  MALO ka cilju (lerp). To daje glatko "klizanje".
// =============================================================

import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraController({ activeZone, enabled }) {
  // ref na OrbitControls instancu (da čitamo/mijenjamo target)
  const controlsRef = useRef();

  // useThree nam daje pristup kameri same scene
  const { camera } = useThree();

  // Pomoćni vektori — pravimo ih JEDNOM (izvan useFrame) da ne
  // stvaramo nove objekte svaki frame (bolje za performanse).
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  // Kad se activeZone promijeni, postavi ciljne vrijednosti
  useEffect(() => {
    if (activeZone) {
      // Klik na mišić: cilj = pozicije definisane u muscleZones.js
      targetCamPos.current.set(...activeZone.camera.position);
      targetLookAt.current.set(...activeZone.camera.target);
      // Isključi ručnu rotaciju dok smo zoomirani na mišić
      if (controlsRef.current) controlsRef.current.enabled = false;
    } else {
      // Nema aktivne zone: vrati na "default" pogled ispred modela
      targetCamPos.current.set(0, 0.5, 3);
      targetLookAt.current.set(0, 0.2, 0);
      // Vrati korisniku kontrolu rotacije
      if (controlsRef.current) controlsRef.current.enabled = enabled;
    }
  }, [activeZone, enabled]);

  // Svaki frame: glatko pomjeraj kameru ka cilju (samo dok
  // je zona aktivna ILI se vraćamo). lerp faktor 0.05 = brzina
  // klizanja (manje = sporije/mekše).
  useFrame(() => {
    if (activeZone) {
      camera.position.lerp(targetCamPos.current, 0.06);
      // OrbitControls "target" je tačka oko koje kamera gleda/rotira
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.06);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      // enabled: rotacija dozvoljena samo u interaktivnoj fazi
      enabled={enabled}
      // enablePan false: zabranjujemo pomjeranje (samo rotacija)
      enablePan={false}
      // enableZoom: dozvoli scroll-zoom mišem? Za sada false da
      // ne bunimo sa scroll-scrubbingom stranice.
      enableZoom={false}
      // Ograniči vertikalni ugao da se ne može gledati ispod poda
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.8}
    />
  );
}
import * as THREE from "three";
import MATERIALS from "./components/materials.js";
import { createWall } from "./components/walls.js";
import { createArea } from "./components/areas.js";
import { createGroundPlaneXZ } from "./components/groundPlane.js";
import {
  addBlockandStairToArea,
} from "./util.js";
import {
  areaGeometrySmall,
  areaGeometryLarge,
  wallGeometry,
  groundPlaneGeometry,
} from "./components/geometries.js";
import {
  initRenderer,
  initDefaultBasicLight,
} from "../libs/util/util.js";

import { createFPSCamera } from "./fpsCamera.js";

// Inicialização da cena
const scene = new THREE.Scene();
const renderer = initRenderer();
initDefaultBasicLight(scene);

// Câmera e controles FPS
const { camera, updateMovement } = createFPSCamera(renderer, scene);

// Eixos e grid
scene.add(new THREE.AxesHelper(12));
scene.add(new THREE.GridHelper(500, 500));

// Plano base
const groundPlane = createGroundPlaneXZ(groundPlaneGeometry, MATERIALS.groundPlane);
scene.add(groundPlane);

// Paredes
const wallUp = createWall(wallGeometry, MATERIALS.wall, [0, 25, -250]);
const wallDown = createWall(wallGeometry, MATERIALS.wall, [0, 25, 250]);
const wallLeft = createWall(wallGeometry, MATERIALS.wall, [-250, 25, 0], Math.PI / 2);
const wallRight = createWall(wallGeometry, MATERIALS.wall, [250, 25, 0], Math.PI / 2);
scene.add(wallUp, wallDown, wallLeft, wallRight);

// Áreas
const area1 = createArea(areaGeometrySmall, MATERIALS.lightgreen, [-150, 4, -150]);
const area2 = createArea(areaGeometrySmall, MATERIALS.red, [0, 4, -150]);
const area3 = createArea(areaGeometrySmall, MATERIALS.blue, [150, 4, -150]);
const area4 = createArea(areaGeometryLarge, MATERIALS.green, [0, 4, 150]);
scene.add(area1, area2, area3, area4);

// Escadas
addBlockandStairToArea(area1, [-30, -3.5, 60], Math.PI);
addBlockandStairToArea(area2, [30, -3.5, 60], Math.PI);
addBlockandStairToArea(area3, [0, -3.5, 60], Math.PI);
addBlockandStairToArea(area4, [0, -3.5, -85], 0);

// Personagem
const characterGeometry = new THREE.BoxGeometry(4, 7, 3); // largura, altura, profundidade
const characterMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const character = new THREE.Mesh(characterGeometry, characterMaterial);
character.position.set(0, 2, 0); // altura do centro do cubo = altura / 2
scene.add(character);

// Arma (cilindro no braço direito)
const weaponGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
const weaponMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);

// Ajustes de posição e rotação
weapon.rotation.z = -(Math.PI * 0.9) / 2; // inclinação para cima
weapon.position.set(2.5, 2, 1.5); // próximo ao "braço" direito
character.add(weapon);

// ==== TELA INICIAL E PONTEIRO DE MIRA ====
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const pauseScreen = document.getElementById("pause-screen");
const resumeButton = document.getElementById("resume-button");
const crosshair = document.getElementById("crosshair");

crosshair.style.display = "none";
pauseScreen.style.display = "none";

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  crosshair.style.display = "block";
  document.body.requestPointerLock();
});

resumeButton.addEventListener("click", () => {
  pauseScreen.style.display = "none";
  crosshair.style.display = "block";
  document.body.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  const isLocked = document.pointerLockElement === document.body;
  if (!isLocked && startScreen.style.display === "none") {
    pauseScreen.style.display = "flex";
    crosshair.style.display = "none";
  }
});

function render() {
  requestAnimationFrame(render);
  updateMovement();
  renderer.render(scene, camera);
}

render();
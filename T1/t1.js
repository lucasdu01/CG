import * as THREE from "three";
import MATERIALS from "./components/materials.js";
import { createWall } from "./components/walls.js";
import { createArea } from "./components/areas.js";
import { createGroundPlaneXZ } from "./components/groundPlane.js";
import { addBlockandStairToArea } from "./util.js";
import {
  areaGeometrySmall,
  areaGeometryLarge,
  wallGeometry,
  groundPlaneGeometry
} from "./components/geometries.js";
import { initDefaultBasicLight, onWindowResize } from "../libs/util/util.js";
import setupCameraAndControls from "./cameraControls.js";

// Inicialização da cena e renderizador
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

initDefaultBasicLight(scene);
window.addEventListener("resize", () => onWindowResize(camera, renderer), false);

// Câmera e controles
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// Plano de fundo
scene.add(new THREE.AxesHelper(12));
scene.add(new THREE.GridHelper(500, 500));

// Plano do chão
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

// Inicialização da câmera e controles
const collidableObjects = [groundPlane, area1, area2, area3, area4];
const { controls, update } = setupCameraAndControls(camera, scene, document.body, collidableObjects);

// Loop de animação
let prevTime = performance.now();

function animate() {
  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  update(delta); // Atualiza movimentação
  renderer.render(scene, camera);

  prevTime = time;
}

// INTEGRAÇÃO COM A INTERFACE
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const pauseScreen = document.getElementById("pause-screen");
const resumeButton = document.getElementById("resume-button");
const crosshair = document.getElementById("crosshair");

// Começar o jogo
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  crosshair.style.display = "block";
  controls.lock(); // Ativa o pointer lock
});

// Continuar após pausa
resumeButton.addEventListener("click", () => {
  pauseScreen.style.display = "none";
  crosshair.style.display = "block";
  controls.lock();
});

// Controla pause
document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    if (controls.isLocked) {
      controls.unlock();
    }
  }
});

// Mostrar/ocultar interface conforme estado do pointer lock
controls.addEventListener("lock", () => {
  crosshair.style.display = "block";
  pauseScreen.style.display = "none";
});

controls.addEventListener("unlock", () => {
  // Se unlock não foi causado por tela inicial
  if (!startScreen.style.display || startScreen.style.display === "none") {
    pauseScreen.style.display = "flex";
    crosshair.style.display = "none";
  }
});
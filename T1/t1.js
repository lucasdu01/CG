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
  groundPlaneGeometry,
} from "./components/geometries.js";
import { initRenderer, initDefaultBasicLight } from "../libs/util/util.js";
import { createFPSCamera } from "./fpsCamera.js";

const scene = new THREE.Scene();
const renderer = initRenderer();
initDefaultBasicLight(scene);

const { camera, updateMovement } = createFPSCamera(renderer, scene);

scene.add(new THREE.AxesHelper(12));
scene.add(new THREE.GridHelper(500, 500));

const groundPlane = createGroundPlaneXZ(groundPlaneGeometry, MATERIALS.groundPlane);
scene.add(groundPlane);

scene.add(
  createWall(wallGeometry, MATERIALS.wall, [0, 25, -250]),
  createWall(wallGeometry, MATERIALS.wall, [0, 25, 250]),
  createWall(wallGeometry, MATERIALS.wall, [-250, 25, 0], Math.PI / 2),
  createWall(wallGeometry, MATERIALS.wall, [250, 25, 0], Math.PI / 2)
);

const area1 = createArea(areaGeometrySmall, MATERIALS.lightgreen, [-150, 4, -150]);
const area2 = createArea(areaGeometrySmall, MATERIALS.red, [0, 4, -150]);
const area3 = createArea(areaGeometrySmall, MATERIALS.blue, [150, 4, -150]);
const area4 = createArea(areaGeometryLarge, MATERIALS.green, [0, 4, 150]);
scene.add(area1, area2, area3, area4);

addBlockandStairToArea(area1, [-30, -3.5, 60], Math.PI);
addBlockandStairToArea(area2, [30, -3.5, 60], Math.PI);
addBlockandStairToArea(area3, [0, -3.5, 60], Math.PI);
addBlockandStairToArea(area4, [0, -3.5, -85], 0);

const character = new THREE.Mesh(
  new THREE.BoxGeometry(4, 7, 3),
  new THREE.MeshStandardMaterial({ color: 0x888888 })
);
character.position.set(0, 2, 0);
scene.add(character);

const weapon = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 5, 16),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
weapon.rotation.z = -(Math.PI * 0.9) / 2;
weapon.position.set(2.5, 2, 1.5);
character.add(weapon);

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const crosshair = document.getElementById("crosshair");

crosshair.style.display = "none";

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  crosshair.style.display = "block";
  document.body.requestPointerLock();
});

function render() {
  requestAnimationFrame(render);
  updateMovement();
  renderer.render(scene, camera);
}

render();
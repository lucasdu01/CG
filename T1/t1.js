import * as THREE from "three";
import MATERIALS from "./components/materials.js";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { createWall } from "./components/walls.js";
import { createArea } from "./components/areas.js";
import { createGroundPlaneXZ } from "./components/groundPlane.js";
import { addBlockandStairToArea, addBlocksToArea, addStairToArea } from "./util.js";
import { areaGeometrySmall, areaGeometryLarge, blockGeometrySmall, blockGeometryLarge, wallGeometry, groundPlaneGeometry, block1area1Geometry } from "./components/geometries.js";
import { initRenderer, initCamera, initDefaultBasicLight, onWindowResize } from "../libs/util/util.js";

// Inicialização da cena e utilitárioss
const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 500, 0));
initDefaultBasicLight(scene);
const orbit = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", () => onWindowResize(camera, renderer), false);

// Eixos e grid
scene.add(new THREE.AxesHelper(12));
scene.add(new THREE.GridHelper(500, 500));

// Plano base
const groundPlane = createGroundPlaneXZ(groundPlaneGeometry, MATERIALS.groundPlane);
scene.add(groundPlane);

// Paredes (largura, altura, posição, rotação)
const wallUp = createWall(wallGeometry, MATERIALS.wall, [0, 25, -250]);
const wallDown = createWall(wallGeometry, MATERIALS.wall, [0, 25, 250]);
const wallLeft = createWall(wallGeometry, MATERIALS.wall, [-250, 25, 0], Math.PI / 2);
const wallRight = createWall(wallGeometry, MATERIALS.wall, [250, 25, 0], Math.PI / 2);
scene.add(wallUp, wallDown, wallLeft, wallRight);

// Areas
const area1 = createArea(areaGeometrySmall, MATERIALS.lightgreen, [-150, 4, -150]);
const area2 = createArea(areaGeometrySmall, MATERIALS.red, [0, 4, -150]);
const area3 = createArea(areaGeometrySmall, MATERIALS.blue, [150, 4, -150]);
const area4 = createArea(areaGeometryLarge, MATERIALS.green, [0, 4, 150]);
scene.add(area1, area2, area3, area4);

// Adiciona escadas
addStairToArea(area1, [0, -3.5, 60], Math.PI);
addStairToArea(area2, [0, -3.5, 60], Math.PI);
addStairToArea(area3, [0, -3.5, 60], Math.PI);
addStairToArea(area4, [0, -3.5, -85], 0);

// Adiciona blocos
addBlocksToArea(area1, blockGeometrySmall, MATERIALS.lightgreen, [[-30, 0, 55.5], [30, 0, 55.5]]);
addBlocksToArea(area2, blockGeometrySmall, MATERIALS.red, [[-30, 0, 55.5], [30, 0, 55.5]]);
addBlocksToArea(area3, blockGeometrySmall, MATERIALS.blue, [[-30, 0, 55.5], [30, 0, 55.5]]);
addBlocksToArea(area4, blockGeometryLarge, MATERIALS.green, [[-67.5, 0, -80.5], [67.5, 0, -80.5]]);

render();

// Renderização
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
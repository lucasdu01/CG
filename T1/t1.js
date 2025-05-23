import * as THREE from "three";
import MATERIALS from "./components/materials.js";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { createWall } from "./components/walls.js";
import { createArea } from "./components/areas.js";
import { createGroundPlaneXZ } from "./components/groundPlane.js";
import { addBlockandStairToArea, addBlocksToArea, addStairToArea } from "./util.js";
import { areaGeometrySmall, areaGeometryLarge, blockGeometrySmall, blockGeometryLarge, wallGeometry, groundPlaneGeometry, block1area1Geometry } from "./components/geometries.js";
import { initRenderer, initCamera, initDefaultBasicLight, onWindowResize } from "../libs/util/util.js";
import KeyboardState from '../../libs/util/KeyboardState.js'

// Inicialização da cena e utilitárioss
const scene = new THREE.Scene();
const renderer = initRenderer();
initDefaultBasicLight(scene);
let keyboard = new KeyboardState();
window.addEventListener("resize", () => onWindowResize(camera, renderer), false);

// Main camera
let camPos  = new THREE.Vector3(0, 10, 20);
let camUp   = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 10.0, 20.0);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.copy(camPos);
   camera.up.copy( camUp );
   camera.lookAt(camLook);

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
addBlockandStairToArea(area1, [-30, -3.5, 60], Math.PI);
addBlockandStairToArea(area2, [30, -3.5, 60], Math.PI);
addBlockandStairToArea(area3, [0, -3.5, 60], Math.PI);
addBlockandStairToArea(area4, [0, -3.5, -85], 0);

render();

function keyboardUpdate() {  
   // DICA: Insira aqui seu código para mover a câmera
   keyboard.update(); 
      if ( keyboard.pressed("A") )     camPos.x -= 1;
      if ( keyboard.pressed("D") )    camPos.x += 1;
      if ( keyboard.pressed("SPACE") )       camPos.y += 10;
      if ( keyboard.pressed("CTRL") )     camPos.y -= 1;
      if ( keyboard.pressed("S") )   camPos.z += 1;
      if ( keyboard.pressed("W") ) camPos.z -= 1;

      // if (keyboard.pressed("W")) camera.lookAt(camLook.x += 1);
      // if (keyboard.pressed("S")) camera.lookAt(camLook.x -= 1);
      // if (keyboard.pressed("A")) camera.lookAt(camLook.z += 1);
      // if (keyboard.pressed("D")) camera.lookAt(camLook.z -= 1);
      // if (keyboard.pressed("Q")) camera.lookAt(camLook.y += 1);
      // if (keyboard.pressed("E")) camera.lookAt(camLook.y -= 1);
      camera.position.copy(camPos);
      //camera.lookAt(camLook);

   //updateCamera();
}

// Renderização
function render() {
  requestAnimationFrame(render);
  keyboardUpdate();
  renderer.render(scene, camera);
}
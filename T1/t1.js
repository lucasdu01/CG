import * as THREE from "three";
import { PointerLockControls } from '../build/jsm/controls/PointerLockControls.js'
import MATERIALS from "./components/materials.js";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { createWall } from "./components/walls.js";
import { createArea } from "./components/areas.js";
import { createGroundPlaneXZ } from "./components/groundPlane.js";
import { addBlockandStairToArea, addBlocksToArea, addStairToArea } from "./util.js";
import { areaGeometrySmall, areaGeometryLarge, blockGeometrySmall, blockGeometryLarge, wallGeometry, groundPlaneGeometry, block1area1Geometry } from "./components/geometries.js";
import { initRenderer, initCamera, initDefaultBasicLight, onWindowResize } from "../libs/util/util.js";
import KeyboardState from '../../libs/util/KeyboardState.js'

// Inicialização da cena e utilitários
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );
  document.body.appendChild( renderer.domElement );
initDefaultBasicLight(scene);
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

//Cria variáveis para movimento
let controls; //Utilizado para controle da câmera
let raycaster; //utilizado para colisão
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now(); //timer para sincronizar frames
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

//Define funcionamento dos controles
controls = new PointerLockControls(camera, document.body); //cria nova instância de controle
window.addEventListener('click', function () {
  controls.lock(); //ao clicar, trava o mouse para movimentar a câmera  
});

scene.add(controls.getObject()); //Adiciona o objeto de controles

//função acionada quando uma tecla for apertada
const onKeyDown = function(event) {
  switch (event.code) {
    case 'ArrowUp':
		case 'KeyW':
			moveForward = true;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = true;
			break;

		case 'ArrowDown':
		case 'KeyS':
			moveBackward = true;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = true;
			break;

		case 'Space':
			if ( canJump === true ) velocity.y += 350;
			canJump = false;
			break;
  }
};

//função acionada quando uma tecla for solta
const onKeyUp = function ( event ) {

switch ( event.code ) {

	case 'ArrowUp':
	case 'KeyW':
		moveForward = false;
		break;

	case 'ArrowLeft':
	case 'KeyA':
		moveLeft = false;
		break;

	case 'ArrowDown':
	case 'KeyS':
		moveBackward = false;
		break;

	case 'ArrowRight':
	case 'KeyD':
		moveRight = false;
		break;
	}
};

document.addEventListener('keydown', onKeyDown );
document.addEventListener('keyup', onKeyUp );

raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

const objects = [groundPlane, area1, area2, area3, area4];

//Animação
function animate() {

				const time = performance.now();

				if ( controls.isLocked === true ) {

					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;

					const intersections = raycaster.intersectObjects( objects, false );

					const onObject = intersections.length > 0;

					const delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveRight ) - Number( moveLeft );
					direction.normalize(); // this ensures consistent movements in all directions

					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

					if ( onObject === true ) {

						velocity.y = Math.max( 0, velocity.y );
						canJump = true;

					}

					controls.moveRight( - velocity.x * delta );
					controls.moveForward( - velocity.z * delta );

					controls.getObject().position.y += ( velocity.y * delta ); // new behavior

					if ( controls.getObject().position.y < 10 ) {

						velocity.y = 0;
						controls.getObject().position.y = 10;

						canJump = true;

					}

				}

				prevTime = time;

				renderer.render( scene, camera );

			}
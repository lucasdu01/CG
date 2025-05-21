import * as THREE from  'three';
import { createStaircaseWithCollision } from './staircaseComponent.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,} from "../libs/util/util.js";

let scene, renderer, camera, green, red, blue, purple, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 300, 30)); // Init camera in this position
green = new THREE.MeshStandardMaterial({ color: '#D1FFBD' });
red = new THREE.MeshStandardMaterial({ color: '#FF7F7F' });
blue = new THREE.MeshStandardMaterial({ color: '#90D5FF' });
purple = new THREE.MeshStandardMaterial({ color: '#A77BFF' });
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Grid helper
let gridHelper = new THREE.GridHelper( 500, 500 );
scene.add( gridHelper );

// create the ground plane
let planeBase = createGroundPlaneXZ(500, 500);
scene.add(planeBase);

// criando as paredes do plano
let wallUp = new THREE.Mesh(new THREE.PlaneGeometry(500, 50), new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide}));
wallUp.position.set(0.0, 25.0, -250.0);
scene.add(wallUp);

let wallDown = new THREE.Mesh(new THREE.PlaneGeometry(500, 50), new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide}));
wallDown.position.set(0.0, 25.0, 250.0);
scene.add(wallDown);

let wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(500, 50), new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide}));
wallLeft.position.set(-250.0, 25.0 ,0.0);
wallLeft.rotateY(Math.PI / 2);
scene.add(wallLeft);

let wallRight = new THREE.Mesh(new THREE.PlaneGeometry(500, 50), new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide}));
wallRight.position.set(250.0, 25.0 ,0.0);
wallRight.rotateY(Math.PI / 2);
scene.add(wallRight);

// create the three smaller areas
let areaGeometry = new THREE.BoxGeometry(100, 8, 100);
let area1 = new THREE.Mesh(areaGeometry, green); // area 1
let area2 = new THREE.Mesh(areaGeometry, red); // area 2
let area3 = new THREE.Mesh(areaGeometry, blue); // area 3
// create area 4
let areaGeometryLarge =new THREE.BoxGeometry(250, 8, 150);
let area4 = new THREE.Mesh(areaGeometryLarge, purple);
// position the areas
area1.position.set(-150.0, 4.0, 150.0);
area2.position.set(0.0, 4.0, 150.0);
area3.position.set(150.0, 4.0, 150.0);
area4.position.set(0.0, 4.0, -150.0);
// add the areas to the scene
scene.add(area1);
scene.add(area2);
scene.add(area3);
scene.add(area4);

//create stairs
const staircase1 = createStaircaseWithCollision({color: '#FFFF00'});
const staircase2 = createStaircaseWithCollision({color: '#FFFF00'});
const staircase3 = createStaircaseWithCollision({color: '#FFFF00'});
const staircase4 = createStaircaseWithCollision({color: '#FFFF00'});

//add staircases to the areas
area1.add(staircase1);
staircase1.position.set(0,-3.5,-60);
area2.add(staircase2);
staircase2.position.set(0,-3.5,-60);
area3.add(staircase3);
staircase3.position.set(0,-3.5,-60);
area4.add(staircase4);
staircase4.position.set(0,-3.5,85);
staircase4.rotateY(Math.PI);

// Blocos ao lado da escada das áreas 1 a 3
let blockGeometry = new THREE.BoxGeometry(40, 8, 11.5);
let blockMaterial = new THREE.MeshStandardMaterial({ color: '#12AF10' });
let blockLeft1 = new THREE.Mesh(blockGeometry, blockMaterial);
let blockRight1 = new THREE.Mesh(blockGeometry, blockMaterial);


// Posiciona os blocos
blockLeft1.position.set(-30, 0, -55.5);
blockRight1.position.set(30, 0, -55.5);

// Adiciona os blocos à área
area1.add(blockLeft1);
area1.add(blockRight1);

area2.add(blockLeft1.clone());
area2.add(blockRight1.clone());

area3.add(blockLeft1.clone());
area3.add(blockRight1.clone());

// Blocos ao lado da escada da área 4
let blockGeometry2 = new THREE.BoxGeometry(115, 8, 11.5);
let blockMaterial2 = new THREE.MeshStandardMaterial({ color: '#F67828' });
let blockLeft2 = new THREE.Mesh(blockGeometry2, blockMaterial2);
let blockRight2 = new THREE.Mesh(blockGeometry2, blockMaterial2);

// Posiciona os blocos
blockLeft2.position.set(-67.5, 0, 80.5);
blockRight2.position.set(67.5, 0, 80.5);

// Adiciona os blocos à área
area4.add(blockLeft2);
area4.add(blockRight2);

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
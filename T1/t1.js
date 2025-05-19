import * as THREE from  'three';
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
camera = initCamera(new THREE.Vector3(0, 500, 30)); // Init camera in this position
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
let areaGeometry = new THREE.BoxGeometry(100, 10, 100);
let area1 = new THREE.Mesh(areaGeometry, green); // area 1
let area2 = new THREE.Mesh(areaGeometry, red); // area 2
let area3 = new THREE.Mesh(areaGeometry, blue); // area 3
// create the area 4
let areaGeometryLarge =new THREE.BoxGeometry(250, 10, 150);
let area4 = new THREE.Mesh(areaGeometryLarge, purple);
// position the areas
area1.position.set(-150.0, 5.0, 150.0);
area2.position.set(0.0, 5.0, 150.0);
area3.position.set(150.0, 5.0, 150.0);
// posision the area 4
area4.position.set(0.0, 5.0, -150.0);
// add the areas to the scene
scene.add(area1);
scene.add(area2);
scene.add(area3);
scene.add(area4);



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
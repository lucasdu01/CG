import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
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

// create a cube
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cube = new THREE.Mesh(cubeGeometry, material);

// position the cube
cube.position.set(0.0, 2.0, 0.0);
// add the cube to the scene


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
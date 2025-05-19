import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        SecondaryBox,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,} from "../libs/util/util.js";

let scene, renderer, camera, green, light, orbit, keyboard; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
green = new THREE.MeshStandardMaterial({ color: '#D1FFBD' }); // create a green material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );


// create the ground plane
let planeBase = createGroundPlaneXZ(500, 500);
scene.add(planeBase);



// create the areas
let areaGeometry = new THREE.BoxGeometry(100, 10, 100);
let area1 = new THREE.Mesh(areaGeometry, green);

// position the area
area1.position.set(-110.0, 5.0, 130.0);
// add area1 to the scene
scene.add(area1);

// Camera positions
let camPos  = new THREE.Vector3(3, 4, 8);
let camUp   = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// First person camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy( camUp );
camera.lookAt(camLook);
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

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

function updateCamera()
{
   // DICA: Atualize a câmera aqui!

   message.changeMessage("Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " + 
                         "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}");
}

function keyboardUpdate() {

  keyboard.update();
   
  if ( keyboard.pressed("left") )     camPos.x -= 0.1;
  if ( keyboard.pressed("right") )    camPos.x += 0.1;
  if ( keyboard.pressed("up") )       camPos.y += 0.1;
  if ( keyboard.pressed("down") )     camPos.y -= 0.1;
  if ( keyboard.pressed("pageup") )   camPos.z += 0.1;
  if ( keyboard.pressed("pagedown") ) camPos.z -= 0.1;

  if (keyboard.pressed("W")) camera.lookAt(camLook.x += 0.1);
  if (keyboard.pressed("S")) camera.lookAt(camLook.x -= 0.1);
  if (keyboard.pressed("A")) camera.lookAt(camLook.z += 0.1);
  if (keyboard.pressed("D")) camera.lookAt(camLook.z -= 0.1);
  if (keyboard.pressed("Q")) camera.lookAt(camLook.y += 0.1);
  if (keyboard.pressed("E")) camera.lookAt(camLook.y -= 0.1);
   
  camera.position.copy(camPos);
  camera.lookAt(camLook);
   
  updateCamera();
}

function render()
{
  requestAnimationFrame(render);
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}

import * as THREE from "three";
import KeyboardState from '../libs/util/KeyboardState.js';

export function createFPSCamera(renderer, scene) {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  const pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  const yawObject = new THREE.Object3D();
  yawObject.position.set(0, 10, 20);
  yawObject.add(pitchObject);

  scene.add(yawObject);

  let isPointerLocked = false;
  const sensitivity = 0.002;
  const keyboard = new KeyboardState();

  // Mouse look
  document.body.addEventListener("click", () => {
    if (!isPointerLocked) {
      document.body.requestPointerLock();
    }
  });

  document.addEventListener("pointerlockchange", () => {
    isPointerLocked = document.pointerLockElement === document.body;
  });

  document.addEventListener("mousemove", (event) => {
    if (!isPointerLocked) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    yawObject.rotation.y -= movementX * sensitivity;
    pitchObject.rotation.x -= movementY * sensitivity;

    // Limita a rotação vertical
    pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitchObject.rotation.x));
  });

  // Movimentação
  function updateMovement() {
    keyboard.update();

    const moveSpeed = 0.4;
    const direction = new THREE.Vector3();

    if (keyboard.pressed("W")) direction.z -= 1;
    if (keyboard.pressed("S")) direction.z += 1;
    if (keyboard.pressed("A")) direction.x -= 1;
    if (keyboard.pressed("D")) direction.x += 1;
    if (keyboard.pressed("SPACE")) direction.y += 1;
    if (keyboard.pressed("CTRL")) direction.y -= 1;

    direction.normalize();
    direction.applyEuler(yawObject.rotation);
    yawObject.position.addScaledVector(direction, moveSpeed);
  }

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    camera,
    updateMovement
  };
}
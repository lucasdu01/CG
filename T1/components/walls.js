import * as THREE from "three";
import MATERIALS from "./materials.js";

export function createWall(geometry, material, position, rotationY = 0) {
  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(...position);
  wall.rotation.y = rotationY;
  return wall;
}
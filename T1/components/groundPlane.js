import * as THREE from "three";

export function createGroundPlaneXZ(geometry, material) {
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI / 2);
  return plane;
}
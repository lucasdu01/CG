import * as THREE from "three";

export function createBlock(geometry, material, position) {
  const block = new THREE.Mesh(geometry, material);
  block.position.set(...position);
  return block;
}
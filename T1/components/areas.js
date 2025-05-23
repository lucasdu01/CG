import * as THREE from "three";

export function createArea(geometry, material, position) {
  const area = new THREE.Mesh(geometry, material);
  area.position.set(...position);
  return area;
}
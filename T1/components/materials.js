import * as THREE from "three";

const MATERIALS = {
  green:        new THREE.MeshStandardMaterial({ color: "#0e580e" }),
  lightgreen:   new THREE.MeshStandardMaterial({ color: "#90ee90" }),
  red:          new THREE.MeshStandardMaterial({ color: "#FF7F7F" }),
  blue:         new THREE.MeshStandardMaterial({ color: "#90D5FF" }),
  wall:         new THREE.MeshStandardMaterial({ color: "#daa520" }),
  groundPlane:  new THREE.MeshStandardMaterial({ color: "#f7e6a2" }),
};

export default MATERIALS;
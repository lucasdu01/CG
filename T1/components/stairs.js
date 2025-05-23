import * as THREE from "three";

export function createStair({
  stepCount = 8,
  stepWidth = 20,
  stepHeight = 1,
  stepDepth = 2.5,
  color = "",
  material = new THREE.MeshStandardMaterial({ color:color }),
}) {
  const group = new THREE.Group();

  // Create the visual steps
  for (let i = 0; i < stepCount; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth),
      material
    );

    step.position.y = i * stepHeight;
    step.position.z = i * stepDepth / 2;

    group.add(step);
  }

  return group;
}

import * as THREE from 'three';
import { createStair } from "./components/stairs.js";
import { createBlock } from "./components/blocks.js";

export function addStairToArea(area, position, rotationY = 0) {
  const stair = createStair({ color: "#FFFFFF" });
  area.add(stair);
  stair.position.set(...position);
  stair.rotation.y = rotationY;
}

export function addBlocksToArea(area, blockGeometry, blockMaterial, positions) {
  positions.forEach(pos => {
    area.add(createBlock(blockGeometry, blockMaterial, pos));
  });
}

export function addBlockandStairToArea(area, position, rotationY = 0) {
  // Cria e adiciona a escada
  const stair = createStair({ color: "#FFFFFF" });
  area.add(stair);
  stair.position.set(...position);
  stair.rotation.y = rotationY;
  const blockMaterial = new THREE.MeshStandardMaterial({ color: area.material.color.getHex() });

  // Obtém tamanho da area
  area.geometry.computeBoundingBox();
  const areaBox = area.geometry.boundingBox;
  const areaWidth = areaBox.max.x - areaBox.min.x;

  // Obtém tamanho da escada (assume que é um Group de BoxGeometry)
  const stairBox = new THREE.Box3().setFromObject(stair);
  const stairWidth = stairBox.max.x - stairBox.min.x;
  const stairHeight = stairBox.max.y - stairBox.min.y;
  const stairDepth = stairBox.max.z - stairBox.min.z;
  const stairCenterZ = (stairBox.min.z + stairBox.max.z) / 2;

  // Calcula espaço disponível à esquerda e à direita da escada
  const leftSpace = (position[0] - stairWidth / 2) - (areaBox.min.x);
  const rightSpace = (areaBox.max.x) - (position[0] + stairWidth / 2);

  // Cria blocos para cada lado, se houver espaço
  const blockHeight = stairHeight;
  const blockDepth = stairDepth;
  const blockY = 0;
  const blockZ = stairCenterZ;
  // Bloco a esquerda
  if (leftSpace > 0) {
    const leftBlockWidth = leftSpace;
    const leftBlockGeometry = new THREE.BoxGeometry(leftBlockWidth, blockHeight, blockDepth);
    const leftBlock = createBlock(leftBlockGeometry, blockMaterial, [areaBox.min.x + leftBlockWidth / 2, blockY, blockZ]);
    area.add(leftBlock);
  }

  // Bloco a direita
  if (rightSpace > 0) {
    const rightBlockWidth = rightSpace;
    const rightBlockGeometry = new THREE.BoxGeometry(rightBlockWidth, blockHeight, blockDepth);
    const rightBlock = createBlock(rightBlockGeometry, blockMaterial, [areaBox.max.x - rightBlockWidth / 2, blockY, blockZ]);
    area.add(rightBlock);
  }
}
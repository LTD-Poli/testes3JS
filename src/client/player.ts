import * as THREE from 'three';

export const player = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
player.name = 'player';
export const playerMoveSpeed = 0.5;

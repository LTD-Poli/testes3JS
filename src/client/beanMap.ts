import * as THREE from "three";

const beanMap = new THREE.TextureLoader().load("bean.png");
const beanSpriteMaterial = new THREE.SpriteMaterial({
    map: beanMap,
    color: 0xffffff,
});
export const bean = new THREE.Sprite(beanSpriteMaterial);

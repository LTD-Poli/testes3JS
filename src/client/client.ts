import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { GUI } from 'dat.gui'
import { SphereGeometry, TetrahedronGeometry, Vector3 } from "three";
import { camera } from "./camera";
import { player, playerMoveSpeed } from "./player";
import { Consts } from "./constants";
import { bean } from "./beanMap";
// import { schedulingPolicy, SCHED_NONE } from 'cluster'

const scene = new THREE.Scene();
scene.add(player);

const stats = Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 1, window.innerHeight - 1);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const boxGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();

const sceneMeshes: THREE.Mesh[] = [];

initEnemies();

function animate() {
  requestAnimationFrame(animate);

  verifyShootAction();

  verifyCollisions();

  moveEnemys();

  render();

  stats.update();
}
animate();

function verifyShootAction() {
  if (shooted) {
    bean.position.y = bean.position.y + Consts.beanVelocity;

    if (bean.position.y > 10) {
      shooted = false;
      scene.remove(bean);
    }
  }
}

function render() {
  renderer.render(scene, camera);
}

function shoot() {
  scene.add(bean);

  bean.position.x = player.position.x;
  bean.position.y = player.position.y;
  bean.position.z = player.position.z;

  shooted = true;
}

const raycasterY = new THREE.Raycaster();
var intersectsY: THREE.Intersection[] = [];

const raycasterX = new THREE.Raycaster();
var intersectsX: THREE.Intersection[] = [];

var shooted = false;
function verifyCollisions() {
  if (shooted) {
    raycasterY.set(bean.position, new THREE.Vector3(0, 1, 0).normalize());
    intersectsY = raycasterY.intersectObjects(sceneMeshes, false);

    raycasterX.set(bean.position, new THREE.Vector3(1, 0, 0).normalize());
    intersectsX = raycasterX.intersectObjects(sceneMeshes, false);

    if (intersectsY.length > 0) {
      if (intersectsY[0].distance < 0.3) {
        for (let index = 0; index < sceneMeshes.length; index++) {
          if (intersectsY[0].object.uuid === sceneMeshes[index].uuid) {
            scene.remove(sceneMeshes[index], bean);
            sceneMeshes.splice(index, 1);
          }
        }

        shooted = false;
      }
    }
  }
}

function initEnemies() {
  for (let r = 0; r < Consts.totalRowEnemys; r++) {
    for (let c = 0; c < Consts.totalColumnEnemys; c++) {
      const enemy = new THREE.Mesh(boxGeometry, material);
      enemy.name = "enemy" + r + c;
      enemy.position.x = Consts.leftBound + 2 * c;
      enemy.position.y = 5 + 2 * r;
      sceneMeshes.push(enemy);
      scene.add(enemy);
    }
  }
}

var orientation = "left";
var change = true;

function moveEnemys() {
  for (let i = 0; i < sceneMeshes.length; i++) {
    if (sceneMeshes[i].position.x < Consts.leftBound) {
      change = true;
      break;
    }

    if (sceneMeshes[i].position.x > Consts.rightBound) {
      change = false;
      break;
    }
  }

  for (let i = 0; i < sceneMeshes.length; i++) {
    if (change) {
      sceneMeshes[i].position.x = sceneMeshes[i].position.x + Consts.enemyMoveSpeed;
    } else {
      sceneMeshes[i].position.x = sceneMeshes[i].position.x - Consts.enemyMoveSpeed;
    }
  }
}

// LISTENERS
window.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    if (!shooted) {
      shoot();
    }
  }

  if (event.key === "d") {
    player.position.x = player.position.x + playerMoveSpeed;
  }

  if (event.key === "a") {
    player.position.x = player.position.x - playerMoveSpeed;
  }
});

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

console.log("SCRIPT LOADED");
console.log("GLTFLoader =", GLTFLoader);

let scene, camera, renderer, model, fans = [];
const FAN_AXIS = new THREE.Vector3(1, 0, 0);
// fan rotation settings (modifiable at runtime)
let fanSpeed = 0; // 0 stops fans
let fanAxis = 'x'; // 'x' | 'y' | 'z'

// Camera controls
const controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  moveDown: false,
  isMouseDown: false,
  previousMousePosition: { x: 0, y: 0 },
  euler: new THREE.Euler(0, 0, 0, 'YXZ'),
  PI_2: Math.PI / 2
};

const moveSpeed = 0.1;
const rotateSpeed = 0.005;

init();
animate();

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
    camera.position.set(0, 3, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1.5);
  dir.position.set(5, 10, 7);
  scene.add(dir);

  const loader = new GLTFLoader();
  loader.load(
    './ARVR_Project.gltf',
    (gltf) => {
      console.log("MODEL LOADED:", gltf);

      model = gltf.scene;
      model.scale.set(3, 3, 3);
      model.position.set(0, 0, 0);

      scene.add(model);
        // Find all fan objects in the model
        model.traverse((child) => {
          if (child.name && (child.name.toLowerCase().includes('fan') || child.name.toLowerCase().includes('propeller'))) {
            fans.push(child);
            console.log("Found fan:", child.name);
          }
        });
        console.log("Total fans found:", fans.length);
    },
    (progress) => {
      console.log(`LOADING: ${(progress.loaded / progress.total) * 100}%`);
    },
    (error) => {
      console.error("MODEL LOAD ERROR:", error);
    }
  );

  // Keyboard events
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Mouse events
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onMouseWheel);
  renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

  // Resize event
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  switch (e.code) {
    case 'KeyW':
      controls.moveForward = true;
      break;
    case 'KeyS':
      controls.moveBackward = true;
      break;
    case 'KeyA':
      controls.moveLeft = true;
      break;
    case 'KeyD':
      controls.moveRight = true;
      break;
    case 'Space':
      controls.moveUp = true;
      e.preventDefault();
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      controls.moveDown = true;
      break;
    case 'KeyF':
      // Cycle fan axis
      if (fanAxis === 'x') fanAxis = 'y';
      else if (fanAxis === 'y') fanAxis = 'z';
      else fanAxis = 'x';
      console.log('Fan axis set to', fanAxis);
      break;
    case 'BracketRight':
      // increase fan speed
      fanSpeed = Math.min(fanSpeed + 0.01, 1);
      console.log('Fan speed:', fanSpeed.toFixed(3));
      break;
    case 'BracketLeft':
      // decrease fan speed
      fanSpeed = Math.max(fanSpeed - 0.01, 0);
      console.log('Fan speed:', fanSpeed.toFixed(3));
      break;
  }
}

function onKeyUp(e) {
  switch (e.code) {
    case 'KeyW':
      controls.moveForward = false;
      break;
    case 'KeyS':
      controls.moveBackward = false;
      break;
    case 'KeyA':
      controls.moveLeft = false;
      break;
    case 'KeyD':
      controls.moveRight = false;
      break;
    case 'Space':
      controls.moveUp = false;
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      controls.moveDown = false;
      break;
  }
}

function onMouseDown(e) {
  controls.isMouseDown = true;
  controls.previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e) {
  if (!controls.isMouseDown) return;

  const deltaX = e.clientX - controls.previousMousePosition.x;
  const deltaY = e.clientY - controls.previousMousePosition.y;

  // apply mouse rotation to camera using Euler angles (yaw, pitch)
  controls.euler.setFromQuaternion(camera.quaternion);
  controls.euler.y -= deltaX * rotateSpeed; // yaw
  controls.euler.x -= deltaY * rotateSpeed; // pitch
  // clamp pitch to avoid flipping
  controls.euler.x = Math.max(-controls.PI_2 + 0.01, Math.min(controls.PI_2 - 0.01, controls.euler.x));
  camera.quaternion.setFromEuler(controls.euler);

  controls.previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseUp(e) {
  controls.isMouseDown = false;
}
  function onMouseWheel(e) {
    e.preventDefault();
    const zoomSpeed = 0.5;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
  
    if (e.deltaY > 0) {
      // Zoom out
      camera.position.addScaledVector(direction, zoomSpeed);
    } else {
      // Zoom in
      camera.position.addScaledVector(direction, -zoomSpeed);
    }
  }

function animate() {
  requestAnimationFrame(animate);

  // Handle camera movement
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  camera.getWorldDirection(forward);
  right.crossVectors(forward, up).normalize();
  forward.normalize();

  if (controls.moveForward) camera.position.addScaledVector(forward, moveSpeed);
  if (controls.moveBackward) camera.position.addScaledVector(forward, -moveSpeed);
  if (controls.moveLeft) camera.position.addScaledVector(right, -moveSpeed);
  if (controls.moveRight) camera.position.addScaledVector(right, moveSpeed);
  if (controls.moveUp) camera.position.y += moveSpeed;
  if (controls.moveDown) camera.position.y -= moveSpeed;

    // Rotate all fans around the selected local axis
    fans.forEach((fan) => {
      if (fanAxis === 'x') fan.rotateX(fanSpeed);
      else if (fanAxis === 'y') fan.rotateY(fanSpeed);
      else if (fanAxis === 'z') fan.rotateZ(fanSpeed);
    });

    renderer.render(scene, camera);
}
import "./style.css";
import * as Three from "three";
import Fragment from "./shaders/fragment.glsl";
import Vertex from "./shaders/vertex.glsl";
import { uniform, uniforms } from "three/tsl";
import { Vector2 } from "three/webgpu";
import { easing } from "maath";
import { GetSceneBounds } from "./utils/index.js";

console.clear();

const TextContainer = document.getElementById("text-container");
const TextCanvas = TextContainer.querySelector("canvas");

let EaseFactor = 0.02;
const CurrentMouse = new Three.Vector2(0.5, 0.5);
const PrevMouse = new Three.Vector2(0.5, 0.5);
const TargetMouse = new Vector2(0.5, 0.5);

const scene = new Three.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new Three.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

camera.position.z = 0.1;

const renderer = new Three.WebGLRenderer({
  canvas: TextCanvas,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

const Uniforms = {
  u_mouse: { type: "v2", value: new Vector2() },
  u_prevmouse: { type: "v2", value: new Vector2() },
  u_aspect: { type: "f", value: innerWidth / innerHeight },
  u_texture: { value: LoadTexture() },
  time: { type: "f", value: 0 },
};

const SceneBounds = GetSceneBounds(camera, renderer);
let geometry = new Three.PlaneGeometry(SceneBounds.width, SceneBounds.height);
const material = new Three.ShaderMaterial({
  vertexShader: Vertex,
  fragmentShader: Fragment,
  uniforms: Uniforms,
});
// const material = new Three.MeshBasicMaterial({color:'red'})
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

const clock = new Three.Clock();

function animate() {
  if(!cube.geometry) return;
  const deltaTime = clock.getDelta(); // Calculate delta time using Three.js Clock

  material.uniforms.time.value += deltaTime; // Update time uniform with delta time

  CurrentMouse.x += (TargetMouse.x - CurrentMouse.x) * EaseFactor;
  CurrentMouse.y += (TargetMouse.y - CurrentMouse.y) * EaseFactor;
  // easing.damp(CurrentMouse,'x',TargetMouse.x,.2,deltaTime * 1.4)

  Uniforms.u_mouse.value.set(CurrentMouse.x, 1 - CurrentMouse.y);
  Uniforms.u_prevmouse.value.set(PrevMouse.x, 1 - PrevMouse.y);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

function getDistance(vec1, vec2) {
  return Math.sqrt(Math.pow(vec2.x - vec1.x, 2) + Math.pow(vec2.y - vec1.y, 2));
}
function LoadTexture() {
  const CANVAS = document.createElement("canvas");
  let Rect = TextCanvas.getBoundingClientRect();
  CANVAS.width = Rect.width * 2;
  CANVAS.height = Rect.height * 2;

  const ctx = CANVAS.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  let Size = innerWidth / 3;
  ctx.font = `bold ${Size}px Blanquotey`; // Set font style and size
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; // Change to 'middle' for better vertical alignment
  ctx.fillStyle = "#111"; // Set fill color for text
  ctx.fillText("AQUA", CANVAS.width / 2, CANVAS.height / 2); // Draw filled text

  // Create a crisp image by using image smoothing
  const imageData = ctx.getImageData(0, 0, CANVAS.width, CANVAS.height);
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
  ctx.putImageData(imageData, 0, 0);

  return new Three.CanvasTexture(CANVAS);
}
LoadTexture();

function HandleMouseMove(e) {
  let MoveOffset = getDistance(CurrentMouse, PrevMouse) / 3;
  // EaseFactor = Math.max(MoveOffset,.04)
  EaseFactor = 0.04;

  PrevMouse.x = TargetMouse.x;
  PrevMouse.y = TargetMouse.y;

  const Rect = TextCanvas.getBoundingClientRect();
  const x = (e.clientX - Rect.left) / Rect.width;
  const y = (e.clientY - Rect.top) / Rect.height;

  TargetMouse.set(x, y);
}

function HandleMouseEnter(e) {
  EaseFactor = 0.02;
  const Rect = TextCanvas.getBoundingClientRect();
  const x = (e.clientX - Rect.left) / Rect.width;
  const y = (e.clientY - Rect.top) / Rect.height;

  TargetMouse.x = CurrentMouse.x = x;
  TargetMouse.y = CurrentMouse.y = y;
}

function HandleMouseLeave(e) {
  EaseFactor = 0.08;
  const Rect = TextCanvas.getBoundingClientRect();
  const x = (e.clientX - Rect.left) / Rect.width;
  const y = (e.clientY - Rect.top) / Rect.height;

  TargetMouse.x = x;
  TargetMouse.y = y;
}
function HandleResize(e) {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  // Dispose of the old geometry
  cube.geometry.dispose();
  cube.geometry = null

  const SceneBounds = GetSceneBounds(camera,renderer)
  // Create new geometry with updated dimensions
  cube.geometry = new Three.PlaneGeometry(
    SceneBounds.width,
    SceneBounds.height
  );
  TextCanvas.width = innerWidth
  TextCanvas.height = innerHeight
  const Texture = LoadTexture();
  Uniforms.u_texture.value = Texture;
  Uniforms.u_aspect.value = innerWidth/innerHeight
}

TextCanvas.addEventListener("mouseenter", HandleMouseEnter);
TextCanvas.addEventListener("mousemove", HandleMouseMove);
TextCanvas.addEventListener("mouseleave", HandleMouseLeave);
window.addEventListener("resize", HandleResize);

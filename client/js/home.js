import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.getElementById("scene-canvas");
if (canvas) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, canvas.clientWidth / canvas.clientHeight, .1, 100);
    camera.position.set(0, .1, 6.2);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0x8bbcff, 1.7));
    const key = new THREE.PointLight(0x52e5e8, 15, 8); key.position.set(2, 2, 3); scene.add(key);
    const rim = new THREE.PointLight(0x9c7cff, 12, 8); rim.position.set(-3, -1, 2); scene.add(rim);
    const card = new THREE.Mesh(new THREE.BoxGeometry(3.3, 2.15, .07), new THREE.MeshPhysicalMaterial({ color: 0x123052, metalness: .35, roughness: .25, clearcoat: .8, emissive: 0x061629, emissiveIntensity: .7 }));
    group.add(card);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(card.geometry), new THREE.LineBasicMaterial({ color: 0x52e5e8, transparent: true, opacity: .9 })); group.add(edge);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25, .012, 8, 96), new THREE.MeshBasicMaterial({ color: 0x52e5e8, transparent: true, opacity: .5 })); ring.rotation.x = 1.1; group.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.78, .01, 8, 96), new THREE.MeshBasicMaterial({ color: 0x9c7cff, transparent: true, opacity: .38 })); ring2.rotation.x = .7; ring2.rotation.y = .5; group.add(ring2);
    const points = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0x91ffff, size: .035, transparent: true, opacity: .85 }));
    const positions = []; for (let index = 0; index < 180; index += 1) { const angle = Math.random() * Math.PI * 2; const radius = 2.1 + Math.random() * 1.2; positions.push(Math.cos(angle) * radius, (Math.random() - .5) * 2.7, Math.sin(angle) * radius * .45); } points.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); scene.add(points);
    let targetX = 0, targetY = 0; window.addEventListener("pointermove", event => { targetX = (event.clientX / window.innerWidth - .5) * .35; targetY = (event.clientY / window.innerHeight - .5) * .2; }, { passive: true });
    function resize() { const width = canvas.clientWidth, height = canvas.clientHeight; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); } window.addEventListener("resize", resize);
    function animate() { requestAnimationFrame(animate); group.rotation.y += (targetX - group.rotation.y) * .025; group.rotation.x += (-targetY - group.rotation.x) * .025; card.position.y = Math.sin(Date.now() * .001) * .06; ring.rotation.z += .002; ring2.rotation.z -= .001; points.rotation.y += .0007; renderer.render(scene, camera); } animate();
  } catch (error) { canvas.parentElement.classList.add("scene-fallback"); }
}

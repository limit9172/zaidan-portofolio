import * as THREE from 'three';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010101);
scene.fog = new THREE.FogExp2(0x010101, 0.0005);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('space-canvas'), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const starCount = 3000;
const starGeo = new THREE.BufferGeometry();
const starPos = [];

for (let i = 0; i < starCount; i++) {
    starPos.push((Math.random() - 0.5) * 800);
    starPos.push((Math.random() - 0.5) * 500);
    starPos.push((Math.random() - 0.5) * 150 - 50);
}

starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos), 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

const starGeo2 = new THREE.BufferGeometry();
const starPos2 = [];
for (let i = 0; i < 1500; i++) {
    starPos2.push((Math.random() - 0.5) * 1200);
    starPos2.push((Math.random() - 0.5) * 800);
    starPos2.push((Math.random() - 0.5) * 300 - 100);
}
starGeo2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos2), 3));
const starMat2 = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.12, transparent: true, opacity: 0.5 });
const stars2 = new THREE.Points(starGeo2, starMat2);
scene.add(stars2);

// central object (planet-like)
const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
const coreMat = new THREE.MeshStandardMaterial({ color: 0xcc5533, emissive: 0x331100, roughness: 0.3, metalness: 0.1 });
const core = new THREE.Mesh(coreGeo, coreMat);
core.position.set(0, -0.5, -3);
scene.add(core);

// ring around core
const ringGeo = new THREE.TorusGeometry(1.8, 0.06, 64, 300);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xff6644, emissive: 0x441100 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
ring.rotation.z = 0.5;
core.add(ring);

// particle ring
const particleCount = 800;
const particleGeo = new THREE.BufferGeometry();
const particlePos = [];
for (let i = 0; i < particleCount; i++) {
    const radius = 2.4 + Math.random() * 0.5;
    const angle = Math.random() * Math.PI * 2;
    particlePos.push(Math.cos(angle) * radius);
    particlePos.push((Math.random() - 0.5) * 0.3);
    particlePos.push(Math.sin(angle) * radius);
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePos), 3));
const particleMat = new THREE.PointsMaterial({ color: 0xff8866, size: 0.04, transparent: true });
const particles = new THREE.Points(particleGeo, particleMat);
core.add(particles);

const rockCount = 400;
const rockGeo = new THREE.BufferGeometry();
const rockPos = [];
for (let i = 0; i < rockCount; i++) {
    const rad = 3 + Math.random() * 1.5;
    const ang = Math.random() * Math.PI * 2;
    rockPos.push(Math.cos(ang) * rad);
    rockPos.push((Math.random() - 0.5) * 2);
    rockPos.push(Math.sin(ang) * rad - 1);
}
rockGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rockPos), 3));
const rockMat = new THREE.PointsMaterial({ color: 0xaa8866, size: 0.05 });
const rocks = new THREE.Points(rockGeo, rockMat);
scene.add(rocks);

const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);
const mainLight = new THREE.PointLight(0xff8866, 1);
mainLight.position.set(2, 3, 4);
scene.add(mainLight);
const backLight = new THREE.PointLight(0x4466ff, 0.5);
backLight.position.set(-2, 1, -5);
scene.add(backLight);

let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    stars.rotation.y += 0.0003;
    stars.rotation.x += 0.0002;
    stars2.rotation.y -= 0.0002;
  
    core.rotation.y = time * 0.3;
    core.rotation.x = Math.sin(time * 0.2) * 0.1;

    ring.rotation.z += 0.008;

    particles.rotation.y += 0.01;
    particles.rotation.x = Math.sin(time * 0.5) * 0.1;

    rocks.rotation.y += 0.002;
    rocks.rotation.x += 0.001;
    
    camera.position.x += (0 - camera.position.x) * 0.02;
    camera.position.y += (0 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -2);
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

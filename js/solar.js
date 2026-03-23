import * as THREE from 'three';

// ambil canvas
const canvas = document.getElementById('solar-canvas');
if (!canvas) {
    console.error('Canvas tidak ditemukan');
} else {
    console.log('Canvas ditemukan');
}

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020210);
scene.fog = new THREE.FogExp2(0x020210, 0.0003);

// camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 18);
camera.lookAt(0, 0, 0);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ============= STARS =============
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const starPositions = [];
for (let i = 0; i < starCount; i++) {
    starPositions.push((Math.random() - 0.5) * 600);
    starPositions.push((Math.random() - 0.5) * 400);
    starPositions.push((Math.random() - 0.5) * 150 - 80);
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions), 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ============= SUN =============
const sunGeometry = new THREE.SphereGeometry(1.4, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa66,
    emissive: 0xff4422,
    emissiveIntensity: 0.9,
    metalness: 0.1,
    roughness: 0.3
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// sun glow
const glowGeometry = new THREE.SphereGeometry(1.7, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8844,
    transparent: true,
    opacity: 0.15
});
const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
sun.add(sunGlow);

// ============= PLANETS =============
const planetsData = [
    { color: 0xcc8866, size: 0.22, distance: 2.8, speed: 0.022, name: 'mercury' },
    { color: 0xdd9966, size: 0.28, distance: 3.7, speed: 0.016, name: 'venus' },
    { color: 0x66aaff, size: 0.32, distance: 4.6, speed: 0.013, name: 'earth' },
    { color: 0xcc6644, size: 0.28, distance: 5.5, speed: 0.011, name: 'mars' },
    { color: 0xccaa88, size: 0.58, distance: 7.0, speed: 0.007, name: 'jupiter' },
    { color: 0xeedd99, size: 0.52, distance: 8.5, speed: 0.005, name: 'saturn' }
];

const planets = [];
const angles = planetsData.map(() => Math.random() * Math.PI * 2);

planetsData.forEach((p, i) => {
    const geometry = new THREE.SphereGeometry(p.size, 64, 64);
    const material = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.4 });
    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet);
    
    // orbit line
    const orbitPoints = [];
    for (let j = 0; j <= 120; j++) {
        const angle = (j / 120) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(angle) * p.distance, 0, Math.sin(angle) * p.distance));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x4488aa });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbit);
    
    planets.push({
        mesh: planet,
        distance: p.distance,
        speed: p.speed,
        angle: angles[i]
    });
});

// saturn ring
const ringGeometry = new THREE.TorusGeometry(0.9, 0.08, 32, 100);
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xddbb99 });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
planets[5].mesh.add(ring);

// ============= LIGHTS =============
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffaa66, 1.4);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x88aaff, 0.4);
fillLight.position.set(1, 2, 1);
scene.add(fillLight);

const backLight = new THREE.PointLight(0x4488aa, 0.3);
backLight.position.set(-2, 1, -5);
scene.add(backLight);

// ============= ANIMATION =============
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // update planet positions
    planets.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.distance;
    });
    
    // rotate sun
    sun.rotation.y += 0.008;
    
    // rotate stars
    stars.rotation.y += 0.0003;
    stars.rotation.x += 0.0001;
    
    // camera movement based on scroll
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    
    const targetX = percent * 4;
    const targetY = percent * 1.5;
    const targetZ = 18 - percent * 5;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('✅ NASA-style solar system loaded');

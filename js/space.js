import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010101);
scene.fog = new THREE.FogExp2(0x010101, 0.0003);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 18);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solar-canvas'), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const starCount = 4000;
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for (let i = 0; i < starCount; i++) {
    starPos.push((Math.random() - 0.5) * 1000);
    starPos.push((Math.random() - 0.5) * 600);
    starPos.push((Math.random() - 0.5) * 200 - 80);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos), 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

const sunGeo = new THREE.SphereGeometry(1.5, 64, 64);
const sunMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0xff4411, emissiveIntensity: 0.8 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const sunGlowGeo = new THREE.SphereGeometry(1.8, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.2 });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sun.add(sunGlow);

const planets = [
    { size: 0.25, distance: 2.8, speed: 0.02, color: 0xaa8866 },
    { size: 0.35, distance: 3.8, speed: 0.012, color: 0xccaa88 },
    { size: 0.4, distance: 4.8, speed: 0.01, color: 0x66aaff },
    { size: 0.35, distance: 5.8, speed: 0.008, color: 0xcc6644 },
    { size: 0.8, distance: 7.5, speed: 0.005, color: 0xccaa88 },
    { size: 0.7, distance: 9, speed: 0.004, color: 0xeeddbb }
];

const planetMeshes = [];
const planetAngles = planets.map(() => Math.random() * Math.PI * 2);

planets.forEach((p, i) => {
    const geo = new THREE.SphereGeometry(p.size, 48, 48);
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.5 });
    const planet = new THREE.Mesh(geo, mat);
    scene.add(planet);
    
    const orbitPoints = [];
    for (let j = 0; j <= 128; j++) {
        const angle = (j / 128) * Math.PI * 2;
        const x = Math.cos(angle) * p.distance;
        const z = Math.sin(angle) * p.distance;
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x333333 });
    const orbit = new THREE.LineLoop(orbitGeo, orbitMat);
    scene.add(orbit);
    
    planetMeshes.push({ mesh: planet, distance: p.distance, speed: p.speed, angle: planetAngles[i] });
});


const saturnRingGeo = new THREE.TorusGeometry(0.95, 0.08, 32, 100);
const saturnRingMat = new THREE.MeshStandardMaterial({ color: 0xccaa88 });
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
saturnRing.rotation.x = Math.PI / 2;
planetMeshes[5].mesh.add(saturnRing);

const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);
const sunLight = new THREE.PointLight(0xffaa66, 1.5);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(1, 2, 1);
scene.add(fillLight);

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.016;
    
    planetMeshes.forEach(p => {
        p.angle += p.speed;
        const x = Math.cos(p.angle) * p.distance;
        const z = Math.sin(p.angle) * p.distance;
        p.mesh.position.set(x, 0, z);
    });
    
    sun.rotation.y += 0.005;
    stars.rotation.y += 0.0002;
    
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const targetX = scrollPercent * 5;
    const targetY = scrollPercent * 2;
    const targetZoom = 14 - scrollPercent * 6;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZoom - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

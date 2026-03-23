import * as THREE from 'three';

// setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010101);
scene.fog = new THREE.FogExp2(0x010101, 0.0003);

// camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solar-canvas'), alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// stars
const starCount = 2000;
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for (let i = 0; i < starCount; i++) {
    starPos.push((Math.random() - 0.5) * 800);
    starPos.push((Math.random() - 0.5) * 500);
    starPos.push((Math.random() - 0.5) * 150 - 50);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos), 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// sun (center)
const sunGeo = new THREE.SphereGeometry(1.2, 64, 64);
const sunMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0xff4411 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// planets data
const planetsData = [
    { color: 0xaa8866, size: 0.25, distance: 2.5, speed: 0.02 },
    { color: 0xccaa88, size: 0.3, distance: 3.5, speed: 0.015 },
    { color: 0x66aaff, size: 0.35, distance: 4.5, speed: 0.012 },
    { color: 0xcc6644, size: 0.3, distance: 5.5, speed: 0.01 },
    { color: 0xccaa88, size: 0.6, distance: 7, speed: 0.007 },
    { color: 0xeeddbb, size: 0.55, distance: 8.5, speed: 0.005 }
];

const planets = [];
const angles = planetsData.map(() => Math.random() * Math.PI * 2);

planetsData.forEach((p, i) => {
    const geo = new THREE.SphereGeometry(p.size, 48, 48);
    const mat = new THREE.MeshStandardMaterial({ color: p.color });
    const planet = new THREE.Mesh(geo, mat);
    scene.add(planet);
    
    // orbit line
    const orbitPoints = [];
    for (let j = 0; j <= 100; j++) {
        const angle = (j / 100) * Math.PI * 2;
        const x = Math.cos(angle) * p.distance;
        const z = Math.sin(angle) * p.distance;
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x333333 });
    const orbit = new THREE.LineLoop(orbitGeo, orbitMat);
    scene.add(orbit);
    
    planets.push({ mesh: planet, distance: p.distance, speed: p.speed, angle: angles[i] });
});

// lights
const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);
const sunLight = new THREE.PointLight(0xffaa66, 1.2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// animation
let scrollTarget = 0;

function animate() {
    requestAnimationFrame(animate);
    
    // update planets position
    planets.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.distance;
    });
    
    // rotate sun
    sun.rotation.y += 0.01;
    
    stars.rotation.y += 0.0005;
    
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollTarget = scrollPercent * 5;
    camera.position.x += (scrollTarget - camera.position.x) * 0.05;
    camera.position.z = 14 - scrollPercent * 4;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('Solar system loaded');

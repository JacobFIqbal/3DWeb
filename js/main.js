import * as THREE from 'three';

// Scene setup
const canvas = document.getElementById('sphere-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});

renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 3.5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff00ff, 2, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ffff, 2, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Create glossy sphere
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.95,
    envMapIntensity: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Create neon line patterns
const neonLines = [];
const neonColors = [
    new THREE.Color(0xff00ff), // Magenta
    new THREE.Color(0xff0080), // Pink
    new THREE.Color(0x0080ff), // Blue
    new THREE.Color(0x00ffff), // Cyan
];

// Function to create flowing organic curves
function createNeonCurve(index, totalCurves) {
    const points = [];
    const segments = 100;
    const radius = 1.52; // Slightly larger than sphere

    // Create organic, flowing path
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;

        // Add multiple sine waves for organic flow
        const wave1 = Math.sin(angle * 3 + index * 0.5) * 0.3;
        const wave2 = Math.cos(angle * 2 - index * 0.3) * 0.2;
        const offset = wave1 + wave2;

        // Create spiral path around sphere
        const lat = Math.sin(angle + offset) * Math.PI * 0.8;
        const lon = angle + Math.sin(t * Math.PI) * 0.5;

        const x = radius * Math.cos(lat) * Math.cos(lon);
        const y = radius * Math.cos(lat) * Math.sin(lon);
        const z = radius * Math.sin(lat);

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    const geometry = new THREE.TubeGeometry(curve, segments, 0.01, 8, true);

    // Animate color transition
    const colorIndex = index % neonColors.length;
    const material = new THREE.MeshBasicMaterial({
        color: neonColors[colorIndex],
        transparent: true,
        opacity: 0.9,
    });

    const line = new THREE.Mesh(geometry, material);
    scene.add(line);

    return {
        mesh: line,
        colorIndex: colorIndex,
        rotationOffset: index * 0.1,
        curve: curve
    };
}

// Create multiple neon curves
const curveCount = 12;
for (let i = 0; i < curveCount; i++) {
    neonLines.push(createNeonCurve(i, curveCount));
}

// Scroll tracking
let lastScrollY = 0;
let scrollVelocity = 0;
let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;

// Smooth scroll handling
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollVelocity = (currentScrollY - lastScrollY) * 0.001;
    lastScrollY = currentScrollY;
});

// Color transition
let colorTransition = 0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update color transition
    colorTransition += 0.005;

    // Apply scroll-based rotation with smooth damping
    rotationX += scrollVelocity * 0.5;
    rotationY += scrollVelocity * 0.8;
    rotationZ += scrollVelocity * 0.3;

    // Apply damping to scroll velocity
    scrollVelocity *= 0.95;

    // Continuous slow rotation when not scrolling
    rotationY += 0.002;

    // Rotate sphere
    sphere.rotation.x = rotationX;
    sphere.rotation.y = rotationY;
    sphere.rotation.z = rotationZ;

    // Rotate and update neon lines
    neonLines.forEach((lineData, index) => {
        lineData.mesh.rotation.x = rotationX + lineData.rotationOffset;
        lineData.mesh.rotation.y = rotationY + lineData.rotationOffset * 2;
        lineData.mesh.rotation.z = rotationZ + lineData.rotationOffset * 0.5;

        // Color transition
        const nextColorIndex = (lineData.colorIndex + 1) % neonColors.length;
        const currentColor = neonColors[lineData.colorIndex];
        const nextColor = neonColors[nextColorIndex];

        const mixAmount = (Math.sin(colorTransition + index * 0.5) + 1) * 0.5;
        const transitionColor = new THREE.Color().lerpColors(currentColor, nextColor, mixAmount);

        lineData.mesh.material.color = transitionColor;

        // Pulsing glow effect
        lineData.mesh.material.opacity = 0.7 + Math.sin(colorTransition * 2 + index * 0.3) * 0.2;
    });

    // Subtle camera movement
    camera.position.x = Math.sin(colorTransition * 0.3) * 0.1;
    camera.position.y = Math.cos(colorTransition * 0.2) * 0.1;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Start animation
animate();

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

// Enhanced lighting for organic glow
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Multiple colored lights for ethereal effect
const lights = [
    { color: 0xff00ff, pos: [5, 5, 5] },
    { color: 0x00ffff, pos: [-5, -5, 5] },
    { color: 0xff0080, pos: [0, 5, -5] },
    { color: 0x8000ff, pos: [-5, 0, 0] }
];

lights.forEach(light => {
    const pointLight = new THREE.PointLight(light.color, 1.5, 100);
    pointLight.position.set(...light.pos);
    scene.add(pointLight);
});

// Create glossy sphere with more ethereal appearance
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    metalness: 0.7,
    roughness: 0.15,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transmission: 0.1, // Slight transparency for depth
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Expanded neon color palette
const neonColors = [
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0xff00ff), // Magenta
    new THREE.Color(0xff0080), // Pink
    new THREE.Color(0x0080ff), // Blue
    new THREE.Color(0x8000ff), // Purple
    new THREE.Color(0xff00aa), // Hot pink
];

// Simple noise function for organic patterns
function noise(x, y, z) {
    return Math.sin(x * 3.5 + y * 2.3) * Math.cos(y * 2.7 + z * 3.1) * Math.sin(z * 2.1 + x * 2.9);
}

// Function to create fluid, organic curves
function createOrganicFluidCurve(index, totalCurves, time = 0) {
    const points = [];
    const segments = 120; // More segments for smoother curves
    const baseRadius = 1.53;

    // Random seed for each curve to make them unique
    const seed = index * 12.345;

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;

        // Complex wave patterns for organic, liquid-like flow
        const wave1 = Math.sin(angle * 2.5 + seed + time * 0.3) * 0.4;
        const wave2 = Math.cos(angle * 1.8 - seed * 0.5 + time * 0.2) * 0.35;
        const wave3 = Math.sin(angle * 3.2 + seed * 1.5 + time * 0.25) * 0.25;
        const wave4 = Math.cos(angle * 4.1 - seed * 0.8 + time * 0.15) * 0.2;

        // Combine waves for fluid, organic movement
        const flowOffset = wave1 + wave2 + wave3 + wave4;

        // Create flowing path with noise-like behavior
        const lat = Math.sin(angle * 1.3 + flowOffset + seed) * Math.PI * 0.7;
        const lon = angle + Math.sin(t * Math.PI * 2 + seed) * 0.8 + flowOffset * 0.5;

        // Add noise-like variation for organic feel
        const noiseVal = noise(lat + seed, lon, angle + time * 0.1) * 0.15;
        const radius = baseRadius + noiseVal;

        const x = radius * Math.cos(lat) * Math.cos(lon);
        const y = radius * Math.cos(lat) * Math.sin(lon);
        const z = radius * Math.sin(lat);

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    curve.tension = 0.3; // Smoother curves

    // Variable tube thickness for blob-like appearance
    const radiusFunction = (u) => {
        const baseThickness = 0.025 + Math.random() * 0.015;
        const variation = Math.sin(u * Math.PI * 8 + seed) * 0.015;
        return baseThickness + variation;
    };

    // Create tube with varying radius
    const tubeSegments = segments * 2;
    const radialSegments = 12;
    const geometry = new THREE.TubeGeometry(
        curve,
        tubeSegments,
        0.03, // Will be modified per vertex
        radialSegments,
        true
    );

    // Modify geometry for variable thickness
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const u = Math.floor(i / (radialSegments + 1)) / tubeSegments;
        const scale = radiusFunction(u) / 0.03;
        const vertex = new THREE.Vector3(
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
        );
        const center = curve.getPoint(u);
        vertex.sub(center).multiplyScalar(scale).add(center);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positions.needsUpdate = true;

    // Enhanced material for liquid-like glow
    const colorIndex = index % neonColors.length;
    const material = new THREE.MeshStandardMaterial({
        color: neonColors[colorIndex],
        transparent: true,
        opacity: 0.85,
        emissive: neonColors[colorIndex],
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return {
        mesh: mesh,
        colorIndex: colorIndex,
        rotationOffset: index * 0.15,
        seed: seed,
        curve: curve,
        basePoints: points
    };
}

// Create organic fluid curves
const organicCurves = [];
const curveCount = 15; // More curves for denser, more organic look

for (let i = 0; i < curveCount; i++) {
    organicCurves.push(createOrganicFluidCurve(i, curveCount));
}

// Create internal glowing particles/nodes
const particleGeometry = new THREE.SphereGeometry(0.02, 16, 16);
const particles = [];
const particleCount = 40;

for (let i = 0; i < particleCount; i++) {
    // Random position inside sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * 1.3; // Inside the sphere

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const color = neonColors[Math.floor(Math.random() * neonColors.length)];
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
    });

    const particle = new THREE.Mesh(particleGeometry, material);
    particle.position.set(x, y, z);
    scene.add(particle);

    particles.push({
        mesh: particle,
        basePosition: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        color: color
    });
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

// Animation time
let time = 0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    time += 0.008; // Animation speed

    // Apply scroll-based rotation with smooth damping
    rotationX += scrollVelocity * 0.5;
    rotationY += scrollVelocity * 0.8;
    rotationZ += scrollVelocity * 0.3;

    // Apply damping to scroll velocity
    scrollVelocity *= 0.95;

    // Continuous slow rotation when not scrolling
    rotationY += 0.003;

    // Rotate sphere
    sphere.rotation.x = rotationX;
    sphere.rotation.y = rotationY;
    sphere.rotation.z = rotationZ;

    // Animate organic curves with morphing and color transitions
    organicCurves.forEach((curveData, index) => {
        // Rotate with sphere
        curveData.mesh.rotation.x = rotationX + curveData.rotationOffset;
        curveData.mesh.rotation.y = rotationY + curveData.rotationOffset * 2;
        curveData.mesh.rotation.z = rotationZ + curveData.rotationOffset * 0.5;

        // Smooth color cycling through entire palette
        const colorProgress = (time * 0.3 + index * 0.4) % neonColors.length;
        const currentIndex = Math.floor(colorProgress);
        const nextIndex = (currentIndex + 1) % neonColors.length;
        const mixAmount = colorProgress - currentIndex;

        const currentColor = neonColors[currentIndex];
        const nextColor = neonColors[nextIndex];
        const transitionColor = new THREE.Color().lerpColors(currentColor, nextColor, mixAmount);

        curveData.mesh.material.color = transitionColor;
        curveData.mesh.material.emissive = transitionColor;

        // Pulsing glow with wave-like behavior
        const pulseAmount = Math.sin(time * 2 + index * 0.4) * 0.3 + 0.7;
        curveData.mesh.material.opacity = 0.7 * pulseAmount;
        curveData.mesh.material.emissiveIntensity = 0.5 + pulseAmount * 0.4;

        // Subtle scale variation for organic breathing effect
        const breathe = 1 + Math.sin(time * 1.5 + index * 0.3) * 0.02;
        curveData.mesh.scale.setScalar(breathe);
    });

    // Animate internal particles
    particles.forEach((particleData, index) => {
        const phase = time * particleData.speed + particleData.phase;

        // Floating motion
        const offset = new THREE.Vector3(
            Math.sin(phase * 0.8) * 0.15,
            Math.cos(phase * 1.2) * 0.15,
            Math.sin(phase * 1.5) * 0.15
        );

        particleData.mesh.position.copy(particleData.basePosition).add(offset);

        // Rotate with sphere
        particleData.mesh.rotation.x = rotationX;
        particleData.mesh.rotation.y = rotationY;
        particleData.mesh.rotation.z = rotationZ;

        // Pulsing glow
        const pulse = Math.sin(phase * 2) * 0.3 + 0.7;
        particleData.mesh.material.opacity = pulse;

        // Color cycling
        const colorProgress = (time * 0.5 + index * 0.3) % neonColors.length;
        const currentIndex = Math.floor(colorProgress);
        const nextIndex = (currentIndex + 1) % neonColors.length;
        const mixAmount = colorProgress - currentIndex;

        const transitionColor = new THREE.Color().lerpColors(
            neonColors[currentIndex],
            neonColors[nextIndex],
            mixAmount
        );
        particleData.mesh.material.color = transitionColor;

        // Dynamic scale
        const scale = 0.8 + pulse * 0.4;
        particleData.mesh.scale.setScalar(scale);
    });

    // Subtle camera movement for organic feel
    camera.position.x = Math.sin(time * 0.2) * 0.08;
    camera.position.y = Math.cos(time * 0.15) * 0.08;
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

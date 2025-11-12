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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Multiple colored lights for ethereal effect
const lights = [
    { color: 0xff00ff, pos: [4, 4, 4] },
    { color: 0x00ffff, pos: [-4, -4, 4] },
    { color: 0xff0080, pos: [0, 4, -4] },
    { color: 0x8000ff, pos: [-4, 0, 0] }
];

lights.forEach(light => {
    const pointLight = new THREE.PointLight(light.color, 1.8, 100);
    pointLight.position.set(...light.pos);
    scene.add(pointLight);
});

// Create main glossy sphere with visible form
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.05,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Add visible sphere outline for definition
const outlineGeometry = new THREE.SphereGeometry(1.505, 64, 64);
const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
});
const sphereOutline = new THREE.Mesh(outlineGeometry, outlineMaterial);
scene.add(sphereOutline);

// Add rim/edge glow to define sphere shape
const rimGeometry = new THREE.SphereGeometry(1.51, 64, 64);
const rimMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x00ffff) },
        color2: { value: new THREE.Color(0xff00ff) },
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);

            float colorMix = sin(time + vPosition.y * 2.0) * 0.5 + 0.5;
            vec3 finalColor = mix(color1, color2, colorMix);

            gl_FragColor = vec4(finalColor, fresnel * 0.6);
        }
    `,
    transparent: true,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending
});
const rimGlow = new THREE.Mesh(rimGeometry, rimMaterial);
scene.add(rimGlow);

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

// Function to create fluid patterns CONSTRAINED to sphere surface
function createOrganicFluidCurve(index, totalCurves, time = 0) {
    const points = [];
    const segments = 100;
    const baseRadius = 1.502; // Very close to sphere surface (1.5)

    // Random seed for each curve to make them unique
    const seed = index * 12.345;

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;

        // Reduced wave patterns - keep flow closer to surface
        const wave1 = Math.sin(angle * 2.5 + seed + time * 0.3) * 0.08;
        const wave2 = Math.cos(angle * 1.8 - seed * 0.5 + time * 0.2) * 0.06;
        const wave3 = Math.sin(angle * 3.2 + seed * 1.5 + time * 0.25) * 0.05;

        // Combine waves for contained fluid movement
        const flowOffset = wave1 + wave2 + wave3;

        // Create flowing path that wraps around sphere
        const lat = Math.sin(angle * 1.3 + flowOffset + seed) * Math.PI * 0.7;
        const lon = angle + Math.sin(t * Math.PI * 2 + seed) * 0.8 + flowOffset * 0.5;

        // Minimal noise variation to keep on surface
        const noiseVal = noise(lat + seed, lon, angle + time * 0.1) * 0.015;
        const radius = baseRadius + noiseVal;

        const x = radius * Math.cos(lat) * Math.cos(lon);
        const y = radius * Math.cos(lat) * Math.sin(lon);
        const z = radius * Math.sin(lat);

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    curve.tension = 0.4;

    // Thinner tubes for more liquid-like appearance
    const tubeSegments = segments * 2;
    const radialSegments = 8;
    const geometry = new THREE.TubeGeometry(
        curve,
        tubeSegments,
        0.018, // Thinner tubes
        radialSegments,
        true
    );

    // Enhanced material for liquid-like glow on surface
    const colorIndex = index % neonColors.length;
    const material = new THREE.MeshStandardMaterial({
        color: neonColors[colorIndex],
        transparent: true,
        opacity: 0.9,
        emissive: neonColors[colorIndex],
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.3,
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

// Create organic fluid curves constrained to surface
const organicCurves = [];
const curveCount = 18; // More curves but thinner

for (let i = 0; i < curveCount; i++) {
    organicCurves.push(createOrganicFluidCurve(i, curveCount));
}

// Create internal glowing particles - CLOSER to surface
const particleGeometry = new THREE.SphereGeometry(0.015, 12, 12);
const particles = [];
const particleCount = 30; // Fewer but more visible

for (let i = 0; i < particleCount; i++) {
    // Position closer to sphere surface (0.8 - 1.3 range)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.8 + Math.random() * 0.5; // Constrained closer to surface

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const color = neonColors[Math.floor(Math.random() * neonColors.length)];
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
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

    time += 0.008;

    // Apply scroll-based rotation with smooth damping
    rotationX += scrollVelocity * 0.5;
    rotationY += scrollVelocity * 0.8;
    rotationZ += scrollVelocity * 0.3;

    // Apply damping to scroll velocity
    scrollVelocity *= 0.95;

    // Continuous slow rotation when not scrolling
    rotationY += 0.003;

    // Rotate main sphere
    sphere.rotation.x = rotationX;
    sphere.rotation.y = rotationY;
    sphere.rotation.z = rotationZ;

    // Rotate outline with sphere
    sphereOutline.rotation.x = rotationX;
    sphereOutline.rotation.y = rotationY;
    sphereOutline.rotation.z = rotationZ;

    // Update rim glow
    rimGlow.rotation.x = rotationX;
    rimGlow.rotation.y = rotationY;
    rimGlow.rotation.z = rotationZ;
    rimMaterial.uniforms.time.value = time;

    // Animate organic curves with morphing and color transitions
    organicCurves.forEach((curveData, index) => {
        // Rotate with sphere - liquid flowing on surface
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
        const pulseAmount = Math.sin(time * 2 + index * 0.4) * 0.2 + 0.8;
        curveData.mesh.material.opacity = 0.85 * pulseAmount;
        curveData.mesh.material.emissiveIntensity = 0.7 + pulseAmount * 0.3;

        // Very subtle scale variation - keep contained
        const breathe = 1 + Math.sin(time * 1.5 + index * 0.3) * 0.01;
        curveData.mesh.scale.setScalar(breathe);
    });

    // Animate internal particles - CONSTRAINED movement
    particles.forEach((particleData, index) => {
        const phase = time * particleData.speed + particleData.phase;

        // Reduced floating motion - keep near surface
        const offset = new THREE.Vector3(
            Math.sin(phase * 0.8) * 0.08,
            Math.cos(phase * 1.2) * 0.08,
            Math.sin(phase * 1.5) * 0.08
        );

        particleData.mesh.position.copy(particleData.basePosition).add(offset);

        // Rotate with sphere
        particleData.mesh.rotation.x = rotationX;
        particleData.mesh.rotation.y = rotationY;
        particleData.mesh.rotation.z = rotationZ;

        // Pulsing glow
        const pulse = Math.sin(phase * 2) * 0.25 + 0.75;
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

        // Dynamic scale - keep small
        const scale = 0.9 + pulse * 0.2;
        particleData.mesh.scale.setScalar(scale);
    });

    // Very subtle camera movement for organic feel
    camera.position.x = Math.sin(time * 0.2) * 0.05;
    camera.position.y = Math.cos(time * 0.15) * 0.05;
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

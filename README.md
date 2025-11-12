# Liquid Neon Sphere - Organic Scroll Animation

A mesmerizing, full-screen web experience featuring a cohesive sphere with liquid neon flowing across its surface. Watch as organic patterns swirl and undulate on a contained, three-dimensional ball. Built with Three.js and modern web technologies.

## Features

- **Clear Spherical Form**: Recognizable sphere shape with defined edges and outline
- **Contained Liquid Flow**: Neon patterns flow smoothly on the sphere's surface, not beyond it
- **Visible Edge Definition**: Rim glow and outline maintain sphere silhouette against black background
- **Surface-Locked Patterns**: Organic curves wrap around sphere geometry following its contours
- **Internal Particles**: Glowing nodes float near the surface for depth without breaking form
- **Scroll-Based Rotation**: Liquid patterns rotate around the stationary sphere based on scroll
- **Ethereal Colors**: Seamless transitions through cyan, magenta, pink, blue, and purple
- **Contained Glow Effects**: Circular ambient layers enhance sphere boundary
- **Cohesive Aesthetic**: Like watching liquid plasma on a lava lamp or bioluminescent jellyfish
- **Split-Screen Layout**: Sphere centered on left half, scrollable content on right
- **Responsive Design**: Adapts to different screen sizes

## Technologies Used

- **Three.js** - 3D graphics rendering
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling and animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## How It Works

### The Cohesive Sphere Structure

The sphere is created using Three.js with:
- **Base Sphere**: `SphereGeometry` (radius 1.5) with `MeshPhysicalMaterial` for glossy surface
- **Visible Outline**: Additional sphere geometry (radius 1.505) with subtle cyan glow
- **Rim Lighting**: Fresnel shader creates edge definition that highlights sphere silhouette
- **Contained Curves**: `TubeGeometry` patterns stay very close to surface (radius 1.502)
- **Surface-Locked Flow**: Wave patterns constrained to 0.08-0.06 amplitude (vs 0.4 previously)
- **Near-Surface Particles**: Internal glowing nodes positioned 0.8-1.3 radius from center
- **Reduced Movement**: Minimal floating (0.08 offset) keeps particles within sphere boundary

### Scroll-Based Surface Rotation

- Scroll events track velocity for responsive rotation
- **Sphere remains stationary** while surface patterns rotate around it
- Liquid curves rotate with sphere, appearing to flow across its surface
- Smooth damping creates natural, contained movement
- Continuous gentle rotation when idle
- Very subtle camera movement (0.05 offset) enhances organic feel

### Contained Color System

- Colors cycle through entire palette: cyan → magenta → pink → blue → purple → hot pink
- Smooth color interpolation using lerp functions
- Each curve and particle has unique timing offsets
- Pulsing opacity (0.85 base) and emissive intensity for living glow
- Circular CSS glow layers enhance sphere boundary definition
- All visual elements maintain spherical coherence

## Customization

### Adjusting Colors

Edit the `neonColors` array in `js/main.js:52`:

```javascript
const neonColors = [
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0xff00ff), // Magenta
    new THREE.Color(0xff0080), // Pink
    new THREE.Color(0x0080ff), // Blue
    new THREE.Color(0x8000ff), // Purple
    new THREE.Color(0xff00aa), // Hot pink
];
```

### Changing Sphere Properties

Modify sphere properties in `js/main.js:36`:

```javascript
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64); // Radius, width, height segments
```

### Surface Flow Distance

Adjust how close patterns stay to sphere surface in `js/main.js:123`:

```javascript
const baseRadius = 1.502; // Very close to sphere (1.5). Increase slightly for more distance
```

### Wave Pattern Amplitude

Change flow amplitude while keeping patterns contained (`js/main.js:133-135`):

```javascript
const wave1 = Math.sin(angle * 2.5 + seed + time * 0.3) * 0.08; // Increase for more flow (stay under 0.15)
```

### Animation Speed

Modify the time increment in `js/main.js:258`:

```javascript
time += 0.008; // Increase for faster animation
```

### Curve Density

Increase the `curveCount` variable in `js/main.js:196`:

```javascript
const curveCount = 18; // More curves = denser surface patterns (stay under 25)
```

### Particle Count

Adjust internal glowing particles in `js/main.js:205`:

```javascript
const particleCount = 30; // More particles = richer depth (stay under 50)
```

### Rim Glow Intensity

Modify Fresnel power in shader (`js/main.js:89`):

```javascript
float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5); // Higher = stronger edge glow
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires WebGL support.

## Performance

The animation runs at 60 FPS on modern hardware. For better performance on lower-end devices:
- Reduce `curveCount` (fewer organic curves)
- Lower `particleCount` (fewer internal particles)
- Reduce sphere geometry segments (lower quality but faster)
- Decrease tube segments in `createOrganicFluidCurve` function
- Reduce `window.devicePixelRatio` cap for lower resolution rendering

## License

MIT

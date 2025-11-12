# Liquid Neon Sphere - Organic Scroll Animation

A mesmerizing, full-screen web experience featuring a living sphere of liquid neon with organic, bioluminescent animations. Built with Three.js and modern web technologies.

## Features

- **Split-Screen Layout**: Sphere fixed on the left half, scrollable content on the right
- **Organic Liquid Neon**: Smooth, flowing patterns that move like plasma across the sphere
- **Bioluminescent Particles**: Internal glowing nodes floating within the sphere for depth
- **Scroll-Based Morphing**: Fluid shapes rotate and breathe based on scroll velocity
- **Ethereal Colors**: Seamless transitions through cyan, magenta, pink, blue, and purple
- **Soft Diffused Glow**: Multiple layers of ambient light creating an organic atmosphere
- **Natural Aesthetic**: Less geometric, more organic - like watching bioluminescent life forms
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

### The Organic Sphere

The sphere is created using Three.js with:
- `SphereGeometry` for the base shape
- `MeshPhysicalMaterial` with transmission for ethereal depth
- Multiple colored point lights for organic glow effects
- Variable-thickness `TubeGeometry` curves for liquid-like patterns
- Complex wave functions and noise for organic flow
- Internal particle system with floating animation

### Scroll-Based Morphing

- Scroll events track velocity for responsive rotation
- Fluid shapes rotate and scale dynamically
- Smooth damping creates natural, organic movement
- Continuous breathing animation when idle
- Subtle camera movement enhances organic feel

### Color Transitions

- Colors cycle through entire palette: cyan → magenta → pink → blue → purple
- Smooth color interpolation using lerp functions
- Each curve and particle has unique timing offsets
- Pulsing opacity and emissive intensity for living glow
- Multiple color layers create depth and richness

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

### Adjusting Organic Flow

Change wave complexity in the `createOrganicFluidCurve` function (`js/main.js:80-83`):

```javascript
const wave1 = Math.sin(angle * 2.5 + seed + time * 0.3) * 0.4; // Adjust multipliers for different patterns
```

### Animation Speed

Modify the time increment in `js/main.js:229`:

```javascript
time += 0.008; // Increase for faster animation
```

### Adding More Curves

Increase the `curveCount` variable in `js/main.js:167`:

```javascript
const curveCount = 15; // More curves = denser organic patterns
```

### Particle Count

Adjust internal glowing particles in `js/main.js:176`:

```javascript
const particleCount = 40; // More particles = richer depth
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

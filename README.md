# Neon Sphere Scroll Animation

A dynamic, full-screen web design featuring a glowing neon sphere with scroll-based interactive animations. Built with Three.js and modern web technologies.

## Features

- **Split-Screen Layout**: Sphere fixed on the left half, scrollable content on the right
- **3D Neon Sphere**: Glossy, reflective surface with organic flowing neon line patterns
- **Scroll-Based Animation**: Line patterns rotate smoothly based on scroll velocity
- **Dynamic Colors**: Fluid transitions between magenta, pink, blue, and cyan
- **Cyberpunk Aesthetic**: Dark theme with high contrast neon effects
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

### The Sphere

The sphere is created using Three.js with:
- `SphereGeometry` for the base shape
- `MeshPhysicalMaterial` for glossy, reflective surface
- Point lights for neon glow effects
- Multiple `TubeGeometry` curves for flowing neon lines

### Scroll Animation

- Scroll events track velocity
- Rotation speed correlates with scroll speed
- Smooth damping prevents jarring movements
- Continuous slow rotation when idle

### Color Transitions

- Colors cycle through magenta → pink → blue → cyan
- Smooth interpolation between colors
- Each line has offset timing for wave effect
- Pulsing opacity for dynamic glow

## Customization

### Adjusting Colors

Edit the `neonColors` array in `js/main.js`:

```javascript
const neonColors = [
    new THREE.Color(0xff00ff), // Magenta
    new THREE.Color(0xff0080), // Pink
    new THREE.Color(0x0080ff), // Blue
    new THREE.Color(0x00ffff), // Cyan
];
```

### Changing Sphere Size

Modify the sphere radius in `js/main.js`:

```javascript
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
```

### Adjusting Rotation Speed

Change the scroll velocity multiplier:

```javascript
scrollVelocity = (currentScrollY - lastScrollY) * 0.001; // Increase for faster
```

### Adding More Lines

Increase the `curveCount` variable:

```javascript
const curveCount = 12; // Increase for more lines
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires WebGL support.

## Performance

The animation runs at 60 FPS on modern hardware. For better performance on lower-end devices:
- Reduce `curveCount`
- Lower sphere geometry segments
- Decrease `window.devicePixelRatio` cap

## License

MIT

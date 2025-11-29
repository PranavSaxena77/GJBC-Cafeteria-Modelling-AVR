# GJBC Cafeteria 3D Modelling (AR/VR Ready)

This project is an interactive 3D cafeteria model viewer built using Three.js.  
It loads a GLTF cafeteria model, provides full 3D navigation, and includes functional rotating fans.  
The viewer can be extended for AR/VR applications, architectural walkthroughs, and virtual simulations.

## Features

### Load and Render the Cafeteria Model
- Uses GLTFLoader to load the 3D model.
- Includes lighting, scaling, and responsive window resizing.
- Offers smooth rendering and interaction.

### First-Person Camera Navigation
A custom camera control system is implemented with:
- W / A / S / D for movement
- Space and Shift for moving up and down
- Mouse drag for looking around (yaw and pitch)
- Scroll wheel for zooming
- Rotation limits to prevent unnatural flipping

### Dynamic Fan Rotation
Fans inside the cafeteria rotate and can be controlled in real time.  
Any mesh with the name “fan” or “propeller” is automatically detected.

Fan controls:
- `[` decreases fan speed
- `]` increases fan speed
- `F` changes the rotation axis (x, y, or z)

### Responsive Fullscreen Rendering
- The renderer automatically fits the browser window.
- Supports high-performance rendering through WebGL.
- Minimal interface for a clean viewing experience.

## Controls Overview

### Mouse
- Left click + drag to look around
- Scroll wheel to zoom

### Keyboard
- W / A / S / D to move
- Space to move up
- Shift to move down
- `[` and `]` to adjust fan speed
- F to change the fan rotation axis

## Technologies Used

- Three.js
- WebGL
- JavaScript (ES Modules)
- GLTFLoader

## How to Run the Project Locally

### Method 1: Using VS Code
1. Install the “Live Server” extension.
2. Right-click `index.html` and select **Open with Live Server**.

### Method 2: Using a Local Node.js Server
Run the following commands:

```bash
npm install -g http-server
http-server .

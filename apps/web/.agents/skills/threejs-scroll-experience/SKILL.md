---
name: threejs-scroll-experience
description: Build and improve production-quality scroll-driven 3D web experiences using Three.js, React Three Fiber, Drei, GLTF/GLB models, GSAP, and ScrollTrigger.
---

# Three.js Scroll Experience Skill

Use this skill when implementing or modifying interactive 3D experiences, especially scroll-driven Three.js or React Three Fiber websites.

## Core Principle

Treat 3D elements as part of the website's visual storytelling and composition, not as decorative objects floating above the DOM.

For scroll-driven experiences, think in terms of:

SCENE
→ TRANSITION
→ SCENE
→ TRANSITION
→ SCENE

Do not default to continuously moving objects based directly on global scroll progress.

Create intentional resting states where the 3D object remains relatively stationary while surrounding DOM content animates or changes.

## Technology Selection

Analyze the existing project before implementing.

If the project uses React or Next.js, prefer:

- React Three Fiber
- Drei
- Three.js
- GSAP
- GSAP ScrollTrigger

Use raw Three.js when it better fits the existing architecture.

Do not unnecessarily migrate a working Three.js implementation to React Three Fiber unless there is a clear architectural benefit.

## 3D Model Quality

For primary visual objects, prefer production-quality GLTF/GLB models over manually constructing complex objects from primitive Three.js geometry.

Primitive geometry is acceptable for:

- Prototypes
- Background objects
- Particles
- Simple abstract elements

Do not construct the main hero spacecraft or similarly important visual centerpiece from obvious combinations of:

- BoxGeometry
- CylinderGeometry
- ConeGeometry
- Basic ExtrudeGeometry

unless the requested visual style specifically calls for low-poly geometry.

For high-quality centerpiece assets, prefer:

GLTF/GLB model
→ optimized geometry
→ compressed textures
→ PBR materials
→ environment lighting
→ scene-specific lights

Use GLTFLoader or useGLTF depending on the architecture.

Support Draco and/or Meshopt compression when appropriate.

## Materials

Prefer physically based materials.

Correctly configure:

- MeshStandardMaterial
- MeshPhysicalMaterial
- metalness
- roughness
- emissive properties
- normal maps
- roughness maps
- metalness maps
- environment maps

Avoid making every surface use the same material.

Create material variation so the object's geometry remains readable.

## Lighting

Lighting must reveal the shape of the 3D model.

Use a deliberate lighting setup rather than relying only on AmbientLight.

Consider:

- Key light
- Fill light
- Rim/back light
- Environment lighting
- Directional lights
- Point lights for local effects

Avoid excessive ambient illumination that makes the model appear flat.

When appropriate, use an HDRI/environment map for reflections and PBR material response.

## Camera

Treat the camera as part of the animation.

Do not animate only the object's X and Y coordinates.

Consider:

- Camera position
- Camera target
- Field of view
- Object depth
- Object distance from camera
- Perspective changes

Use Z-axis movement and camera distance to create a genuine sense of depth.

Avoid using scale alone to simulate all depth changes.

## Scroll Architecture

For complex scroll experiences, define explicit scenes.

Example:

Scene 1 — Hero introduction
Scene 2 — First content composition
Scene 3 — Transition/fly-through
Scene 4 — Second content composition
Scene 5 — Final approach
Scene 6 — Landing

Each scene should define:

- Object position
- Object rotation
- Object depth
- Camera state
- Content state
- Lighting state where appropriate

Use GSAP timelines and ScrollTrigger to coordinate these states.

Use pinned or sticky sections when appropriate.

Do not automatically map the entire document scroll from 0 to 1 and continuously interpolate every property unless that behavior is explicitly desired.

Allow sections of scroll progress where:

- The object is stationary
- The camera is stationary
- DOM content animates
- Text appears around the 3D object

Then transition to the next scene.

## Motion

Movement should communicate weight and direction.

When a spacecraft changes direction:

- Bank into turns
- Rotate toward the direction of travel
- Use appropriate acceleration
- Use appropriate deceleration

Avoid repetitive left-right zigzagging.

Avoid arbitrary rotation values that do not correspond to movement.

Use quaternion interpolation where useful to avoid Euler rotation artifacts.

## Engine and Thruster Effects

Do not represent high-quality exhaust using a simple chain of identical opaque spheres.

Prefer techniques such as:

- Particle systems
- Instanced particles
- Transparent sprites
- Shader-based exhaust
- Additive blending
- Layered transparent geometry

Engine intensity should respond to motion.

Acceleration:
Strong exhaust

Cruising:
Moderate exhaust

Stationary:
Low or idle exhaust

Landing:
Controlled thrust

Landed:
Off or minimal idle state

## DOM and 3D Coordination

Treat DOM typography and 3D objects as one composition.

When the 3D object reaches a scene:

1. Object enters.
2. Object decelerates.
3. Object settles.
4. Content reveals around it.
5. Content remains readable.
6. Content exits or transitions.
7. Object begins moving again.

Do not allow the 3D canvas to unintentionally block website interactions.

Use pointer-events appropriately.

## Landing Sequences

Landing must make physical and visual sense for the selected vehicle.

Determine:

- Vehicle orientation
- Landing direction
- Ground contact point
- Landing gear or resting surface
- Deceleration
- Final rotation

Do not simply rotate an object 90 degrees because it reached the bottom of the screen.

The final position must visually communicate that the vehicle is resting on a surface.

## Performance

Optimize for web delivery.

Consider:

- GLB compression
- Draco
- Meshopt
- Texture compression
- KTX2
- Reduced texture resolution
- Geometry complexity
- Draw calls
- Instancing
- Device pixel ratio

Do not render unnecessarily at full devicePixelRatio on high-DPI devices.

Pause or reduce rendering when appropriate.

Properly dispose:

- Geometry
- Materials
- Textures
- Render targets

Respect prefers-reduced-motion.

Provide simplified behavior for lower-performance/mobile devices when necessary.

## Responsive Design

Do not simply multiply desktop coordinates by a mobile scale factor.

Evaluate mobile composition independently.

Adjust:

- Camera
- Model position
- Model scale
- Scene composition
- Scroll duration

Ensure important content remains readable.

## Visual Validation

After implementing any major 3D change, use available browser automation or browser tools to inspect the rendered result.

Do not consider successful compilation proof that the implementation is visually correct.

Inspect multiple scroll positions.

For scroll-driven experiences, check at minimum:

0%
10%
25%
50%
75%
90%
100%

Check:

- Object scale
- Composition
- Lighting
- Rotation
- Depth
- Text overlap
- Clipping
- Scroll transitions
- Landing position

Test desktop and mobile.

Iterate based on the actual rendered result.

## Priority Order

When improving an existing 3D experience, prioritize:

1. Model quality
2. Composition
3. Camera
4. Lighting
5. Materials
6. Motion
7. Scroll synchronization
8. Secondary effects
9. Performance optimization

Do not compensate for a poor 3D model by adding excessive particles, glow, or post-processing.

The core 3D asset and composition must work first.
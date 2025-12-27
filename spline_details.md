# Spline 3D: Comprehensive Guide for React & Web Integration

## 1. What is Spline?

**Spline** is a collaborative 3D design tool that allows you to create interactive 3D web experiences directly in the browser. It stands out because it combines the ease of use of 2D design tools (like Figma) with the power of 3D rendering.

*   **Real-time Collaboration:** Work with teams in real-time.
*   **Web-First:** Designs are optimized for web performance.
*   **No Code Required:** You can create interactions, animations, and states without writing a single line of code, though the code API is available for advanced control.

---

## 2. Key Features

*   **Modeling:** Create basic shapes or complex geometries.
*   **Materials & Shading:** Advanced materials including glass, fresnel, noise, and PBR (Physically Based Rendering).
*   **Animation:** Timeline-based animation system for objects and cameras.
*   **Interactivity:**
    *   **States:** Define different states for objects (e.g., hover, press).
    *   **Events:** Application logic within the tool (Mouse Down, Mouse Hover, Key Press, Start, Scroll).
    *   **Game Controls:** First-person or orbit camera controls.
    *   **Physics:** Rigid body physics for realistic collisions and gravity.

---

## 3. Integrating with React

Spline provides an official library `@splinetool/react-spline` to easily embed scenes.

### 3.1 Installation

```bash
npm install @splinetool/react-spline @splinetool/runtime
# or
yarn add @splinetool/react-spline @splinetool/runtime
```

### 3.2 Basic Usage

1.  **Export from Spline:**
    *   Open your scene in Spline.
    *   Click the **Export** button in the toolbar.
    *   Choose **Code** -> **React**.
    *   Copy the URL provided (e.g., `https://prod.spline.design/your-scene-id/scene.splinecode`).

2.  **Implement in Component:**

```jsx
import Spline from '@splinetool/react-spline';

export default function My3DComponent() {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Spline scene="https://prod.spline.design/PASTE_YOUR_SCENE_URL_HERE/scene.splinecode" />
    </div>
  );
}
```

### 3.3 Application Support (Next.js)

Since Spline relies on the `window` object (which doesn't exist on the server), Next.js requires a specific import to handle Server-Side Rendering (SSR) correctly.

**For Next.js App Router & Pages Router:**

```jsx
import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main>
      <Spline scene="https://prod.spline.design/your-scene/scene.splinecode" />
    </main>
  );
}
```

---

## 4. Advanced Interactivity (Code API)

You can control the Spline scene from your React state (e.g., clicking a HTML button to move a 3D object).

### 4.1 Accessing the Spline Application Ref

Use the `onLoad` prop to get access to the Spline app instance.

```jsx
import { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function InteractiveScene() {
  const splineRef = useRef();

  function onLoad(splineApp) {
    // save the app instance to the ref
    splineRef.current = splineApp;
  }

  function triggerAnimation() {
    // Access objects by name
    const cube = splineRef.current.findObjectByName('Cube');
    
    // Modify properties directly
    if (cube) {
      cube.position.x += 10;
    }
  }

  return (
    <div>
      <button onClick={triggerAnimation}>Move Cube</button>
      <Spline 
        scene="https://prod.spline.design/your-scene/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
}
```

### 4.2 Handling Spline Events

You can listen for specific events triggered from within the 3D scene (e.g., when a user clicks a specific 3D object).

```jsx
function onSplineMouseDown(e) {
  if (e.target.name === 'MyButtonObject') {
    console.log('3D Button was clicked!');
    // Trigger React navigation or state update here
  }
}

// In render:
<Spline 
  scene="..." 
  onMouseDown={onSplineMouseDown} 
/>
```

**Supported Event Props:**
*   `onMouseDown`
*   `onMouseUp`
*   `onMouseHover`
*   `onKeyDown`
*   `onKeyUp`
*   `onStart`
*   `onLookAt`
*   `onFollow`

---

## 5. Performance Best Practices

3D on the web can be heavy. Follow these tips to keep your site fast:

1.  **Polygon Count:** Keep geometry simple. Use "Low Poly" meshes where possible.
2.  **Texture Size:** Avoid 4k textures. Use compressed JPEGs or WebP. 1024x1024 is usually sufficient.
3.  **Lazy Loading:** Spline canvases are heavy. Only load them when they scroll into view (the library handles some of this, but you can wrap it in a `Suspense` or conditional render).
4.  **Scene Optimization:** In the Spline export settings, you can choose to "Zoom" (optimizes for different screens) and enable compression.

## 6. Resources

*   **Official Docs:** [docs.spline.design](https://docs.spline.design/)
*   **Spline Community:** Explore scenes created by others for inspiration.
*   **React Library:** [npmjs.com/package/@splinetool/react-spline](https://www.npmjs.com/package/@splinetool/react-spline)

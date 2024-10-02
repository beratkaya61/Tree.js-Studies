const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//When initializing the renderer, enable anti-aliasing for smoother edges:
//hight pixel ratio
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Set Reinhard tone mapping and exposure
// Reinhard tone mapping is a method used to map high dynamic range (HDR) values to a displayable range, ensuring that very bright and very dark parts of the scene are balanced properly.
// This technique helps in handling overexposed lighting in a scene, making it look more natural.
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.0; // Adjust exposure (default is 1.0)

// Set background color
renderer.setClearColor(0x95b7b7); // Blue background

document.body.appendChild(renderer.domElement);

// Directional light (simulates sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7).normalize(); // Position light above and to the side
scene.add(directionalLight);

// Ambient light (softens shadows and ensures no part is too dark)
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Adjust intensity as needed
scene.add(ambientLight);

//for draw shere on screen
// const geometry = new THREE.SphereGeometry(2, 32, 32);
// const material = new THREE.MeshStandardMaterial({
//   color: 0x888888,
//   transparent: true,
//   opacity: 0.5, // Set transparency
//   metalness: 0.7,
//   roughness: 0.2,
// });
// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

// Load GLB model
const loader = new THREE.GLTFLoader();

// Create a group to hold both the model and ground,gridHelper
const group = new THREE.Group();

loader.load(
  "/models/excavator.glb",
  function (gltf) {
    const model = gltf.scene;

    model.position.set(0, 0.5, 0); // Adjust position over grid to avoid clipping
    model.scale.set(2, 2, 2); // Adjust scale if needed

    //Apply high-quality materials
    model.traverse(function (node) {
      if (node.isMesh) {
        // Adjust wireframe color by creating a new material
        //(shaded wireframe)
        node.material = new THREE.MeshStandardMaterial({
          color: 0x999999, // 0xffffff
          //wireframe: true,
          alphaTest: 0.5, // Discard pixels with alpha < 0.5
          transparent: true, // Optional: Allows for handling of transparent textures
          side: THREE.DoubleSide, // Render both sides (optional)
          opacity: 0.5, // Set transparency
          wireframeLinewidth: 50, //Control wireframe line thickness
          //flatShading: true, // Optionally use flat shading
          metalness: 0.5, // For shininess
          roughness: 0.1, // Control roughness
        });

        // Highlight the mesh by changing its material color
        //node.material.color.set(Math.random() * 0xffffff); // Random color for each part
      }
    });

    ///******************************************************************** */

    // Calculate the bounding box of the model
    const box = new THREE.Box3().setFromObject(model);
    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;
    const depth = box.max.z - box.min.z;

    // Position arrows at the ends of the bounding box

    const _position = new THREE.Vector3(box.min.x, box.min.y, box.min.z);

    function createLine(start, end, color) {
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: color });
      return new THREE.Line(geometry, material);
    }

    ///***************************************************************** */
    // Create lines for each dimension
    const lineX = createLine(
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      0xff0000
    ); // Red for width

    createTextLabel(
      `${width.toFixed(2) * 10} cm`,
      new THREE.Vector3(box.max.x, box.min.y, box.min.z)
        .clone()
        .add(new THREE.Vector3(-box.max.x * 0.5, 0.05, 0)),
      0xff0000,
      [false, false, false],
      [0, Math.PI, 0]
    );

    ////******************************************************************* */
    const lineY = createLine(
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.min.x, box.max.y, box.min.z),
      0x00ff00
    ); // Green for height

    createTextLabel(
      `${height.toFixed(2) * 10} cm`,
      new THREE.Vector3(box.min.x, box.getCenter().y, box.min.z)
        .clone()
        .add(new THREE.Vector3(0, 0, 0.05)),
      0x00ff00,
      [false, false, false],
      [0, -Math.PI / 2, 0]
    );

    ///*********************************************************************** */
    const lineZ = createLine(
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.min.x, box.min.y, box.max.z),
      0x0000ff
    ); // Blue for depth

    createTextLabel(
      `${depth.toFixed(2) * 10} cm`,
      new THREE.Vector3(box.min.x, box.min.y, box.getCenter().z)
        .clone()
        .add(new THREE.Vector3(0, 0.05, 0)),
      0x0000ff,
      [true, false, true],
      [0, Math.PI / 2, 0]
    );

    scene.add(lineX);
    scene.add(lineY);
    scene.add(lineZ);

    // Create ArrowHelpers
    // const arrowX = new THREE.ArrowHelper(
    //   new THREE.Vector3(1, 0, 0),
    //   _position,
    //   width,
    //   0xff0000
    // ); // Red for width

    // const arrowY = new THREE.ArrowHelper(
    //   new THREE.Vector3(0, 1, 0),
    //   _position,
    //   height,
    //   0x00ff00
    // ); // Green for height

    // const arrowZ = new THREE.ArrowHelper(
    //   new THREE.Vector3(0, 0, 1),
    //   _position,
    //   depth,
    //   0x0000ff
    // ); // Blue for depth

    // scene.add(arrowX);
    // scene.add(arrowY);
    // scene.add(arrowZ);

    ///******************************************************************** */

    group.add(model);

    scene.add(group);

    animate();
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Function to create a text label
function createTextLabel(text, position, color, mirror, rotate) {
  const loader = new THREE.FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: 0.1,
        height: 0.01,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeo, textMaterial);
      textMesh.scale.set(
        mirror[0] ? -1 : 1,
        mirror[1] ? -1 : 1,
        mirror[2] ? -1 : 1
      ); //mirror effect

      textMesh.position.copy(position);
      textMesh.rotation.set(rotate[0], rotate[1], rotate[2]); // Rotate on X, Y, Z axes
      scene.add(textMesh);
    },
    undefined,
    function (error) {
      console.error("Error loading fontttt:", error);
    }
  );
}

// Camera position
camera.position.set(0, 2, 3); // Set a starting position for the camera
camera.lookAt(scene.position); // Ensure the camera is looking at the model

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
// Adjust the speed of rotation, zoom, and pan
controls.rotateSpeed = 0.5; // Slower rotation
controls.zoomSpeed = 0.5; // Slower zoom
controls.panSpeed = 0.5; // Slower panning

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add GridHelper
const gridSize = 6; // Constant size of the grid
const gridDivisions = 15; // Number of divisions (controls how many lines are drawn)
const gridHelper = new THREE.GridHelper(
  gridSize,
  gridDivisions,
  0x808080,
  0x808080
);
group.add(gridHelper);

// Add ground plane
// const groundGeometry = new THREE.PlaneGeometry(6, 6); // Create a plane geometry (6x6 units)
// const groundMaterial = new THREE.MeshStandardMaterial();
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat (facing up)
// ground.position.y = -1; // Move the ground slightly down to avoid intersecting with the model
// group.add(ground);

function animate() {
  requestAnimationFrame(animate);
  // Update the controls for damping to work
  controls.update();
  //group.rotation.y += 0.01; //rotate group(rotate model,ground,gridHelper vs.)
  renderer.render(scene, camera);
}

// Variables to control movement speed
const moveSpeed = 0.05; // Camera movement speed
const rotationSpeed = 0.01; // Camera rotation speed

// Event listener for key presses to move the camera
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp": // Move forward
      camera.position.z -= moveSpeed;
      break;
    case "ArrowDown": // Move backward
      camera.position.z += moveSpeed;
      break;
    case "ArrowLeft": // Rotate left
      camera.rotation.y += rotationSpeed;
      break;
    case "ArrowRight": // Rotate right
      camera.rotation.y -= rotationSpeed;
      break;
    case "w": // Move up
      camera.position.y += moveSpeed;
      break;
    case "s": // Move down
      camera.position.y -= moveSpeed;
      break;
  }
});

// Handle window resizing
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

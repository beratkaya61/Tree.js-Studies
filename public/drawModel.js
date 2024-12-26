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

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows

// Set background color
renderer.setClearColor(0x95b7b7); // Blue background

document.body.appendChild(renderer.domElement);

// Directional light (simulates sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7).normalize(); // Position light above and to the side
directionalLight.castShadow = true; // Enable shadow casting for the light
directionalLight.shadow.mapSize.width = 2048; // Set shadow map size
directionalLight.shadow.mapSize.height = 2048; // Set shadow map size
directionalLight.shadow.camera.near = 0.5; // Set shadow camera near value
directionalLight.shadow.camera.far = 50; // Set shadow camera far value
scene.add(directionalLight);

// Ambient light (softens shadows and ensures no part is too dark)
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Adjust intensity as needed
scene.add(ambientLight);

//for draw sphere on screen with increased radius
const geometry = new THREE.SphereGeometry(2.5, 32, 32); // Increased radius to 2.5
const material = new THREE.MeshStandardMaterial({
  color: 0x888888,
  transparent: true,
  opacity: 0.5, // Set transparency
  metalness: 0.7,
  roughness: 0.2,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true; // Enable shadow casting for the sphere
sphere.receiveShadow = true; // Enable shadow receiving for the sphere
scene.add(sphere);

// Adjust the position and scale of the sphere to cover the model
sphere.position.set(0, 0.5, 0); // Adjust position to match the model's position
sphere.scale.set(2, 2, 2); // Adjust scale to cover the model

// Load GLB model
const loader = new THREE.GLTFLoader();

// Create a group to hold both the model and ground,gridHelper
const group = new THREE.Group();

loader.load(
  "/models/truck.glb",
  function (gltf) {
    const model = gltf.scene;

    model.position.set(0, 0.5, 0); // Adjust position over grid to avoid clipping
    model.scale.set(2, 2, 2); // Adjust scale if needed

    // Apply high-quality materials
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = new THREE.MeshStandardMaterial({
          color: 0x999999,
          alphaTest: 0.5,
          transparent: false,
          side: THREE.DoubleSide,
          opacity: 0.5,
          metalness: 0.5,
          roughness: 0.1,
        });

        // Enable shadows for the mesh
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // Calculate the bounding box of the model
    const box = new THREE.Box3().setFromObject(model);

    // Position arrows at the ends of the bounding box
    const _position = new THREE.Vector3(box.min.x, box.min.y, box.min.z);

    calculateDimensions(box);

    group.add(model);

    scene.add(group);

    animate();
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows

// Add ground plane to receive shadows
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
ground.position.y = -2.5; // Position the ground below the sphere
ground.receiveShadow = true; // Enable shadow receiving for the ground
scene.add(ground);

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

function createLine(start, end, color) {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: color });
  return new THREE.Line(geometry, material);
}

function calculateDimensions(box) {
  const width = box.max.x - box.min.x;
  const height = box.max.y - box.min.y;
  const depth = box.max.z - box.min.z;

  ///***************************************************************** */
  // Create lines for each dimension
  const lineX = createLine(
    new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    0xff0000
  ); // Red for width

  createTextLabel(
    //`${width.toFixed(2) * 10} cm`,
    `2.44 m`,
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
    `${((height * 2.44 * 10) / 7.3).toFixed(2)} m`,
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
    `${((depth * 2.44 * 10) / 7.3).toFixed(2)} m`,
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

// ----------------- Add ground plane  --------------------
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
  //scene.rotation.y += 0.01; //rotate group(rotate model,ground,gridHelper vs.)
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

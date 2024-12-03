import {
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    Clock,
    LoadingManager,
    Mesh,
    MeshBasicMaterial,
    MirroredRepeatWrapping,
    NearestFilter,
    OrthographicCamera,
    PerspectiveCamera,
    RepeatWrapping,
    Scene,
    SRGBColorSpace,
    Texture,
    TextureLoader,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";

// Textures

const loadingManager = new LoadingManager();

loadingManager.onStart = () => {
    console.log("onStart");
};
loadingManager.onLoad = () => {
    console.log("onLoad");
};
loadingManager.onProgress = () => {
    console.log("onProgress");
};
loadingManager.onError = () => {
    console.log("onError");
};

const textureLoader = new TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/minecraft.png");
const alphaTexture = textureLoader.load("/alpha.jpg");
const ambientOcculusionTexture = textureLoader.load("/ambientOcculusion.jpg");
const heightTexture = textureLoader.load("/height.jpg");
const metalnessTexture = textureLoader.load("/metalness.jpg");
const normalTexture = textureLoader.load("/normal.jpg");


// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 2;
// colorTexture.wrapS = MirroredRepeatWrapping
// colorTexture.wrapT = RepeatWrapping

// colorTexture.offset.x = .5
// colorTexture.offset.y = .5


// colorTexture.rotation = 1
// colorTexture.center.x = .5;
// colorTexture.center.y = .5


// colorTexture.minFilter = NearestFilter // for big images get smaller
colorTexture.generateMipmaps = false
colorTexture.magFilter = NearestFilter // for small images get bigger
// nearestFilter is better for performance


const gui = new GUI({
    width: 300,
    title: "nice debug UI",
    // closeFolders: true
});
// gui.close()
const debugObject = {
    color: "#d70404",
};

const cursor = {
    x: 0,
    y: 0,
};
window.addEventListener("mousemove", e => {
    cursor.x = e.clientX / window.innerWidth - 0.5;
    cursor.y = e.clientY / window.innerHeight - 0.5;
    // console.log(cursor);
});

const canvas = document.querySelector("canvas.webgl");

const scene = new Scene();

const geometry = new BoxGeometry(1, 1, 1, 10, 10, 10);

// const count = 500; // triangle
// const verticesCount = count * 3;
// const points = verticesCount * 3;
// console.log(points)
// const positionsArray = new Float32Array(points)
// for(let i = 0; i < points;i++){
//     positionsArray[i] = (Math.random() - .5) * 4
// }
// const positionBuffer = new BufferAttribute(positionsArray,3);
// geometry.setAttribute("position",positionBuffer)
colorTexture.colorSpace = SRGBColorSpace;
const material = new MeshBasicMaterial({
    // color: debugObject.color,
    // wireframe: true,
    map: colorTexture,
});

const cube = new Mesh(geometry, material);
cube.rotateX = 0;

scene.add(cube);
const folder = gui.addFolder("lol");
// folder.close()
folder.add(cube.position, "y").min(-3).max(3).step(0.01).name("change y");
folder.add(cube, "visible");
folder.add(material, "wireframe");
folder.addColor(debugObject, "color").onChange(value => {
    material.color.set(debugObject.color);
});
debugObject.spin = () => {
    gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + 2 * Math.PI });
};
folder.add(debugObject, "spin");

debugObject.subdivision = 2;
folder
    .add(debugObject, "subdivision")
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(value => {
        cube.geometry.dispose();
        cube.geometry = new BoxGeometry(1, 1, 1, value, value, value);
    });

// to tweak a variable
// let x = 10; //this is cannot be tweaked
// const container = {
//     x: 10,
// };
// gui.add(container, "x").min(0).max(100).step(1);

const sizes = {
    with: window.innerWidth,
    height: window.innerHeight,
};
window.addEventListener("resize", _ => {
    sizes.with = innerWidth;
    sizes.height = innerHeight;

    camera.aspect = sizes.with / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.with, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("dblclick", () => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

const camera = new PerspectiveCamera(75, sizes.with / sizes.height, 0.1, 100);
camera.position.z = 3;

scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

const renderer = new WebGLRenderer({
    canvas,
});
renderer.setSize(sizes.with, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Animation
const clock = new Clock(); // start counting start from zero // don't use get delta from that class
let time = Date.now();
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Alternate solution for this is to using clock

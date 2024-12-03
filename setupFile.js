import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";



const canvas = document.querySelector("canvas.webgl");

const scene = new Scene();



const sizes = {
    with: window.innerWidth,
    height: window.innerHeight,
};


const camera = new PerspectiveCamera(75, sizes.with / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();



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


const renderer = new WebGLRenderer({
    canvas,
});
renderer.setSize(sizes.with, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);



const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();